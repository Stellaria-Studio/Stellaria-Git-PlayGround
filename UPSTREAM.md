# Upstream & Historical Content

This repository is a public fork of:

- **Upstream:** [Cute-Dress/Dress](https://github.com/Cute-Dress/Dress)
- **Fork namespace:** `Stellaria-Studio/Stellaria-Git-PlayGround`
- **Default branch at bootstrap:** `master`
- **Observed fork-point commit:** `c824a5dce4b664aca34ff3594a96e6b9257ec891`
- **Upstream commit message:** `add photos and readme (#459)`
- **Observed upstream commit date:** 2026-09-05
- **Stellaria bootstrap date:** 2026-09-07

## Historical content provenance

Before the first Stellaria-specific bootstrap commit, the repository history, photos, documents, workflows and contribution records were inherited from `Cute-Dress/Dress` through GitHub's fork mechanism.

Stellaria Studio does **not** claim authorship or ownership of those historical photos merely because they are present in this fork. Their original paths, commits, authors and contributor history remain part of the Git history and should be used as provenance.

Future upstream synchronization may introduce additional upstream commits. Git ancestry remains the primary source of truth for provenance.

## Guarded automatic synchronization

The fork uses:

```text
.github/workflows/upstream_sync.yml
```

The workflow runs weekly and can also be triggered manually.

It does **not** blindly call “sync master and hope for the best”. Instead it uses an `upstream-sync` staging branch:

```text
Cute-Dress/Dress
       │
       ▼
upstream-sync
       │
       ├── legacy contribution paths only ──► auto merge
       │
       └── structural / Stellaria paths ─────► human-review PR
```

### Auto-merge allowlist

Only changes whose paths are entirely inside the historical contribution buckets may auto-merge:

```text
A/
B/
...
Z/
#/
```

This covers the ordinary upstream photo/contributor growth that this fork primarily wants to retain.

### Human-review paths

Anything outside those contribution buckets is held for review, including but not limited to:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `.github/**`
- workflows and PR templates
- `credentials/**`
- `badges/**`
- `site/**`
- `playground/**`
- Stellaria-specific policy / credential / Aethra files

This is deliberate supply-chain hygiene: a public upstream should not be able to silently replace this fork's trusted workflows, licensing text or credential logic just because a scheduled job ran.

### Merge conflicts

Conflicts are never auto-resolved.

If GitHub cannot merge upstream into `upstream-sync`, the workflow opens (or updates) an issue titled roughly:

```text
Upstream sync conflict · manual resolution required
```

A maintainer must then decide what the correct merge should be.

### Why stage instead of directly syncing master?

Because Stellaria intentionally diverges from upstream in README, contribution rules, automation and extra licensing. A staging PR gives us a visible audit point while still letting ordinary legacy content stay synchronized with almost no maintenance.

## License continuity

The inherited repository `LICENSE` is intentionally left unchanged. The upstream project uses Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).

Stellaria-specific files added by this fork do not relicense historical photos or other third-party contributions.

`AETHRA-FANWORK-PASS.md` is an **additional permission** for rights in 李观澜（Aethra）that Stellaria Studio or the relevant rights holder actually owns / controls. It does not alter the license or ownership of upstream photos, third-party characters, trademarks, or historical contributions.

## Why keep the full fork history?

Because provenance is better than “图片来源：网络”.

The GitHub fork relationship, commit graph, file history and this document together make it clear which material came from upstream and which changes were made by Stellaria Studio.
