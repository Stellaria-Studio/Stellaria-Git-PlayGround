# Stellaria Playground Credentials

Stellaria Playground Credentials（SPC）是一套**公开、机器可读、项目内游戏化**的 Git / GitHub 学习记录。

它的目标不是发一张看起来很正式但无法追溯的 PNG，而是把“这个人真的在 PlayGround 里做过哪些 Git 操作”绑定到公开 Pull Request、Review、Check Run、Tuition Verification 与维护者审核记录。

> 除 `AETHRA_FANWORK_PASS` 另有明确许可文本外，SPC 不代表 Stellaria Studio 员工 / 成员身份、专业资格、仓库权限或对外代表权。

## Credential ID 与 stable subject

展示 ID：

```text
SPC-GIT-<github-login>
```

机器可读记录：

```text
credentials/<github-login>.json
```

但真正用于连续身份的是 GitHub numeric user ID：

```text
subject = github-user:<numeric-id>
```

因此 GitHub Login 改名后，旧 Login 会保留 redirect alias，canonical Credential 会迁移到新 Login，而不是凭空获得第二张证。

## 在线 Mission Control

```text
https://stellaria-studio.github.io/Stellaria-Git-PlayGround/
```

现在分成几个页面：

- `/` — **我的证**：证件正面、Clearance、Callsign、Signal、Security Seal；
- `/details.html` — **详细档案**：Proof、GitHub Evidence、Aliases、Tuition、Pass；
- `/leaderboard.html` — **Flight Board**：公开排行榜；
- `/achievements.html` — **成就图鉴**：Core / Tuition / Bonus 与动态稀有度；
- `/passes.html` — **授权与荣誉**：Aethra Fanwork Pass 公共登记；
- `/lab.html` — **大杂烩实验室**：科研价值约等于零的花活。

首次输入自己的 Credential 后，页面会在本地浏览器记住它；以后进入首页会优先显示“自己的证”。

## Credential schema v4

核心字段包括：

- `credential_id` — 展示 ID；
- `holder` — 当前 GitHub Login；
- `github_user_id` / `subject` — 稳定 GitHub 身份锚点；
- `aliases` — 历史 Login；
- `callsign` — Mission Control 呼号；
- `clearance` — `SPC-CL-0` ~ `SPC-CL-6`；
- `achievements` — Core / Tuition / Bonus；
- `prestige` — 路线与特殊荣誉；
- `tuition.evidence` — 学费认定的 PR / label / 文件候选；
- `aethra_fanwork_pass` — 特殊二创许可状态；
- `evidence` — 已合并 PR；
- `achievement_evidence` — 人工授予 Bonus 的公开证据；
- `integrity` — canonical SHA-256 Seal。

## Canonical SHA-256 Seal

schema v4 会对与资格有关的稳定字段生成：

```text
SPC-CANONICAL-SHA256-V1
```

并写入：

```json
"integrity": {
  "scheme": "SPC-CANONICAL-SHA256-V1",
  "canonical_repo": "Stellaria-Studio/Stellaria-Git-PlayGround",
  "proof": "...sha256..."
}
```

同时 `credentials/index.json` 的 Registry 会保存同一 stable subject 的 `proof`。

Mission Control 页面会重新计算 Record Proof，并要求：

1. Record Proof == Browser Recomputed Proof；
2. Record Proof == Registry Proof；
3. `canonical_repo` == 官方仓库；
4. issuer / credential ID / stable subject 结构匹配。

因此普通人不能只手改一个 JSON 或 SVG 就让官方验证页承认它。详细设计见 [SECURITY-MODEL.md](SECURITY-MODEL.md)。

> 这不是秘密签名，也不是现实世界 PKI。截图依然可以被 P；真正的权威来源是官方 canonical verifier 的实时结果。

## Core Git Achievements

| Code | 名称 | 自动判定规则 |
| --- | --- | --- |
| `FIRST_CONTACT` | First Contact | 至少一个 PR 被合并 |
| `BRANCH_EXPLORER` | Branch Explorer | 合并 PR 来自非默认分支 / Fork 分支 |
| `CHECKLIST_KEEPER` | Checklist Keeper | PR 至少 3 个自查框且全部勾选 |
| `REVIEW_PASS` | Review Pass | 已合并 PR 得到**其他 GitHub 用户**的一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | Returning Contributor | 至少 2 个 PR 被合并 |
| `GREEN_LIGHT` | Green Light | 某个已合并 PR 的 Head Commit Checks 全部 success / neutral / skipped |

