# Stellaria Playground Credentials

Stellaria Playground Credentials（SPC）是一套**公开、机器可读、纯项目内游戏化**的 Git 学习记录。

它把“我真的完成过这些 Git / GitHub 操作”变成可追溯的数据，而不是一张无法验证来源的 PNG 证书。

> 除 `AETHRA_FANWORK_PASS` 另有明确许可文本外，SPC 不代表 Stellaria Studio 员工 / 成员身份、专业资格、仓库权限或对外代表权。

## Credential ID

每个贡献者使用稳定 ID：

```text
SPC-GIT-<github-login>
```

对应机器可读记录：

```text
credentials/<github-login>.json
```

对应自动生成 SVG Badge：

```text
badges/<github-login>.svg
```

Credential v2 还会包含：

- `callsign` — 根据 GitHub Login 确定性生成的 Mission Control 呼号；
- `clearance` — 根据 6 个 Core Git Achievements 自动计算的 `SPC-CL-0` ~ `SPC-CL-6`；
- `prestige` — Creative / Dress / Aethra Pass 等路线标记；
- `evidence` — 支撑这份记录的已合并 PR；
- `verification` — 验证页、原始记录和 Badge 路径。

## 在线验证

GitHub Pages 验证页：

```text
https://stellaria-studio.github.io/Stellaria-Git-PlayGround/
```

可以输入：

```text
example
@example
SPC-GIT-example
```

页面会从本仓库公开 Credential 中读取数据，并检查：

- `issuer == Stellaria Git PlayGround`；
- `holder` 与输入 GitHub Login 对应；
- `credential_id == SPC-GIT-<holder>`。

这里的 `VERIFIED` 表示**官方公开仓库里存在匹配的 canonical record**，不是密码学身份证明，也不是现实世界身份认证。

## Core Git Achievements

以下 6 个是 Core Achievements：

| Code | 名称 | 自动判定规则 |
| --- | --- | --- |
| `FIRST_CONTACT` | First Contact | 至少一个 PR 被合并 |
| `BRANCH_EXPLORER` | Branch Explorer | 合并的 PR 来自非默认分支 / Fork 分支 |
| `CHECKLIST_KEEPER` | Checklist Keeper | PR 中至少有 3 个自查框，且全部已勾选 |
| `REVIEW_PASS` | Review Pass | 某个已合并 PR 至少得到一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | Returning Contributor | 该 GitHub 用户在本仓库至少有 2 个已合并 PR |
| `GREEN_LIGHT` | Green Light | 某个已合并 PR 的 Head Commit 上存在 Check Runs，且全部为 success / neutral / skipped |

完整成就目录见 [ACHIEVEMENTS.md](ACHIEVEMENTS.md)。

## Clearance

Core 数量直接映射成：

```text
SPC-CL-0  Visitor Interface
SPC-CL-1  Commit Initiate
SPC-CL-2  Branch Operator
SPC-CL-3  Merge Navigator
SPC-CL-4  Repository Interface Clearance
SPC-CL-5  Advanced Collaboration Clearance
SPC-CL-6  PlayGround Flight Clearance
```

这些名字故意比实际权限高级很多。`SPC-CL-6` 依然不会给你 Merge / Write / Admin 权限（doge）。

## Callsign

Credential v2 会把 GitHub Login 做 SHA-256，然后从固定词表确定性生成 Callsign，例如：

```text
Aster-Vector-7C2D
Nebula-Pilot-A91F
```

它不是密钥，不用于认证，也没有任何安全含义；只是看起来很像 Mission Control 真给你发了一个呼号。

## Tuition Achievements

| Code | 条件 |
| --- | --- |
| `TUITION_PAID_CREATIVE` | 使用 Creative Tuition 模板提交原创内容并被维护者合并 |
| `TUITION_PAID_DRESS` | 使用 Dress Tuition 模板提交本人有权公开的女装照并被维护者合并 |

