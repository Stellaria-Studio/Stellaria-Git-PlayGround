const CORE = [
  'FIRST_CONTACT',
  'BRANCH_EXPLORER',
  'CHECKLIST_KEEPER',
  'REVIEW_PASS',
  'RETURNING_CONTRIBUTOR',
  'GREEN_LIGHT',
];

const CORE_SET = new Set(CORE);
const REPO = 'Stellaria-Studio/Stellaria-Git-PlayGround';
const BRANCH = 'master';

const form = document.querySelector('#lookup-form');
const input = document.querySelector('#credential-input');
const statusBox = document.querySelector('#status');
const result = document.querySelector('#result');
const copyBadgeButton = document.querySelector('#copy-badge');

let currentRecord = null;
let rosterEntries = [];
let achievementRarity = new Map();

function normalizeInput(value) {
  let text = String(value || '').trim();
  if (text.startsWith('@')) text = text.slice(1);
  if (/^SPC-GIT-/i.test(text)) text = text.replace(/^SPC-GIT-/i, '');
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(text)) {
    throw new Error('请输入有效的 GitHub ID 或 SPC-GIT-<GitHub-ID>。');
  }
  return text;
}

function localCredentialUrl(login) {
  return `./credentials/${encodeURIComponent(login)}.json`;
}

function rawCredentialUrl(login) {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/credentials/${encodeURIComponent(login)}.json`;
}

function rawBadgeUrl(login) {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/badges/${encodeURIComponent(login)}.svg`;
}

async function fetchJsonCandidates(urls) {
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      return { data: await response.json(), source: url };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Record not found.');
}

async function fetchRecord(login, visited = new Set()) {
  const key = login.toLowerCase();
  if (visited.has(key)) throw new Error('Credential alias loop detected.');
  visited.add(key);

  const found = await fetchJsonCandidates([localCredentialUrl(login), rawCredentialUrl(login)]);
  const record = found.data;

  if (record?.status === 'renamed' && record?.renamed_to) {
    const resolved = await fetchRecord(record.renamed_to, visited);
    return {
      ...resolved,
      aliasFrom: login,
      aliasRecord: record,
    };
  }

  return found;
}

function verifyRecord(record) {
  if (!record || record.status === 'renamed') return false;
  const expectedId = `SPC-GIT-${record.holder}`;
  const idMatches = String(record.credential_id || '').toLowerCase() === expectedId.toLowerCase();
  const issuerMatches = record.issuer === 'Stellaria Git PlayGround';
  const stableSubject = !record.github_user_id || record.subject === `github-user:${record.github_user_id}`;
  return Boolean(record.holder && idMatches && issuerMatches && stableSubject);
}

function text(id, value) {
  document.querySelector(id).textContent = value;
}

function scoreFor(record) {
  const achievements = Array.isArray(record.achievements) ? record.achievements : [];
  const core = CORE.filter(code => achievements.includes(code)).length;
  const bonus = achievements.filter(code => !CORE_SET.has(code) && !code.startsWith('TUITION_PAID_')).length;
  const tuition = achievements.filter(code => code.startsWith('TUITION_PAID_')).length;
  const prestige = Array.isArray(record.prestige) ? record.prestige.length : 0;
  const pass = Boolean(record.aethra_fanwork_pass?.active || record.aethra_fanwork_pass === true);
  return core * 100 + bonus * 25 + tuition * 60 + prestige * 10 + (pass ? 500 : 0);
}

function renderChips(containerSelector, values, withRarity = false) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = '';
  if (!Array.isArray(values) || values.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'empty';
    empty.textContent = 'None yet';
    container.appendChild(empty);
    return;
  }

  for (const value of values) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = value;
    if (withRarity && achievementRarity.has(value)) {
      const rarity = achievementRarity.get(value);
      chip.title = `Observed on ${rarity.count}/${rarity.total} active credentials · ${rarity.percent.toFixed(1)}%`;
      if (rarity.percent <= 10) chip.dataset.rarity = 'legendary';
      else if (rarity.percent <= 30) chip.dataset.rarity = 'rare';
    }
    container.appendChild(chip);
  }
}

