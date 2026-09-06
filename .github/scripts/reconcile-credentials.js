const crypto = require('crypto');

module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  const BRANCH = 'master';
  const OFFICIAL_REPO = `${owner}/${repo}`;
  const STELLARIA_EPOCH = Date.parse('2026-09-06T16:00:00Z');
  const COMMENT_MARKER = '<!-- stellaria-credential-reconciled -->';
  const DRESS_VERIFIED_LABEL = 'tuition:verified:dress';
  const CREATIVE_VERIFIED_LABEL = 'tuition:verified:creative';

  const CORE = [
    'FIRST_CONTACT',
    'BRANCH_EXPLORER',
    'CHECKLIST_KEEPER',
    'REVIEW_PASS',
    'RETURNING_CONTRIBUTOR',
    'GREEN_LIGHT',
  ];

  const CLEARANCE_TITLES = [
    'Visitor Interface',
    'Commit Initiate',
    'Branch Operator',
    'Merge Navigator',
    'Repository Interface Clearance',
    'Advanced Collaboration Clearance',
    'PlayGround Flight Clearance',
  ];

  function makeCallsign(holder) {
    const digest = crypto.createHash('sha256').update(holder.toLowerCase()).digest('hex');
    const prefixes = ['Aster', 'Nova', 'Lunar', 'Nebula', 'Comet', 'Aurora', 'Solar', 'Vega'];
    const nouns = ['Vector', 'Beacon', 'Orbit', 'Kernel', 'Signal', 'Photon', 'Relay', 'Pilot'];
    return `${prefixes[parseInt(digest.slice(0, 2), 16) % prefixes.length]}-${nouns[parseInt(digest.slice(2, 4), 16) % nouns.length]}-${digest.slice(4, 8).toUpperCase()}`;
  }

  function clearanceFor(achievements) {
    const level = CORE.filter(code => achievements.has(code)).length;
    return { level, code: `SPC-CL-${level}`, title: CLEARANCE_TITLES[level] };
  }

  function escapeXml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
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

  function proofFor(record) {
    return crypto.createHash('sha256').update(stableStringify(proofPayload(record))).digest('hex');
  }

  function makeAuthorizationId(userId, pass) {
    if (!pass?.active) return null;
    const seed = `${userId}|${pass.granted_by}|${pass.granted_at}|AETHRA_FANWORK_PASS`;
    const short = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 12).toUpperCase();
    return `AETHRA-${userId}-${short}`;
  }

  function makeBadge(record) {
    const clearance = record.clearance || { code: 'SPC-CL-0', title: 'Visitor Interface' };
    const pass = Boolean(record.aethra_fanwork_pass?.active);
    const right = `${clearance.code} · ${clearance.title}${pass ? ' · AETHRA PASS' : ''}`;
    const left = 'STELLARIA SPC';
    const leftWidth = 118;
    const rightWidth = Math.max(250, Math.min(560, 92 + right.length * 6.4));
    const width = leftWidth + rightWidth;
    const safeLeft = escapeXml(left);
    const safeRight = escapeXml(right);
    const safeHolder = escapeXml(record.holder);
    const safeId = escapeXml(record.credential_id);
    const safeProof = escapeXml(String(record.integrity?.proof || '').slice(0, 12).toUpperCase());

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" role="img" aria-label="${safeId}: ${safeRight}">`,
      `  <title>${safeId} · @${safeHolder} · ${safeRight} · PROOF ${safeProof}</title>`,
      '  <linearGradient id="g" x2="0" y2="100%">',
      '    <stop offset="0" stop-color="#fff" stop-opacity=".11"/>',
      '    <stop offset="1" stop-opacity=".11"/>',
      '  </linearGradient>',
      `  <clipPath id="r"><rect width="${width}" height="28" rx="7"/></clipPath>`,
      '  <g clip-path="url(#r)">',
      `    <rect width="${leftWidth}" height="28" fill="#111827"/>`,
      `    <rect x="${leftWidth}" width="${rightWidth}" height="28" fill="${pass ? '#6d28d9' : '#334155'}"/>`,
      `    <rect width="${width}" height="28" fill="url(#g)"/>`,
      '  </g>',
      '  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="11" font-weight="600">',
      `    <text x="${leftWidth / 2}" y="18">${safeLeft}</text>`,
      `    <text x="${leftWidth + rightWidth / 2}" y="18">${safeRight}</text>`,
      '  </g>',
      '</svg>',
      '',
    ].join('\n');
  }

  async function getText(path) {
    try {
      const response = await github.rest.repos.getContent({ owner, repo, path, ref: BRANCH });
      if (Array.isArray(response.data) || response.data.type !== 'file') return null;
      return {
        sha: response.data.sha,
        text: Buffer.from(response.data.content || '', 'base64').toString('utf8'),
      };
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async function putText(path, text, message, knownSha = null) {
    const current = knownSha ? { sha: knownSha } : await getText(path);
    const args = {
      owner,
      repo,
      path,
      branch: BRANCH,
      message,
      content: Buffer.from(text, 'utf8').toString('base64'),
    };
    if (current?.sha) args.sha = current.sha;
    return github.rest.repos.createOrUpdateFileContents(args);
  }

  function stripVolatile(record) {
    if (!record || typeof record !== 'object') return record;
    const copy = JSON.parse(JSON.stringify(record));
    delete copy.updated_at;
    return copy;
  }

  function sameRecord(a, b) {
    return JSON.stringify(stripVolatile(a)) === JSON.stringify(stripVolatile(b));
  }

  function uniqueBy(items, keyFn) {
    const map = new Map();
    for (const item of items.filter(Boolean)) map.set(keyFn(item), item);
    return Array.from(map.values());
  }

  function hasLabel(pr, label) {
    return Array.isArray(pr.labels) && pr.labels.some(item => String(item?.name || '').toLowerCase() === label.toLowerCase());
  }

  async function changedFiles(prNumber) {
    return github.paginate(github.rest.pulls.listFiles, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });
  }

  function dressImageCandidate(filename) {
    return /^(?:[A-Z#]\/[^/]+\/).+\.(?:jpe?g|png|webp|gif|avif|heic)$/i.test(filename);
  }

  function creativeCandidate(filename, login) {
    return filename.toLowerCase().startsWith(`playground/${login.toLowerCase()}/`);
  }

  const allClosed = await github.paginate(github.rest.pulls.list, {
    owner,
    repo,
    state: 'closed',
    base: BRANCH,
    sort: 'created',
    direction: 'asc',
    per_page: 100,
  });

  const merged = allClosed.filter(pr =>
    pr.merged_at &&
    Date.parse(pr.created_at) >= STELLARIA_EPOCH &&
    pr.user &&
    pr.user.type !== 'Bot'
  );

  const groups = new Map();
  for (const pr of merged) {
    const userId = Number(pr.user.id);
    if (!groups.has(userId)) groups.set(userId, []);
    groups.get(userId).push(pr);
  }
  core.notice(`Found ${merged.length} Stellaria-era merged PR(s) across ${groups.size} human account(s).`);

  const credentialFiles = [];
  try {
    const listing = await github.rest.repos.getContent({ owner, repo, path: 'credentials', ref: BRANCH });
    if (Array.isArray(listing.data)) {
      credentialFiles.push(...listing.data.filter(entry =>
        entry.type === 'file' && entry.name.endsWith('.json') && entry.name !== 'index.json'
      ));
    }
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  const parsedExisting = [];
  for (const entry of credentialFiles) {
    const file = await getText(entry.path);
    if (!file) continue;
    try {
      const record = JSON.parse(file.text);
      let stableId = Number(record.github_user_id || 0) || null;
      if (!stableId && Array.isArray(record.evidence)) {
        const evidencePr = record.evidence.find(item => Number.isInteger(Number(item?.pull_request)));
        if (evidencePr) {
          try {
            const fetched = await github.rest.pulls.get({ owner, repo, pull_number: Number(evidencePr.pull_request) });
            stableId = Number(fetched.data.user?.id || 0) || null;
          } catch (error) {
            core.warning(`Could not infer stable user id for ${entry.path}: ${error.message}`);
          }
        }
      }
      parsedExisting.push({ path: entry.path, sha: file.sha, record, stableId });
    } catch (error) {
      core.warning(`Skipping malformed credential ${entry.path}: ${error.message}`);
    }
  }

  const canonicalRecords = [];

  for (const [userId, prs] of groups) {
    prs.sort((a, b) => Date.parse(a.merged_at) - Date.parse(b.merged_at));
    const login = prs.at(-1).user.login;
    const canonicalPath = `credentials/${login}.json`;
    const badgePath = `badges/${login}.svg`;
    const now = new Date().toISOString();

    const relatedExisting = parsedExisting.filter(item =>
      item.stableId === userId ||
      String(item.record?.holder || '').toLowerCase() === login.toLowerCase()
    );
    const currentExisting = relatedExisting.find(item => item.path === canonicalPath) || null;

    const achievements = new Set();
    const prestige = new Set();
    const aliases = new Set();
    const evidence = [];
    const achievementEvidence = [];
    const tuitionEvidence = [];
    let tuitionCreative = false;
    let tuitionDress = false;
    let priorPass = null;
    let createdAt = prs[0].merged_at || now;

    for (const item of relatedExisting) {
      const old = item.record || {};
      if (item.path !== canonicalPath && old.holder) aliases.add(old.holder);
      for (const alias of old.aliases || []) aliases.add(alias);
      for (const code of old.achievements || []) {
        if (!CORE.includes(code) && !String(code).startsWith('TUITION_PAID_')) achievements.add(code);
      }
      for (const flag of old.prestige || []) {
        if (!['CREATIVE_ROUTE', 'DRESS_ROUTE', 'AETHRA_PASS_HOLDER'].includes(flag)) prestige.add(flag);
      }
      if (old.aethra_fanwork_pass?.active) priorPass = old.aethra_fanwork_pass;
      if (old.created_at && Date.parse(old.created_at) < Date.parse(createdAt)) createdAt = old.created_at;
      evidence.push(...(old.evidence || []));
      achievementEvidence.push(...(old.achievement_evidence || []));
      tuitionEvidence.push(...(old.tuition?.evidence || []));
    }

    achievements.add('FIRST_CONTACT');
    if (prs.length >= 2) achievements.add('RETURNING_CONTRIBUTOR');

    let reviewPass = achievements.has('REVIEW_PASS');
    let greenLight = achievements.has('GREEN_LIGHT');

    for (const pr of prs) {
      const headRepo = pr.head?.repo?.full_name;
      const baseRepo = pr.base?.repo?.full_name;
      if (pr.head?.ref !== pr.base?.ref || headRepo !== baseRepo) achievements.add('BRANCH_EXPLORER');

      const body = pr.body || '';
      const checkboxLines = body.split(/\r?\n/).filter(line => /^\s*-\s*\[[ xX]\]/.test(line));
      if (checkboxLines.length >= 3 && checkboxLines.every(line => /^\s*-\s*\[[xX]\]/.test(line))) {
        achievements.add('CHECKLIST_KEEPER');
      }

      const requestsDress = /<!--\s*tuition:\s*dress\s*-->/i.test(body);
      const requestsCreative = /<!--\s*tuition:\s*creative\s*-->/i.test(body);
      if (requestsDress || requestsCreative) {
        let files = [];
        try {
          files = await changedFiles(pr.number);
        } catch (error) {
          core.warning(`Could not inspect tuition files for PR #${pr.number}: ${error.message}`);
        }

        if (requestsDress) {
          const images = files.filter(file => file.status !== 'removed' && dressImageCandidate(file.filename));
          const manuallyVerified = hasLabel(pr, DRESS_VERIFIED_LABEL);
          if (images.length > 0 && manuallyVerified) {
            tuitionDress = true;
            achievements.add('TUITION_PAID_DRESS');
            tuitionEvidence.push({
              route: 'dress',
              pull_request: pr.number,
              verified_label: DRESS_VERIFIED_LABEL,
              candidate_images: images.map(file => file.filename),
              verified_at: pr.merged_at,
            });
          } else if (requestsDress) {
            core.notice(`Dress tuition PR #${pr.number} is not credentialed yet: candidate_images=${images.length}, verified_label=${manuallyVerified}.`);
          }
        }

        if (requestsCreative) {
          const ownFiles = files.filter(file => file.status !== 'removed' && creativeCandidate(file.filename, pr.user.login));
          const verifiedLabel = hasLabel(pr, CREATIVE_VERIFIED_LABEL);
          // Creative Tuition has no special IP grant, so the structural path check is enough after merge.
          // A maintainer label is recorded when present and can be used for stricter projects later.
          if (ownFiles.length > 0) {
            tuitionCreative = true;
            achievements.add('TUITION_PAID_CREATIVE');
            tuitionEvidence.push({
              route: 'creative',
              pull_request: pr.number,
              verified_label: verifiedLabel ? CREATIVE_VERIFIED_LABEL : null,
              files: ownFiles.map(file => file.filename),
              verified_at: pr.merged_at,
            });
          }
        }
      }

      if (!reviewPass) {
        try {
          const reviews = await github.paginate(github.rest.pulls.listReviews, {
            owner, repo, pull_number: pr.number, per_page: 100,
          });
          if (reviews.some(review => review.state === 'APPROVED' && Number(review.user?.id) !== userId)) {
            reviewPass = true;
            achievements.add('REVIEW_PASS');
          }
        } catch (error) {
          core.warning(`Review inspection failed for PR #${pr.number}: ${error.message}`);
        }
      }

      if (!greenLight) {
        try {
          const checks = await github.rest.checks.listForRef({ owner, repo, ref: pr.head.sha, per_page: 100 });
          const runs = checks.data.check_runs || [];
          const accepted = new Set(['success', 'neutral', 'skipped']);
          if (runs.length > 0 && runs.every(run => run.status === 'completed' && accepted.has(run.conclusion))) {
            greenLight = true;
            achievements.add('GREEN_LIGHT');
          }
        } catch (error) {
          core.warning(`Check inspection failed for PR #${pr.number}: ${error.message}`);
        }
      }

      evidence.push({
        pull_request: pr.number,
        url: pr.html_url,
        merged_at: pr.merged_at,
        head_sha: pr.head.sha,
      });
    }

    if (tuitionCreative) prestige.add('CREATIVE_ROUTE');
    if (tuitionDress) prestige.add('DRESS_ROUTE');

    const allCore = CORE.every(code => achievements.has(code));
    const qualifiesByDress = achievements.has('TUITION_PAID_DRESS');
    const qualifies = qualifiesByDress || allCore;
    let pass = priorPass || {
      active: false,
      granted_by: null,
      granted_at: null,
      evidence_pr: null,
      authorization_id: null,
      verification_gate: null,
      terms: 'AETHRA-FANWORK-PASS.md',
    };

    if (qualifies && !pass.active) {
      const evidencePr = qualifiesByDress
        ? tuitionEvidence.filter(item => item.route === 'dress').at(-1)?.pull_request || prs.at(-1).number
        : prs.at(-1).number;
      pass = {
        active: true,
        granted_by: qualifiesByDress ? 'maintainer-verified-dress-tuition' : 'all-core-github-evidence',
        granted_at: now,
        evidence_pr: evidencePr,
        authorization_id: null,
        verification_gate: qualifiesByDress ? DRESS_VERIFIED_LABEL : 'core-achievements-reconciled',
        terms: 'AETHRA-FANWORK-PASS.md',
      };
      pass.authorization_id = makeAuthorizationId(userId, pass);
    } else if (pass.active && !pass.authorization_id) {
      pass.authorization_id = makeAuthorizationId(userId, pass);
    }
    if (pass.active) prestige.add('AETHRA_PASS_HOLDER');

    aliases.delete(login);
    const canonicalEvidence = uniqueBy(evidence, item => String(item.pull_request))
      .sort((a, b) => Number(a.pull_request) - Number(b.pull_request));
    const canonicalAchievementEvidence = uniqueBy(
      achievementEvidence,
      item => `${item.achievement || ''}|${item.evidence_url || ''}`
    );
    const canonicalTuitionEvidence = uniqueBy(
      tuitionEvidence,
      item => `${item.route || ''}|${item.pull_request || ''}`
    );

    const record = {
      schema_version: 4,
      status: 'active',
      credential_id: `SPC-GIT-${login}`,
      holder: login,
      github_user_id: userId,
      subject: `github-user:${userId}`,
      aliases: Array.from(aliases).sort((a, b) => a.localeCompare(b)),
      issuer: 'Stellaria Git PlayGround',
      callsign: makeCallsign(login),
      clearance: clearanceFor(achievements),
      achievements: Array.from(achievements).sort(),
      prestige: Array.from(prestige).sort(),
      tuition: {
        creative: tuitionCreative,
        dress: tuitionDress,
        evidence: canonicalTuitionEvidence,
      },
      aethra_fanwork_pass: pass,
      verification: {
        page: `https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=${encodeURIComponent(`SPC-GIT-${login}`)}`,
        detail_page: `https://stellaria-studio.github.io/Stellaria-Git-PlayGround/details.html?id=${encodeURIComponent(`SPC-GIT-${login}`)}`,
        record: canonicalPath,
        badge: badgePath,
      },
      evidence: canonicalEvidence,
      achievement_evidence: canonicalAchievementEvidence,
      created_at: createdAt,
      updated_at: currentExisting?.record?.updated_at || now,
    };

    record.integrity = {
      scheme: 'SPC-CANONICAL-SHA256-V1',
      canonical_repo: OFFICIAL_REPO,
      proof: proofFor(record),
      proof_hint: 'Compare against credentials/index.json on the official repository or Mission Control site.',
    };

    if (!sameRecord(currentExisting?.record, record)) {
      record.updated_at = now;
      // proof intentionally excludes updated_at, so no second hash pass is needed.
      await putText(
        canonicalPath,
        `${JSON.stringify(record, null, 2)}\n`,
        `chore(credentials): reconcile @${login}`,
        currentExisting?.sha || null
      );
      core.notice(`Credential reconciled: ${record.credential_id}`);
    }

    const badge = makeBadge(record);
    const existingBadge = await getText(badgePath);
    if (!existingBadge || existingBadge.text !== badge) {
      await putText(badgePath, badge, `chore(badges): reconcile @${login}`, existingBadge?.sha || null);
    }

    for (const legacy of relatedExisting.filter(item => item.path !== canonicalPath)) {
      const legacyHolder = legacy.record?.holder || legacy.path.split('/').pop().replace(/\.json$/i, '');
      const aliasRecord = {
        schema_version: 4,
        status: 'renamed',
        credential_id: `SPC-GIT-${legacyHolder}`,
        holder: legacyHolder,
        github_user_id: userId,
        issuer: 'Stellaria Git PlayGround',
        renamed_to: login,
        canonical_id: record.credential_id,
        canonical_record: canonicalPath,
        canonical_proof: record.integrity.proof,
        updated_at: record.updated_at,
      };
      if (JSON.stringify(legacy.record) !== JSON.stringify(aliasRecord)) {
        await putText(
          legacy.path,
          `${JSON.stringify(aliasRecord, null, 2)}\n`,
          `chore(credentials): redirect renamed handle ${legacyHolder}`,
          legacy.sha
        );
      }
    }

    canonicalRecords.push(record);

    for (const pr of prs) {
      try {
        const comments = await github.paginate(github.rest.issues.listComments, {
          owner, repo, issue_number: pr.number, per_page: 100,
        });
        if (comments.some(comment => comment.body?.includes(COMMENT_MARKER))) continue;

        const badgeRaw = `https://raw.githubusercontent.com/${owner}/${repo}/${BRANCH}/${badgePath}`;
        const verifyUrl = record.verification.page;
        const lines = [
          COMMENT_MARKER,
          '🌌 **Stellaria PlayGround Mission Control · Credential reconciled**',
          '',
          `Credential: \`${record.credential_id}\``,
          `Callsign: **${record.callsign}**`,
          `Clearance: **${record.clearance.code} · ${record.clearance.title}**`,
          `Core progress: **${record.clearance.level}/${CORE.length}**`,
          `Security seal: \`PROOF-${record.integrity.proof.slice(0, 12).toUpperCase()}\``,
          `Canonical evidence: PR #${pr.number}`,
          '',
          `Verifier: ${verifyUrl}`,
          '',
          '**GitHub Profile Badge**',
          '',
          `\`[![Stellaria SPC](${badgeRaw})](${verifyUrl})\``,
        ];
        if (record.aethra_fanwork_pass?.active) {
          lines.push(
            '',
            '✨ **AETHRA_FANWORK_PASS · ACTIVE**',
            `Authorization: \`${record.aethra_fanwork_pass.authorization_id}\``
          );
        }
        lines.push('', '_PlayGround credential only; no repository/admin/member/professional privileges are granted._');
        await github.rest.issues.createComment({ owner, repo, issue_number: pr.number, body: lines.join('\n') });
      } catch (error) {
        core.warning(`Could not comment on PR #${pr.number}: ${error.message}`);
      }
    }
  }

  canonicalRecords.sort((a, b) =>
    b.clearance.level - a.clearance.level ||
    b.achievements.length - a.achievements.length ||
    a.holder.localeCompare(b.holder)
  );

  const rosterEntries = canonicalRecords.map(record => ({
    credential_id: record.credential_id,
    holder: record.holder,
    github_user_id: record.github_user_id,
    callsign: record.callsign,
    clearance: record.clearance,
    achievements: record.achievements,
    prestige: record.prestige,
    tuition: {
      creative: Boolean(record.tuition?.creative),
      dress: Boolean(record.tuition?.dress),
    },
    evidence_count: Array.isArray(record.evidence) ? record.evidence.length : 0,
    aethra_fanwork_pass: Boolean(record.aethra_fanwork_pass?.active),
    authorization_id: record.aethra_fanwork_pass?.authorization_id || null,
    proof: record.integrity?.proof || null,
    updated_at: record.updated_at,
  }));

  const registryHash = crypto.createHash('sha256').update(stableStringify(rosterEntries)).digest('hex');
  const roster = {
    schema_version: 2,
    issuer: 'Stellaria Git PlayGround',
    canonical_repo: OFFICIAL_REPO,
    proof_scheme: 'SPC-CANONICAL-SHA256-V1',
    registry_hash: registryHash,
    generated_at: new Date().toISOString(),
    entries: rosterEntries,
  };

  const rosterPath = 'credentials/index.json';
  const existingRoster = await getText(rosterPath);
  let parsedRoster = null;
  try { parsedRoster = existingRoster ? JSON.parse(existingRoster.text) : null; } catch {}
  // generated_at changes every run; avoid a write when the actual canonical registry has not changed.
  if (parsedRoster?.registry_hash !== roster.registry_hash || parsedRoster?.schema_version !== roster.schema_version) {
    await putText(
      rosterPath,
      `${JSON.stringify(roster, null, 2)}\n`,
      'chore(credentials): refresh Mission Control registry',
      existingRoster?.sha || null
    );
  }

  core.notice(`Mission Control reconciliation complete: ${canonicalRecords.length} active credential(s). Registry ${registryHash.slice(0, 12)}.`);
};
