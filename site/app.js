const REPO = 'Stellaria-Studio/Stellaria-Git-PlayGround';
const BRANCH = 'master';
const OFFICIAL_HOST = 'stellaria-studio.github.io';
const OFFICIAL_PATH = '/Stellaria-Git-PlayGround/';
const LAST_CREDENTIAL_KEY = 'stellaria-spc-last-credential';

const CORE = [
  'FIRST_CONTACT',
  'BRANCH_EXPLORER',
  'CHECKLIST_KEEPER',
  'REVIEW_PASS',
  'RETURNING_CONTRIBUTOR',
  'GREEN_LIGHT',
];
const CORE_SET = new Set(CORE);

const ACHIEVEMENTS = {
  FIRST_CONTACT: { type: 'core', zh: '首次接触', en: 'First Contact', desc: '至少一个 PR 被合并。' },
  BRANCH_EXPLORER: { type: 'core', zh: '分支探索者', en: 'Branch Explorer', desc: '从非默认分支或 Fork 分支完成一次合并。' },
  CHECKLIST_KEEPER: { type: 'core', zh: '清单守门员', en: 'Checklist Keeper', desc: 'PR 至少 3 个自查项且全部完成。' },
  REVIEW_PASS: { type: 'core', zh: '审查通过', en: 'Review Pass', desc: '已合并 PR 获得其他人的 APPROVED Review。' },
  RETURNING_CONTRIBUTOR: { type: 'core', zh: '返航贡献者', en: 'Returning Contributor', desc: '至少两个 PR 被合并。' },
  GREEN_LIGHT: { type: 'core', zh: '全绿通行', en: 'Green Light', desc: '某个已合并 PR 的 Check Runs 全部为 success / neutral / skipped。' },
  TUITION_PAID_CREATIVE: { type: 'tuition', zh: '创意学费', en: 'Creative Tuition', desc: '提交位于 playground/<GitHub-ID>/ 的原创贡献并被接受。' },
  TUITION_PAID_DRESS: { type: 'tuition', zh: '女装学费 👗', en: 'Dress Tuition', desc: '本人有权公开的女装照片，经维护者人工核验后合并。' },
  CONFLICT_SURVIVOR: { type: 'bonus', zh: '冲突幸存者', en: 'Conflict Survivor', desc: '真实解决一次 merge / rebase conflict。' },
  REBASE_ENJOYER: { type: 'bonus', zh: '认证 Rebase 乐子人', en: 'Certified Rebase Enjoyer', desc: '完成一次可解释的 rebase。' },
  CI_DESTROYER: { type: 'bonus', zh: 'CI 破坏者', en: 'CI Destroyer', desc: '自己的提交成功把 CI 干红。' },
  CI_REDEEMER: { type: 'bonus', zh: 'CI 救火队', en: 'CI Redeemer', desc: '把自己干红的 CI 救回绿色。' },
  UPSTREAM_NAVIGATOR: { type: 'bonus', zh: '上游领航员', en: 'Upstream Navigator', desc: '参与上游同步或同步冲突处理。' },
  MERGE_PILOT: { type: 'bonus', zh: '合并驾驶员', en: 'Merge Pilot', desc: '有证据地完成一次 Merge 操作。' },
  DOCS_ORBITER: { type: 'bonus', zh: '文档轨道员', en: 'Documentation Orbiter', desc: '对 PlayGround 文档做出有效贡献。' },
  EXIF_PURIFIER: { type: 'bonus', zh: 'EXIF 净化者', en: 'EXIF Purifier', desc: '发现并正确清理高敏感 EXIF。' },
  BLOB_MINIMALIST: { type: 'bonus', zh: 'Blob 极简主义者', en: 'Blob Minimalist', desc: '使用 partial clone / sparse workflow 完成大仓库贡献。' },
  HOTFIX_SURGEON: { type: 'bonus', zh: '热修外科医生', en: 'Hotfix Surgeon', desc: '用最小改动修复一次真实问题。' },
  PATCH_CARTOGRAPHER: { type: 'bonus', zh: 'Patch 制图师', en: 'Patch Cartographer', desc: '把混乱改动拆成清晰可 Review 的 patch / PR。' },
  NO_SECRET_INCIDENT: { type: 'bonus', zh: '没有泄密事件', en: 'No Secret Incident', desc: '没有把 Token 提交进公开历史。理论上这本来就应该做到。' },
};

const PAGE_META = {
  card: ['我的证', 'MY CREDENTIAL'],
  details: ['详细档案', 'CREDENTIAL DETAILS'],
  leaderboard: ['排行榜', 'FLIGHT BOARD'],
  achievements: ['成就图鉴', 'ACHIEVEMENT CATALOG'],
  passes: ['授权与荣誉', 'PASSES & HONORS'],
  lab: ['大杂烩实验室', 'MISSION CONTROL LAB'],
};

const state = {
  roster: [],
  rosterRaw: null,
  rarity: new Map(),
  record: null,
  verification: null,
  requested: null,
};

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeLogin(value) {
  let text = String(value || '').trim();
  if (text.startsWith('@')) text = text.slice(1);
  if (/^SPC-GIT-/i.test(text)) text = text.replace(/^SPC-GIT-/i, '');
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(text)) {
    throw new Error('请输入有效的 GitHub ID 或 SPC-GIT-<GitHub-ID>。');
  }
  return text;
}

function credentialId(login) {
  return `SPC-GIT-${login}`;
}

function rawRecordUrl(login) {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/credentials/${encodeURIComponent(login)}.json`;
}

function rawBadgeUrl(login) {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/badges/${encodeURIComponent(login)}.svg`;
}

function officialOrigin() {
  return window.location.hostname === OFFICIAL_HOST && window.location.pathname.startsWith(OFFICIAL_PATH);
}

function currentPage() {
  return document.body.dataset.page || 'card';
}

function currentIdParam() {
  return new URLSearchParams(window.location.search).get('id');
}