function renderEvidence(items) {
  const container = document.querySelector('#evidence');
  container.innerHTML = '';
  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'empty';
    empty.textContent = 'No evidence entries.';
    container.appendChild(empty);
    return;
  }

  for (const item of [...items].reverse()) {
    const link = document.createElement('a');
    link.href = item.url || `https://github.com/${REPO}/pull/${item.pull_request}`;
    link.target = '_blank';
    link.rel = 'noreferrer';

    const left = document.createElement('span');
    left.textContent = `Pull Request #${item.pull_request ?? '?'}`;
    const right = document.createElement('small');
    right.textContent = item.merged_at ? new Date(item.merged_at).toLocaleString() : 'merged evidence';

    link.append(left, right);
    container.appendChild(link);
  }
}

function renderRecord(record, sourceUrl) {
  currentRecord = record;
  const achievements = new Set(record.achievements || []);
  const coreCount = CORE.filter(code => achievements.has(code)).length;
  const passActive = Boolean(record.aethra_fanwork_pass?.active);
  const clearance = record.clearance || {
    level: coreCount,
    code: `SPC-CL-${coreCount}`,
    title: 'Legacy credential',
  };

  document.querySelector('#verify-chip').textContent = 'VERIFIED · CANONICAL RECORD';
  text('#credential-id', record.credential_id || 'Unknown credential');
  text('#holder', `@${record.holder || 'unknown'} · issued by ${record.issuer || 'unknown'}`);
  text('#clearance-code', clearance.code || `SPC-CL-${coreCount}`);
  text('#clearance-title', clearance.title || 'PlayGround clearance');
  text('#callsign', record.callsign || 'UNASSIGNED');
  text('#core-progress', `${coreCount} / ${CORE.length}`);
  text('#aethra-pass', passActive ? 'ACTIVE' : 'INACTIVE');
  text('#signal-score', String(scoreFor(record)));
  text('#updated-at', record.updated_at ? new Date(record.updated_at).toLocaleString() : '—');
  text('#subject-id', record.github_user_id ? `GH-${record.github_user_id}` : 'LEGACY');

  const passEl = document.querySelector('#aethra-pass');
  passEl.style.color = passActive ? '#d8b4fe' : '';

  renderChips('#achievements', record.achievements || [], true);
  renderChips('#prestige', record.prestige || []);
  renderChips('#aliases', record.aliases || []);
  renderEvidence(record.evidence || []);

  const badge = document.querySelector('#badge');
  badge.src = `./badges/${encodeURIComponent(record.holder)}.svg`;
  badge.onerror = () => {
    badge.onerror = null;
    badge.src = rawBadgeUrl(record.holder);
  };

  const recordLink = document.querySelector('#record-link');
  recordLink.href = sourceUrl || rawCredentialUrl(record.holder);

  result.classList.remove('hidden');
}

async function verify(value) {
  statusBox.className = 'status';
  statusBox.textContent = 'Contacting Mission Control…';
  result.classList.add('hidden');

  try {
    const requestedLogin = normalizeInput(value);
    const found = await fetchRecord(requestedLogin);
    const data = found.data;

    if (!verifyRecord(data)) {
      throw new Error('找到了记录，但 canonical issuer / subject / credential ID 校验不匹配。');
    }

    renderRecord(data, found.source);
    statusBox.className = 'status ok';
    statusBox.textContent = found.aliasFrom
      ? `Alias resolved: @${found.aliasFrom} → @${data.holder} · Verified ${data.credential_id}`
      : `Verified: ${data.credential_id}`;

    const url = new URL(window.location.href);
    url.searchParams.set('id', data.credential_id);
    history.replaceState(null, '', url);
  } catch (error) {
    currentRecord = null;
    statusBox.className = 'status error';
    statusBox.textContent = `Verification failed: ${error.message}`;
  }
}