`TUITION_PAID_DRESS` 同时是一条 Aethra Fanwork Pass 的快捷解锁路径。

## Aethra Fanwork Pass

满足任一条件：

```text
TUITION_PAID_DRESS
```

或集齐：

```text
FIRST_CONTACT
+ BRANCH_EXPLORER
+ CHECKLIST_KEEPER
+ REVIEW_PASS
+ RETURNING_CONTRIBUTOR
+ GREEN_LIGHT
```

即可把：

```json
"aethra_fanwork_pass": {
  "active": true
}
```

写入 Credential，同时增加 `AETHRA_PASS_HOLDER` Prestige。

完整许可内容见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。

## SVG Badge

Credential 每次更新时都会同步更新：

```text
badges/<github-login>.svg
```

推荐粘到 GitHub Profile：

```md
[![Stellaria SPC](https://raw.githubusercontent.com/Stellaria-Studio/Stellaria-Git-PlayGround/master/badges/<github-login>.svg)](https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=SPC-GIT-<github-login>)
```

验证页也提供一键复制 Markdown。

## 自动化如何工作

`.github/workflows/stellaria_credentials.yml` 使用 `pull_request_target` 的 `closed` 事件，并且**只在 PR 已经被合并时运行**。

安全设计：

- Workflow 不 checkout PR Head；
- 不执行贡献者提交的脚本或代码；
- 只读取 PR 元数据、Reviews、Check Runs 与已有 Credential；
- 使用仓库 `GITHUB_TOKEN` 更新 `credentials/<login>.json` 与 `badges/<login>.svg`；
- 最后在已合并 PR 下留言告知新成就、Clearance、验证页与 Pass 状态。

因为 `pull_request_target` 具有较高权限，所以**不要**在这个 Workflow 里加入 checkout 未信任 Fork、运行 PR 文件、安装 PR 中定义的依赖等操作。

## Credential v2 示例

```json
{
  "schema_version": 2,
  "credential_id": "SPC-GIT-example",
  "holder": "example",
  "issuer": "Stellaria Git PlayGround",
  "callsign": "Aster-Vector-7C2D",
  "clearance": {
    "level": 3,
    "code": "SPC-CL-3",
    "title": "Merge Navigator"
  },
  "achievements": [
    "FIRST_CONTACT",
    "BRANCH_EXPLORER",
    "CHECKLIST_KEEPER"
  ],
  "prestige": ["CREATIVE_ROUTE"],
  "tuition": {
    "creative": true,
    "dress": false
  },
  "aethra_fanwork_pass": {
    "active": false,
    "terms": "AETHRA-FANWORK-PASS.md"
  },
  "verification": {
    "page": "https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=SPC-GIT-example",
    "record": "credentials/example.json",
    "badge": "badges/example.svg"
  },
  "evidence": [
    {
      "pull_request": 42,
      "url": "https://github.com/Stellaria-Studio/Stellaria-Git-PlayGround/pull/42"
    }
  ]
}
```

## Bonus Achievements

`CONFLICT_SURVIVOR`、`REBASE_ENJOYER`、`CI_DESTROYER`、`CI_REDEEMER`、`UPSTREAM_NAVIGATOR`、`MERGE_PILOT` 等 Bonus Achievement 记录在 [ACHIEVEMENTS.md](ACHIEVEMENTS.md)。

仓库提供 **Achievement Claim** Issue Form，用公开 PR / commit / workflow run 作为证据提交申请。它们目前不参与 Core Clearance。

## Credential 不代表什么

SPC 不代表：

- Stellaria Studio 员工或正式成员身份；
- 专业技术资格证书；
- 仓库写权限、Merge 权限或管理员权限；
- Stellaria Studio 对外代表权；
- Code Review 豁免。

它唯一严肃一点的附加效果，是符合条件后可解锁单独定义的 **Aethra Fanwork Pass**。