function rememberedId() {
  try { return localStorage.getItem(LAST_CREDENTIAL_KEY); } catch { return null; }
}

function rememberId(id) {
  try { localStorage.setItem(LAST_CREDENTIAL_KEY, id); } catch {}
}

function withId(file, id) {
  const safe = id || currentIdParam() || rememberedId();
  return safe ? `./${file}?id=${encodeURIComponent(safe)}` : `./${file}`;
}

function repoUrl(path = '') {
  return `https://github.com/${REPO}${path}`;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchFirst(urls) {
  let last = null;
  for (const url of urls) {
    try {
      return { data: await fetchJson(url), source: url };
    } catch (error) {
      last = error;
    }
  }
  throw last || new Error('Not found');
}

async function fetchRoster() {
  const found = await fetchFirst([
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/credentials/index.json`,
    './credentials/index.json',
  ]);
  if (found.data?.issuer !== 'Stellaria Git PlayGround' || !Array.isArray(found.data.entries)) {
    throw new Error('Mission Control registry issuer mismatch.');
  }
  state.rosterRaw = found.data;
  state.roster = found.data.entries;
  calculateRarity();
  return found.data;
}

async function fetchRecord(login, visited = new Set()) {
  const key = login.toLowerCase();
  if (visited.has(key)) throw new Error('Credential alias loop detected.');
  visited.add(key);

  const found = await fetchFirst([
    rawRecordUrl(login),
    `./credentials/${encodeURIComponent(login)}.json`,
  ]);
  const record = found.data;
  if (record?.status === 'renamed' && record?.renamed_to) {
    const resolved = await fetchRecord(record.renamed_to, visited);
    return { ...resolved, aliasFrom: login, aliasRecord: record };
  }
  return found;
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function proofPayload(record) {
  return {
    schema_version: record.schema_version,
    status: record.status,
    credential_id: record.credential_id,
    holder: record.holder,
    github_user_id: record.github_user_id,
    subject: record.subject,
    aliases: record.aliases || [],
    issuer: record.issuer,
    callsign: record.callsign,
    clearance: record.clearance,
    achievements: record.achievements || [],
    prestige: record.prestige || [],
    tuition: record.tuition || {},
    aethra_fanwork_pass: record.aethra_fanwork_pass || {},
    evidence: record.evidence || [],
    achievement_evidence: record.achievement_evidence || [],
    created_at: record.created_at,
  };
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function structureValid(record) {
  if (!record || record.status !== 'active') return false;
  const expected = credentialId(record.holder);
  return Boolean(
    record.holder &&
    String(record.credential_id || '').toLowerCase() === expected.toLowerCase() &&
    record.issuer === 'Stellaria Git PlayGround' &&
    record.subject === `github-user:${record.github_user_id}`
  );
}

async function verifyRecord(record, source) {
  const structure = structureValid(record);
  const registryEntry = state.roster.find(entry =>
    Number(entry.github_user_id) === Number(record.github_user_id) ||
    String(entry.credential_id || '').toLowerCase() === String(record.credential_id || '').toLowerCase()
  );
  let computedProof = null;
  try { computedProof = await sha256Hex(stableStringify(proofPayload(record))); } catch {}
  const recordProof = record.integrity?.proof || null;
  const registryProof = registryEntry?.proof || null;
  const proofOk = Boolean(
    computedProof &&
    recordProof &&
    registryProof &&
    computedProof === recordProof &&
    recordProof === registryProof &&
    record.integrity?.canonical_repo === REPO &&
    record.integrity?.scheme === 'SPC-CANONICAL-SHA256-V1'
  );
  const sourceCanonical = String(source || '').startsWith(`https://raw.githubusercontent.com/${REPO}/`) || officialOrigin();
  const origin = officialOrigin();
  const verified = structure && Boolean(registryEntry) && proofOk && sourceCanonical;
  const passVerified = verified && Boolean(record.aethra_fanwork_pass?.active) && Boolean(record.aethra_fanwork_pass?.authorization_id);
  return {
    verified,
    structure,
    registry: Boolean(registryEntry),
    proofOk,
    sourceCanonical,
    officialOrigin: origin,
    passVerified,
    computedProof,
    recordProof,
    registryProof,
    registryEntry,
  };
}

function shortProof(proof) {
  const text = String(proof || '').toUpperCase();
  if (!text) return 'NO-PROOF';
  return `PROOF-${text.slice(0, 4)}-${text.slice(4, 8)}-${text.slice(8, 12)}`;
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

function signalGrade(score) {
  if (score >= 1000) return 'S';
  if (score >= 700) return 'A';
  if (score >= 450) return 'B';
  if (score >= 250) return 'C';
  return 'D';
}

function calculateRarity() {
  state.rarity = new Map();
  const total = Math.max(state.roster.length, 1);
  const counts = new Map();
  for (const entry of state.roster) {
    for (const code of new Set(entry.achievements || [])) counts.set(code, (counts.get(code) || 0) + 1);
  }
  for (const [code, count] of counts) {
    state.rarity.set(code, { count, total: state.roster.length, percent: count / total * 100 });
  }
}

function rarityLabel(code) {
  const rarity = state.rarity.get(code);
  if (!rarity || !rarity.total) return 'UNOBSERVED';
  if (rarity.percent <= 10) return `LEGENDARY · ${rarity.percent.toFixed(1)}%`;
  if (rarity.percent <= 30) return `RARE · ${rarity.percent.toFixed(1)}%`;
  if (rarity.percent <= 60) return `UNCOMMON · ${rarity.percent.toFixed(1)}%`;
  return `COMMON · ${rarity.percent.toFixed(1)}%`;
}

function flightStatus(level) {
  return [
    '地面访客 / Ground Visitor',
    '启动许可 / Ignition Ready',
    '分支航线 / Branch Vector',
    '合并导航 / Merge Navigation',
    '仓库接口 / Repository Interface',
    '高级协作 / Advanced Collaboration',
    '全程飞行 / Full Flight Clearance',
  ][Math.max(0, Math.min(6, Number(level) || 0))];
}

function dateText(value) {
  if (!value) return '—';
  try { return new Date(value).toLocaleString('zh-CN'); } catch { return String(value); }
}

function navLink(page, file, label, sub) {
  const active = currentPage() === page ? 'active' : '';
  return `<a class="nav-link ${active}" data-nav-file="${h(file)}" href="${withId(file, state.requested)}"><span>${h(label)}</span><small>${h(sub)}</small></a>`;
}

function syncNavLinks() {
  document.querySelectorAll('[data-nav-file]').forEach(link => {
    link.href = withId(link.dataset.navFile, state.requested);
  });
}

function renderChrome() {
  const [zh, en] = PAGE_META[currentPage()] || PAGE_META.card;
  document.title = `${zh} · Stellaria Mission Control`;
  document.querySelector('#app').innerHTML = `
    <div class="topbar">
      <a class="brand" href="${withId('index.html', state.requested)}">
        <span class="brand-mark">✦</span>
        <span><strong>STELLARIA</strong><small>MISSION CONTROL</small></span>
      </a>
      <nav class="nav">
        ${navLink('card', 'index.html', '我的证', 'CARD')}
        ${navLink('details', 'details.html', '详情', 'DETAILS')}
        ${navLink('leaderboard', 'leaderboard.html', '排行', 'BOARD')}
        ${navLink('achievements', 'achievements.html', '成就', 'ACHIEVEMENTS')}
        ${navLink('passes', 'passes.html', '授权', 'PASSES')}
        ${navLink('lab', 'lab.html', '大杂烩', 'LAB')}
      </nav>
    </div>
    <main class="shell">
      <header class="page-head">
        <div class="eyebrow">${h(en)}</div>
        <h1>${h(zh)}</h1>
        <p id="page-subtitle"></p>
      </header>
      <div id="page-content"></div>
      <footer>
        <span>Dream. Commit. Push. Become.</span>
        <span><a href="${repoUrl()}" target="_blank" rel="noreferrer">Stellaria Git PlayGround</a></span>
      </footer>
    </main>
    <div id="tuition-toast" class="tuition-toast hidden" role="status" aria-live="polite">
      <strong>👗 学费协议已触发 · TUITION PROTOCOL DETECTED</strong>
      <span>任务控制中心完全不知道为什么这会被认为是一项必要功能；更无法解释为什么它现在还有中英文双语版本。（doge）</span>
    </div>
  `;
}

function setSubtitle(text) {
  const el = document.querySelector('#page-subtitle');
  if (el) el.textContent = text;
}

function lookupPanel(compact = false) {
  return `
    <section class="panel lookup ${compact ? 'compact' : ''}">
      <div>
        <div class="eyebrow">IDENTITY LINK</div>
        <h2>找到你的 Credential</h2>
        <p>输入 GitHub ID、<code>@GitHub-ID</code> 或 <code>SPC-GIT-&lt;GitHub-ID&gt;</code>。首次查到后会记住在这台浏览器里，下次打开默认就是“自己的证”。</p>
      </div>
      <form id="lookup-form">
        <input id="credential-input" autocomplete="off" spellcheck="false" placeholder="SPC-GIT-example" aria-label="Credential ID or GitHub login" />
        <button type="submit">连接 / Link</button>
      </form>
      <div id="lookup-status" class="status" role="status" aria-live="polite"></div>
    </section>
  `;
}

function securityChip(verification) {
  if (verification?.verified && verification.officialOrigin) return '<span class="verify-chip good">● LIVE · OFFICIAL · INTEGRITY OK</span>';
  if (verification?.verified) return '<span class="verify-chip warn">● CANONICAL DATA · MIRROR VIEW</span>';
  if (verification?.structure) return '<span class="verify-chip warn">● LEGACY / UNSEALED RECORD</span>';
  return '<span class="verify-chip bad">● UNVERIFIED</span>';
}

function certificateMarkup(record, verification) {
  const achievements = new Set(record.achievements || []);
  const coreCount = CORE.filter(code => achievements.has(code)).length;
  const clearance = record.clearance || { level: coreCount, code: `SPC-CL-${coreCount}`, title: 'Legacy Credential' };
  const score = scoreFor(record);
  const pass = record.aethra_fanwork_pass || {};
  const proof = verification?.recordProof || record.integrity?.proof;
  const passStatus = pass.active ? (verification?.passVerified ? 'ACTIVE · VERIFIED' : 'ACTIVE · CHECK REQUIRED') : 'INACTIVE';
  return `
    <section class="certificate ${pass.active ? 'has-pass' : ''}">
      <div class="certificate-glow"></div>
      <div class="certificate-top">
        <div>
          ${securityChip(verification)}
          <div class="certificate-kicker">STELLARIA PLAYGROUND CREDENTIAL</div>
          <h2>${h(record.credential_id)}</h2>
          <p class="holder">@${h(record.holder)} <span>·</span> ${h(record.callsign || 'UNASSIGNED')}</p>
        </div>
        <div class="clearance-block">
          <span>CLEARANCE / 通行等级</span>
          <strong>${h(clearance.code)}</strong>
          <small>${h(clearance.title)}</small>
        </div>
      </div>

      <div class="certificate-grid">
        <article><span>SUBJECT</span><strong>GH-${h(record.github_user_id)}</strong><small>${h(record.subject)}</small></article>
        <article><span>CORE</span><strong>${coreCount} / ${CORE.length}</strong><small>${h(flightStatus(clearance.level))}</small></article>
        <article><span>SIGNAL</span><strong>${score} · ${signalGrade(score)}</strong><small>PlayGround-only score</small></article>
        <article><span>AETHRA PASS</span><strong class="${pass.active ? 'accent' : ''}">${h(passStatus)}</strong><small>${pass.authorization_id ? h(pass.authorization_id) : 'No authorization issued'}</small></article>
      </div>

      <div class="security-seal">
        <div>
          <span>CANONICAL SECURITY SEAL</span>
          <strong>${h(shortProof(proof))}</strong>
        </div>
        <div class="seal-meta">
          <small>Repository</small><code>${h(REPO)}</code>
          <small>Updated</small><code>${h(dateText(record.updated_at))}</code>
        </div>
      </div>

      <div class="certificate-actions">
        <a class="primary-button" href="${withId('details.html', record.credential_id)}">查看详细档案</a>
        <button type="button" data-action="copy-link">复制验证链接</button>
        <button type="button" data-action="copy-badge">复制 Badge</button>
        <button type="button" data-action="print">打印 / PDF</button>
      </div>
      <p class="fine-print">这是一张 PlayGround 项目内游戏化 Credential。除页面明确显示且通过 canonical proof 校验的额外授权外，它不会给你成员身份、仓库权限、职业资格或对外代表权。</p>
    </section>
  `;
}

async function loadCredential(value, { updateUrl = true } = {}) {
  const login = normalizeLogin(value);
  const found = await fetchRecord(login);
  const record = found.data;
  const verification = await verifyRecord(record, found.source);
  state.record = record;
  state.verification = verification;
  state.requested = record.credential_id;
  rememberId(record.credential_id);
  syncNavLinks();

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('id', record.credential_id);
    history.replaceState(null, '', url);
  }
  return { record, verification, aliasFrom: found.aliasFrom || null };
}

function bindLookup(onLoaded) {
  const form = document.querySelector('#lookup-form');
  if (!form) return;
  const input = document.querySelector('#credential-input');
  const status = document.querySelector('#lookup-status');
  const preset = currentIdParam() || rememberedId();
  if (preset) input.value = preset;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.className = 'status';
    status.textContent = '正在联系 Mission Control…';
    try {
      const loaded = await loadCredential(input.value);
      status.className = 'status ok';
      status.textContent = loaded.aliasFrom
        ? `已解析旧 ID：@${loaded.aliasFrom} → @${loaded.record.holder}`
        : `已连接：${loaded.record.credential_id}`;
      if (onLoaded) await onLoaded(loaded);
    } catch (error) {
      status.className = 'status error';
      status.textContent = `验证失败：${error.message}`;
    }
  });
}

function bindCertificateActions(record) {
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      if (action === 'print') {
        window.print();
        return;
      }
      if (action === 'copy-link') {
        const url = `https://${OFFICIAL_HOST}${OFFICIAL_PATH}?id=${encodeURIComponent(record.credential_id)}`;
        await copyText(url, button, '已复制 ✓');
        return;
      }
      if (action === 'copy-badge') {
        const url = `https://${OFFICIAL_HOST}${OFFICIAL_PATH}?id=${encodeURIComponent(record.credential_id)}`;
        const markdown = `[![Stellaria SPC](${rawBadgeUrl(record.holder)})](${url})`;
        await copyText(markdown, button, '已复制 ✓');
      }
    });
  });
}

