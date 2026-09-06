const CORE = [
  'FIRST_CONTACT',
  'BRANCH_EXPLORER',
  'CHECKLIST_KEEPER',
  'REVIEW_PASS',
  'RETURNING_CONTRIBUTOR',
  'GREEN_LIGHT',
];

const REPO = 'Stellaria-Studio/Stellaria-Git-PlayGround';
const BRANCH = 'master';

const form = document.querySelector('#lookup-form');
const input = document.querySelector('#credential-input');
const statusBox = document.querySelector('#status');
const result = document.querySelector('#result');
const copyBadgeButton = document.querySelector('#copy-badge');

let currentRecord = null;

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

async function fetchRecord(login) {
  const candidates = [localCredentialUrl(login), rawCredentialUrl(login)];
  let lastError = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      const data = await response.json();
      return { data, source: url };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Credential record not found.');
}

function verifyRecord(record, login) {
  const expectedId = `SPC-GIT-${login}`;
  const holderMatches = String(record.holder || '').toLowerCase() === login.toLowerCase();
  const idMatches = String(record.credential_id || '').toLowerCase() === expectedId.toLowerCase();
  const issuerMatches = record.issuer === 'Stellaria Git PlayGround';
  return holderMatches && idMatches && issuerMatches;
}

function text(id, value) {
  document.querySelector(id).textContent = value;
}

function renderChips(containerSelector, values) {
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
  text('#updated-at', record.updated_at ? new Date(record.updated_at).toLocaleString() : '—');

  const passEl = document.querySelector('#aethra-pass');
  passEl.style.color = passActive ? '#d8b4fe' : '';

  renderChips('#achievements', record.achievements || []);
  renderChips('#prestige', record.prestige || []);
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
    const login = normalizeInput(value);
    const { data, source } = await fetchRecord(login);

    if (!verifyRecord(data, login)) {
      throw new Error('找到了记录，但 issuer / holder / credential ID 校验不匹配。');
    }

    renderRecord(data, source);
    statusBox.className = 'status ok';
    statusBox.textContent = `Verified: ${data.credential_id}`;
    const url = new URL(window.location.href);
    url.searchParams.set('id', data.credential_id);
    history.replaceState(null, '', url);
  } catch (error) {
    currentRecord = null;
    statusBox.className = 'status error';
    statusBox.textContent = `Verification failed: ${error.message}`;
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

const requested = new URLSearchParams(window.location.search).get('id');
if (requested) {
  input.value = requested;
  verify(requested);
}