Core 数量映射为：

```text
SPC-CL-0  Visitor Interface
SPC-CL-1  Commit Initiate
SPC-CL-2  Branch Operator
SPC-CL-3  Merge Navigator
SPC-CL-4  Repository Interface Clearance
SPC-CL-5  Advanced Collaboration Clearance
SPC-CL-6  PlayGround Flight Clearance
```

名字比实际权限高级很多。`SPC-CL-6` 仍然不会自动给 Merge / Write / Admin 权限。（doge）

## Tuition Achievements

### Creative Tuition

需要：

- PR 包含 `<!-- tuition: creative -->`；
- 至少一个新增 / 修改文件位于 `playground/<PR 作者 GitHub ID>/`；
- PR 被 Merge。

满足后可获得 `TUITION_PAID_CREATIVE`。

### Dress Tuition 👗

因为 `TUITION_PAID_DRESS` 可以直接解锁 Aethra Fanwork Pass，所以它有更严格的门：

- PR 包含 `<!-- tuition: dress -->`；
- 至少一张图片位于传统 `A-Z/#/昵称/` 路径；
- 维护者实际查看贡献；
- 维护者运行 **Verify Playground Tuition** Workflow；
- Workflow 写入 `tuition:verified:dress` label；
- PR 被 Merge；
- Reconciler 根据 GitHub evidence 生成 Credential。

**只有 PR Body marker，没有人工 verification label，不会获得 Dress Tuition，也不会触发 Aethra Fanwork Pass。**

## Aethra Fanwork Pass

满足任一条件：

1. 获得经过维护者核验的 `TUITION_PAID_DRESS`；或
2. 集齐全部 6 个 Core Achievements。

即可获得：

```json
"aethra_fanwork_pass": {
  "active": true,
  "authorization_id": "AETHRA-<github-user-id>-<checksum>",
  "verification_gate": "...",
  "terms": "AETHRA-FANWORK-PASS.md"
}
```

Pass 只有在官方 Record / Registry / SHA-256 Seal 全部一致时，Mission Control 才显示：

```text
ACTIVE · VERIFIED
```

完整许可见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。

## SVG Badge

每次 Reconcile 会生成：

```text
badges/<github-login>.svg
```

Badge 的 `<title>` 也包含当前 canonical proof 的短摘要。

推荐放进 GitHub Profile：

```md
[![Stellaria SPC](https://raw.githubusercontent.com/Stellaria-Studio/Stellaria-Git-PlayGround/master/badges/<github-login>.svg)](https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=SPC-GIT-<github-login>)
```

## Canonical artifact guard

以下文件由 Mission Control 生成：

```text
credentials/*.json
badges/*.svg
```

普通 PR 直接修改它们会被 **Guard Canonical Mission Control Artifacts** Workflow 判定失败。

想改成就 / Pass 状态，应修改底层 evidence 或使用维护者 Workflow，而不是“自己写一张证”。

## Bonus Achievements

`CONFLICT_SURVIVOR`、`REBASE_ENJOYER`、`CI_DESTROYER`、`CI_REDEEMER`、`UPSTREAM_NAVIGATOR`、`MERGE_PILOT` 等 Bonus Achievement 通过公开 GitHub Evidence 申请，由维护者运行 Grant Workflow 写入。

完整目录见 [ACHIEVEMENTS.md](ACHIEVEMENTS.md)。

## Workflow 信任边界

Credential Reconciler：

- 不 checkout 未受信任 PR Head；
- 不执行贡献者提交的代码；
- 只通过 GitHub API 读取 PR / Review / Check / Label / File metadata；
- 从可信 `master` 读取 Reconciler module；
- 使用仓库 `GITHUB_TOKEN` 写 canonical Record / Badge / Registry；
- 最后触发 GitHub Pages 刷新。

Tuition Verification 和 Bonus Grant 都是 `workflow_dispatch`，只有具备仓库相应写权限的人能运行。

## Credential 不代表什么

SPC 不代表：

- Stellaria Studio 员工或正式成员身份；
- 专业技术资格证书；
- 仓库写权限、Merge 权限或管理员权限；
- Stellaria Studio 对外代表权；
- Code Review 豁免。

它唯一严肃一点的附加效果，是符合条件后可解锁单独定义并可在线验证的 **Aethra Fanwork Pass**。