async function copyText(text, button, successText) {
  const old = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = successText;
    setTimeout(() => { button.textContent = old; }, 1500);
  } catch {
    window.prompt('复制下面的内容：', text);
  }
}

async function initCard() {
  setSubtitle('先像真的证件一样一本正经，再在小字里承认它主要证明你确实折腾过 Git。');
  const content = document.querySelector('#page-content');
  content.innerHTML = `${lookupPanel(false)}<div id="card-slot"></div>`;
  const slot = document.querySelector('#card-slot');

  const render = ({ record, verification }) => {
    slot.innerHTML = certificateMarkup(record, verification);
    bindCertificateActions(record);
  };
  bindLookup(render);

  let preferred = currentIdParam() || rememberedId();
  if (!preferred && state.roster.length === 1) preferred = state.roster[0].credential_id;
  if (preferred) {
    try {
      const loaded = await loadCredential(preferred, { updateUrl: Boolean(currentIdParam()) });
      render(loaded);
      const status = document.querySelector('#lookup-status');
      if (status) {
        status.className = 'status ok';
        status.textContent = loaded.verification.verified
          ? '已从官方 canonical registry 载入。'
          : '记录已载入，但完整性校验未达到 VERIFIED。';
      }
    } catch (error) {
      const status = document.querySelector('#lookup-status');
      if (status) {
        status.className = 'status error';
        status.textContent = `自动载入失败：${error.message}`;
      }
    }
  }
}