function calculateRarity(entries) {
  achievementRarity = new Map();
  const total = Math.max(entries.length, 1);
  const counts = new Map();
  for (const entry of entries) {
    for (const code of new Set(entry.achievements || [])) {
      counts.set(code, (counts.get(code) || 0) + 1);
    }
  }
  for (const [code, count] of counts) {
    achievementRarity.set(code, { count, total: entries.length, percent: count / total * 100 });
  }
}

function renderRoster(entries) {
  const container = document.querySelector('#roster');
  text('#credential-count', String(entries.length));
  container.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No active credential telemetry yet.';
    container.appendChild(empty);
    return;
  }

  const sorted = [...entries].sort((a, b) => {
    const aScore = scoreFor(a);
    const bScore = scoreFor(b);
    return bScore - aScore || String(a.holder).localeCompare(String(b.holder));
  });

  sorted.forEach((entry, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'roster-card';
    card.title = `Verify ${entry.credential_id}`;

    const rank = document.createElement('span');
    rank.className = 'roster-rank';
    rank.textContent = `#${index + 1}`;

    const identity = document.createElement('span');
    identity.className = 'roster-identity';
    const strong = document.createElement('strong');
    strong.textContent = `@${entry.holder}`;
    const small = document.createElement('small');
    small.textContent = entry.callsign || 'UNASSIGNED';
    identity.append(strong, small);

    const clearance = document.createElement('span');
    clearance.className = 'roster-clearance';
    clearance.textContent = entry.clearance?.code || 'SPC-CL-0';

    const score = document.createElement('span');
    score.className = 'roster-score';
    score.textContent = `${scoreFor(entry)} SIG`;

    const pass = document.createElement('span');
    pass.className = 'roster-pass';
    pass.textContent = entry.aethra_fanwork_pass ? '✦ AETHRA' : '·';

    card.append(rank, identity, clearance, score, pass);
    card.addEventListener('click', () => {
      input.value = entry.credential_id;
      verify(entry.credential_id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(card);
  });
}

async function loadRoster() {
  try {
    const found = await fetchJsonCandidates([
      './credentials/index.json',
      `https://raw.githubusercontent.com/${REPO}/${BRANCH}/credentials/index.json`,
    ]);
    if (found.data?.issuer !== 'Stellaria Git PlayGround' || !Array.isArray(found.data.entries)) return;
    rosterEntries = found.data.entries;
    calculateRarity(rosterEntries);
    renderRoster(rosterEntries);
  } catch (error) {
    console.info('Mission Control roster is not available yet:', error);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  verify(input.value);
});

copyBadgeButton.addEventListener('click', async () => {
  if (!currentRecord) return;
  const id = encodeURIComponent(currentRecord.credential_id);
  const verifyUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
  const badgeUrl = rawBadgeUrl(currentRecord.holder);
  const markdown = `[![Stellaria SPC](${badgeUrl})](${verifyUrl})`;
  try {
    await navigator.clipboard.writeText(markdown);
    copyBadgeButton.textContent = 'Copied ✓';
    setTimeout(() => { copyBadgeButton.textContent = 'Copy Markdown'; }, 1600);
  } catch {
    window.prompt('Copy this Markdown:', markdown);
  }
});

// Ancient protocol, scientific value approximately zero.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
window.addEventListener('keydown', event => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === KONAMI[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      document.body.classList.toggle('tuition-protocol');
      document.querySelector('#doge-mode').classList.toggle('hidden');
    }
  } else {
    konamiIndex = key === KONAMI[0] ? 1 : 0;
  }
});

loadRoster();

const requested = new URLSearchParams(window.location.search).get('id');
if (requested) {
  input.value = requested;
  verify(requested);
}