function checkRow(label, ok, detail) {
  return `<div class="check-row ${ok ? 'ok' : 'bad'}"><span>${ok ? '✓' : '×'}</span><div><strong>${h(label)}</strong><small>${h(detail)}</small></div></div>`;
}

function achievementChip(code, unlocked = true) {
  const meta = ACHIEVEMENTS[code] || { zh: code, en: code, type: 'bonus' };
  const rarity = state.rarity.get(code);
  const rarityText = rarity ? `${rarity.percent.toFixed(1)}%` : '—';
  return `<span class="achievement-chip ${unlocked ? 'unlocked' : 'locked'} ${meta.type}" title="${h(meta.desc || '')}"><strong>${h(meta.zh)}</strong><small>${h(code)} · ${rarityText}</small></span>`;
}

function evidenceMarkup(record) {
  const items = Array.isArray(record.evidence) ? [...record.evidence].reverse() : [];
  if (!items.length) return '<div class="empty">暂无 Merge Evidence。</div>';
  return `<div class="timeline">${items.map(item => `
    <a class="timeline-item" href="${h(item.url || repoUrl(`/pull/${item.pull_request}`))}" target="_blank" rel="noreferrer">
      <span class="timeline-dot"></span>
      <div><strong>Pull Request #${h(item.pull_request)}</strong><small>${h(dateText(item.merged_at))}</small></div>
      <code>${h(String(item.head_sha || '').slice(0, 10))}</code>
    </a>
  `).join('')}</div>`;
}

async function initDetails() {
  setSubtitle('这里是那张“证”的后台：GitHub evidence、完整性 Seal、别名、学费记录和所有看起来很高级的字段。');
  const content = document.querySelector('#page-content');
  content.innerHTML = `${lookupPanel(true)}<div id="detail-slot"></div>`;
  const slot = document.querySelector('#detail-slot');

  const render = ({ record, verification }) => {
    const achievements = new Set(record.achievements || []);
    const tuitionEvidence = record.tuition?.evidence || [];
    const pass = record.aethra_fanwork_pass || {};
    slot.innerHTML = `
      <section class="panel detail-hero">
        <div>
          ${securityChip(verification)}
          <h2>${h(record.credential_id)}</h2>
          <p>@${h(record.holder)} · ${h(record.callsign || 'UNASSIGNED')}</p>
        </div>
        <a class="primary-button" href="${withId('index.html', record.credential_id)}">返回证件正面</a>
      </section>

      <section class="panel">
        <div class="section-head"><div><div class="eyebrow">INTEGRITY BEACON</div><h2>完整性 / 防“自己 P 一张”检查</h2></div><code>${h(shortProof(verification.recordProof))}</code></div>
        <p>截图永远可以被 PS，所以权威来源不是截图，而是这个页面从官方仓库实时读取的 canonical record + registry proof。下面四项都通过，才把授权类状态显示为 VERIFIED。</p>
        <div class="check-list">
          ${checkRow('Canonical Registry', verification.registry, verification.registry ? 'GitHub 官方 registry 中存在对应 stable subject。' : 'Registry 中没有这条记录。')}
          ${checkRow('SHA-256 Seal', verification.proofOk, verification.proofOk ? 'Record、Registry 与浏览器重新计算的 proof 完全一致。' : 'Proof 不一致或仍是旧 schema。')}
          ${checkRow('Stable GitHub Subject', verification.structure, record.subject || 'subject missing')}
          ${checkRow('Official Data Source', verification.sourceCanonical, verification.officialOrigin ? '当前页面本身也是 Stellaria 官方 GitHub Pages。' : '数据来自官方仓库，但当前页面可能是镜像。')}
        </div>
        <div class="proof-grid">
          <div><span>RECORD PROOF</span><code>${h(verification.recordProof || '—')}</code></div>
          <div><span>REGISTRY PROOF</span><code>${h(verification.registryProof || '—')}</code></div>
          <div><span>RECOMPUTED</span><code>${h(verification.computedProof || '—')}</code></div>
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><div><div class="eyebrow">ACHIEVEMENTS</div><h2>已获得成就</h2></div><strong>${(record.achievements || []).length}</strong></div>
        <div class="achievement-cloud">${(record.achievements || []).map(code => achievementChip(code, true)).join('') || '<span class="empty">None yet</span>'}</div>
        <h3 class="subhead">Core 路线</h3>
        <div class="achievement-cloud">${CORE.map(code => achievementChip(code, achievements.has(code))).join('')}</div>
      </section>

      <section class="panel split-two">
        <div>
          <div class="eyebrow">TUITION RECORD</div>
          <h2>学费记录</h2>
          <div class="mini-cards">
            <div class="mini-card"><span>CREATIVE</span><strong>${record.tuition?.creative ? 'PAID 🌟' : '—'}</strong></div>
            <div class="mini-card"><span>DRESS</span><strong>${record.tuition?.dress ? 'VERIFIED 👗' : '—'}</strong></div>
          </div>
          <div class="small-list">${tuitionEvidence.length ? tuitionEvidence.map(item => `<div><code>PR #${h(item.pull_request)}</code><span>${h(item.route)} · ${h(item.verified_label || 'structural merge evidence')}</span></div>`).join('') : '<span class="empty">暂无学费 Evidence。</span>'}</div>
        </div>
        <div>
          <div class="eyebrow">SPECIAL AUTHORIZATION</div>
          <h2>Aethra Fanwork Pass</h2>
          <div class="authorization-status ${pass.active ? 'active' : ''}">
            <strong>${pass.active ? (verification.passVerified ? 'ACTIVE · VERIFIED' : 'ACTIVE · UNSEALED') : 'INACTIVE'}</strong>
            <code>${h(pass.authorization_id || 'NO AUTHORIZATION ID')}</code>
            <small>${h(pass.granted_by || 'No grant route')} ${pass.evidence_pr ? `· PR #${h(pass.evidence_pr)}` : ''}</small>
          </div>
          <a href="${withId('passes.html', record.credential_id)}">查看授权登记与条款 →</a>
        </div>
      </section>

      <section class="panel">
        <div class="eyebrow">MERGE EVIDENCE</div>
        <h2>飞行日志 / PR Evidence</h2>
        ${evidenceMarkup(record)}
      </section>

      <section class="panel split-two">
        <div><div class="eyebrow">ALIASES</div><h2>历史 GitHub ID</h2><div class="achievement-cloud muted">${(record.aliases || []).map(alias => `<span class="achievement-chip unlocked"><strong>@${h(alias)}</strong><small>redirect alias</small></span>`).join('') || '<span class="empty">暂无别名。</span>'}</div></div>
        <div><div class="eyebrow">RAW DATA</div><h2>机器可读记录</h2><div class="link-stack"><a href="${rawRecordUrl(record.holder)}" target="_blank" rel="noreferrer">Canonical JSON ↗</a><a href="${rawBadgeUrl(record.holder)}" target="_blank" rel="noreferrer">SVG Badge ↗</a><a href="${repoUrl(`/blob/master/CREDENTIALS.md`)}" target="_blank" rel="noreferrer">Credential Spec ↗</a><a href="${repoUrl(`/blob/master/SECURITY-MODEL.md`)}" target="_blank" rel="noreferrer">Security Model ↗</a></div></div>
      </section>
    `;
  };

  bindLookup(render);
  const preferred = currentIdParam() || rememberedId();
  if (preferred) {
    try { render(await loadCredential(preferred, { updateUrl: false })); }
    catch (error) { slot.innerHTML = `<section class="panel error-panel">无法载入 Credential：${h(error.message)}</section>`; }
  } else {
    slot.innerHTML = '<section class="panel empty-state">先在上面连接一个 Credential，详细档案才会从轨道上掉下来。</section>';
  }
}

function leaderboardRows(filter = '') {
  const query = filter.trim().toLowerCase();
  const sorted = [...state.roster].sort((a, b) => scoreFor(b) - scoreFor(a) || String(a.holder).localeCompare(String(b.holder)));
  const visible = sorted.filter(entry => !query || [entry.holder, entry.credential_id, entry.callsign, entry.clearance?.code].some(value => String(value || '').toLowerCase().includes(query)));
  return visible.map((entry) => {
    const globalRank = sorted.indexOf(entry) + 1;
    const pass = Boolean(entry.aethra_fanwork_pass);
    const route = entry.tuition?.dress ? '👗' : entry.tuition?.creative ? '🌟' : '·';
    return `
      <a class="board-row" href="${withId('index.html', entry.credential_id)}">
        <span class="rank">#${globalRank}</span>
        <span class="identity"><strong>@${h(entry.holder)}</strong><small>${h(entry.callsign || 'UNASSIGNED')}</small></span>
        <span class="clearance"><strong>${h(entry.clearance?.code || 'SPC-CL-0')}</strong><small>${h(entry.clearance?.title || '')}</small></span>
        <span class="score"><strong>${scoreFor(entry)} SIG</strong><small>Grade ${signalGrade(scoreFor(entry))}</small></span>
        <span class="route">${route}</span>
        <span class="pass">${pass ? '✦ AETHRA' : '—'}</span>
      </a>
    `;
  }).join('') || '<div class="empty-state">没有匹配的飞行员。</div>';
}

async function initLeaderboard() {
  setSubtitle('这是 Git 学习大杂烩排行榜，不是全球开发者实力榜；请勿把 #1 写进简历标题（doge）。');
  const content = document.querySelector('#page-content');
  content.innerHTML = `
    <section class="panel board-hero">
      <div><div class="eyebrow">PUBLIC TELEMETRY</div><h2>Mission Control Flight Board</h2><p>按 Signal Score 排序。分数来自 Core、Bonus、Tuition、Prestige 与特殊 Pass，只在这个仓库里有意义。</p></div>
      <div class="board-stat"><span>ACTIVE CREDENTIALS</span><strong>${state.roster.length}</strong><small>Registry ${h(String(state.rosterRaw?.registry_hash || '').slice(0, 12).toUpperCase())}</small></div>
    </section>
    <section class="panel">
      <div class="board-tools"><input id="board-filter" placeholder="搜索 GitHub ID / Callsign / Clearance" /><div class="legend"><span>👗 Dress</span><span>🌟 Creative</span><span>✦ Pass</span></div></div>
      <div id="board-list" class="board-list">${leaderboardRows()}</div>
    </section>
    <section class="panel notes"><h2>Signal Score 是什么？</h2><p>Core 每个 100，Bonus 每个 25，Tuition 每个 60，Prestige 每个 10，Aethra Pass 额外 500。这个算法的科研价值大约等于 Callsign，但至少排序是确定性的。</p></section>
  `;
  const input = document.querySelector('#board-filter');
  input.addEventListener('input', () => { document.querySelector('#board-list').innerHTML = leaderboardRows(input.value); });
}

function achievementCard(code, currentSet) {
  const meta = ACHIEVEMENTS[code];
  const unlocked = currentSet?.has(code);
  const rarity = state.rarity.get(code);
  const rarityText = rarity ? `${rarity.count}/${rarity.total} · ${rarity.percent.toFixed(1)}%` : '暂无持有者';
  const rarityClass = rarity && rarity.percent <= 10 ? 'legendary' : rarity && rarity.percent <= 30 ? 'rare' : '';
  return `
    <article class="achievement-card ${unlocked ? 'owned' : ''} ${rarityClass}">
      <div class="achievement-card-top"><span class="type">${h(meta.type.toUpperCase())}</span><span class="owned-mark">${unlocked ? '✓ 已获得' : '○ 未获得'}</span></div>
      <h3>${h(meta.zh)}</h3><p class="english">${h(meta.en)}</p>
      <code>${h(code)}</code>
      <p>${h(meta.desc)}</p>
      <small>RARITY · ${h(rarityText)}</small>
    </article>
  `;
}

async function maybeLoadPreferredRecord() {
  const preferred = currentIdParam() || rememberedId();
  if (!preferred) return null;
  try { return await loadCredential(preferred, { updateUrl: false }); } catch { return null; }
}

async function initAchievements() {
  setSubtitle('把普通 Git 操作包装成舰桥人员资格认证，是这个仓库非常稳定的核心竞争力。');
  const loaded = await maybeLoadPreferredRecord();
  const currentSet = new Set(loaded?.record?.achievements || []);
  const content = document.querySelector('#page-content');
  const groups = ['core', 'tuition', 'bonus'];
  const titles = { core: ['核心成就', '决定 SPC-CL-* Clearance'], tuition: ['学费成就', '两条入场路线，女装路线有人工核验'], bonus: ['Bonus 成就', '主要负责看起来很厉害'] };
  content.innerHTML = `
    ${loaded ? `<section class="panel achievement-summary"><div><div class="eyebrow">CURRENT HOLDER</div><h2>@${h(loaded.record.holder)}</h2><p>${currentSet.size} achievements · ${h(loaded.record.clearance?.code || '')}</p></div><a class="primary-button" href="${withId('index.html', loaded.record.credential_id)}">查看我的证</a></section>` : ''}
    ${groups.map(group => {
      const [title, desc] = titles[group];
      const codes = Object.keys(ACHIEVEMENTS).filter(code => ACHIEVEMENTS[code].type === group);
      return `<section class="panel"><div class="section-head"><div><div class="eyebrow">${group.toUpperCase()}</div><h2>${h(title)}</h2><p>${h(desc)}</p></div><strong>${codes.filter(code => currentSet.has(code)).length}/${codes.length}</strong></div><div class="achievement-grid">${codes.map(code => achievementCard(code, currentSet)).join('')}</div></section>`;
    }).join('')}
    <section class="panel notes"><h2>Bonus 怎么领？</h2><p>用公开 PR / commit / workflow run 作为 evidence 提 Achievement Claim，维护者审核后通过专门的 Grant Workflow 写入。直接在 PR 里手改 <code>credentials/*.json</code> 会被 Canonical Guard 拦掉。</p><div class="links"><a href="${repoUrl('/issues/new/choose')}" target="_blank" rel="noreferrer">提交 Achievement Claim ↗</a><a href="${repoUrl('/blob/master/ACHIEVEMENTS.md')}" target="_blank" rel="noreferrer">完整规则 ↗</a></div></section>
  `;
}

function passHolderCards() {
  const holders = state.roster.filter(entry => entry.aethra_fanwork_pass);
  if (!holders.length) return '<div class="empty-state">当前 Registry 还没有 ACTIVE 的 Aethra Fanwork Pass。第一个持有人将获得非常神秘的 #1 排名。</div>';
  return `<div class="pass-holder-grid">${holders.map(entry => `
    <a class="pass-holder-card" href="${withId('details.html', entry.credential_id)}">
      <span class="verify-chip good">AUTHORIZATION ACTIVE</span>
      <h3>@${h(entry.holder)}</h3>
      <p>${h(entry.callsign)}</p>
      <code>${h(entry.authorization_id || 'LEGACY-AUTH')}</code>
      <small>${h(shortProof(entry.proof))}</small>
    </a>
  `).join('')}</div>`;
}

async function initPasses() {
  setSubtitle('这里专门放“不是纯空气”的那部分：额外许可、荣誉登记，以及为什么一张截图不能自己宣布授权。');
  const loaded = await maybeLoadPreferredRecord();
  const pass = loaded?.record?.aethra_fanwork_pass;
  const content = document.querySelector('#page-content');
  content.innerHTML = `
    ${loaded ? `<section class="panel authorization-hero ${pass?.active ? 'active' : ''}"><div><div class="eyebrow">CURRENT AUTHORIZATION</div><h2>${pass?.active ? (loaded.verification.passVerified ? 'AETHRA FANWORK PASS · VERIFIED' : 'AETHRA FANWORK PASS · CHECK REQUIRED') : 'AETHRA FANWORK PASS · INACTIVE'}</h2><p>@${h(loaded.record.holder)} · ${h(loaded.record.callsign)}</p></div><div class="auth-id"><span>AUTHORIZATION ID</span><code>${h(pass?.authorization_id || 'NOT ISSUED')}</code><small>${h(shortProof(loaded.verification.recordProof))}</small></div></section>` : ''}

    <section class="panel">
      <div class="eyebrow">PUBLIC AUTHORIZATION REGISTRY</div>
      <h2>Aethra Fanwork Pass 持有人</h2>
      <p>只有官方 canonical registry 中 <strong>Pass = ACTIVE</strong>、Record Proof 与 Registry Proof 一致，并且存在 Authorization ID 的记录，页面才显示为 VERIFIED。</p>
      ${passHolderCards()}
    </section>

    <section class="panel split-two">
      <div><div class="eyebrow">ROUTE A</div><h2>👗 祖传捷径</h2><p>Dress Tuition 不再只看 PR 里的一行隐藏 marker。必须真的包含传统目录中的图片，并由有写权限的维护者运行 <strong>Verify Playground Tuition</strong>，写入 <code>tuition:verified:dress</code> 标签后才能解锁授权。</p></div>
      <div><div class="eyebrow">ROUTE B</div><h2>🛰️ Git 全成就路线</h2><p>集齐 6 个 Core Git Achievements。特别是 <code>REVIEW_PASS</code> 必须来自其他人的 APPROVED Review，因此不能自己给自己凭空发一张满级证。</p></div>
    </section>

    <section class="panel notes">
      <h2>验证原则</h2>
      <p><strong>截图不是授权凭证。</strong> 截图当然可以被改。真正的验证方式是打开 Stellaria 官方 Mission Control URL，检查 Authorization ID、stable GitHub subject 与 canonical SHA-256 Seal。GitHub 仓库里的生成记录也有 Guard Workflow，普通 PR 不能直接手改 canonical JSON / SVG。</p>
      <div class="links"><a href="./AETHRA-FANWORK-PASS.md">查看完整许可条款</a><a href="./SECURITY-MODEL.md">Security Model</a></div>
    </section>
  `;
}

function seededIndex(seed, length) {
  let hash = 2166136261;
  for (const ch of seed) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % length;
}

function gitFortune(holder = 'anonymous') {
  const day = new Date().toISOString().slice(0, 10);
  const fortunes = [
    ['大吉', '适合 rebase，适合写文档，不适合 force push main。'],
    ['中吉', '今天的 conflict 看起来很凶，实际只有 README 两行。'],
    ['小吉', 'CI 第一次会红，但第二次会因为你终于看日志而变绿。'],
    ['平', '今天最稳妥的 Git 操作是先 git status。'],
    ['末吉', '不要在凌晨一点半顺手改 17 个 Workflow。Mission Control 对此有历史教训。'],
    ['神秘', 'upstream 正在凝视你。'],
  ];
  return fortunes[seededIndex(`${holder}|${day}`, fortunes.length)];
}

function labMessage(target, text, tone = '') {
  const el = document.querySelector(target);
  if (!el) return;
  el.className = `lab-output ${tone}`;
  el.textContent = text;
}

function toggleTuitionProtocol(force = null) {
  const next = force === null ? !document.body.classList.contains('tuition-protocol') : Boolean(force);
  document.body.classList.toggle('tuition-protocol', next);
  document.querySelector('#tuition-toast')?.classList.toggle('hidden', !next);
}

async function initLab() {
  setSubtitle('科研价值接近零，快乐值比较稳定。这里的所有“危险按钮”都不会真的碰你的仓库。');
  const loaded = await maybeLoadPreferredRecord();
  const holder = loaded?.record?.holder || 'anonymous';
  const [luck, fortune] = gitFortune(holder);
  const content = document.querySelector('#page-content');
  content.innerHTML = `
    <section class="panel lab-hero"><div><div class="eyebrow">UNNECESSARY FEATURE DEPARTMENT</div><h2>Mission Control 大杂烩实验室</h2><p>如果某个功能看起来“完全没必要但很好玩”，它大概率就应该被放到这里。</p></div><div class="big-doge">(doge)</div></section>

    <div class="lab-grid">
      <section class="panel lab-card"><span class="lab-icon">👗</span><h2>学费协议</h2><p>现在有中文版了。为什么？因为你问了。</p><button id="tuition-button">触发 Tuition Protocol</button><div id="tuition-output" class="lab-output">古老序列：↑ ↑ ↓ ↓ ← → ← → B A</div></section>
      <section class="panel lab-card"><span class="lab-icon">🚨</span><h2>紧急合并主干</h2><p>听起来像 SPC-CL-6 应该能按，但实际上所有等级都不能。</p><button id="merge-button">MERGE MASTER NOW</button><div id="merge-output" class="lab-output">STANDBY</div></section>
      <section class="panel lab-card"><span class="lab-icon">🔮</span><h2>今日 Git 运势</h2><p>基于日期和 GitHub ID 的确定性胡说八道。</p><div class="fortune"><strong>${h(luck)}</strong><span>${h(fortune)}</span></div></section>
      <section class="panel lab-card"><span class="lab-icon">☢️</span><h2>Force Push 模拟器</h2><p>这里可以安全体验“我好像要把历史扬了”的感觉。</p><button id="force-button">git push --force origin master</button><div id="force-output" class="lab-output">尚未造成事故。</div></section>
      <section class="panel lab-card"><span class="lab-icon">🏢</span><h2>Enterprise 化旋钮</h2><p>每按一次，仓库会在你的浏览器里显得 7% 更像大型组织。</p><button id="enterprise-button">增加组织感</button><div id="enterprise-output" class="lab-output">Enterprise Level 0</div></section>
      <section class="panel lab-card"><span class="lab-icon">📡</span><h2>官话生成器</h2><p>把“PR merge 了”包装成任务控制中心通告。</p><button id="jargon-button">生成一句</button><div id="jargon-output" class="lab-output">等待遥测。</div></section>
    </div>
  `;

  document.querySelector('#tuition-button').addEventListener('click', () => {
    toggleTuitionProtocol();
    labMessage('#tuition-output', document.body.classList.contains('tuition-protocol') ? '👗 学费协议已触发。Mission Control 仍然拒绝解释其必要性。' : '协议已收回。裙摆遥测归零。');
  });

  document.querySelector('#merge-button').addEventListener('click', () => {
    labMessage('#merge-output', 'ACCESS DENIED · Clearance 名字很高级 ≠ 真的有 Merge 权限。（doge）', 'error');
  });

  document.querySelector('#force-button').addEventListener('click', () => {
    labMessage('#force-output', '模拟执行中：enumerating objects… 99%… 已被 Mission Control 当场拔网线。历史安全。', 'ok');
  });

  let enterprise = Number(localStorage.getItem('stellaria-enterprise-level') || 0);
  const showEnterprise = () => labMessage('#enterprise-output', `Enterprise Level ${enterprise} · ${enterprise * 7}% more governance-looking`);
  showEnterprise();
  document.querySelector('#enterprise-button').addEventListener('click', () => {
    enterprise += 1;
    localStorage.setItem('stellaria-enterprise-level', String(enterprise));
    showEnterprise();
  });

  const jargon = [
    '遥测确认：分支已完成轨道交会，Merge Window 正常。',
    'Repository Interface 已建立，Commit Payload 完整，允许进入 Review Corridor。',
    '上游同步矢量稳定，未检测到 README 级结构扰动。',
    'Mission Control 报告：CI 全绿，实际意思是“这次没炸”。',
    'Flight Clearance 不授予任何权限，但它确实看起来很有权限。',
  ];
  let jargonIndex = seededIndex(`${holder}|jargon`, jargon.length);
  document.querySelector('#jargon-button').addEventListener('click', () => {
    jargonIndex = (jargonIndex + 1) % jargon.length;
    labMessage('#jargon-output', jargon[jargonIndex]);
  });
}

function bindKonami() {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let index = 0;
  window.addEventListener('keydown', event => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === sequence[index]) {
      index += 1;
      if (index === sequence.length) {
        index = 0;
        toggleTuitionProtocol();
      }
    } else {
      index = key === sequence[0] ? 1 : 0;
    }
  });
}

async function init() {
  state.requested = currentIdParam() || rememberedId();
  renderChrome();
  bindKonami();

  try {
    await fetchRoster();
  } catch (error) {
    document.querySelector('#page-content').innerHTML = `<section class="panel error-panel">Mission Control registry 暂时不可用：${h(error.message)}</section>`;
    return;
  }

  const page = currentPage();
  if (page === 'card') await initCard();
  else if (page === 'details') await initDetails();
  else if (page === 'leaderboard') await initLeaderboard();
  else if (page === 'achievements') await initAchievements();
  else if (page === 'passes') await initPasses();
  else if (page === 'lab') await initLab();
}

init().catch(error => {
  const content = document.querySelector('#page-content');
  if (content) content.innerHTML = `<section class="panel error-panel">Mission Control 初始化失败：${h(error.message)}</section>`;
  console.error(error);
});
