# Stellaria Playground Credentials

Stellaria Playground Credentials（SPC）是一套**公开、机器可读、纯项目内游戏化**的 Git 学习记录。

它的作用是把“我真的完成过这些 Git / GitHub 操作”变成可以在仓库里验证的记录，而不是发一张无法追溯的 PNG 证书。

## Credential ID

每个贡献者使用稳定 ID：

```text
SPC-GIT-<github-login>
```

对应记录：

```text
credentials/<github-login>.json
```

记录会包含成就、学费类型、证据 PR、更新时间，以及 Aethra Fanwork Pass 状态。

## Core Git Achievements

以下 6 个是解锁 Aethra Fanwork Pass 的 Core Achievements：

| Code | 名称 | 自动判定规则 |
| --- | --- | --- |
| `FIRST_CONTACT` | First Contact | 至少一个 PR 被合并 |
| `BRANCH_EXPLORER` | Branch Explorer | 合并的 PR 来自非默认分支 / Fork 分支 |
| `CHECKLIST_KEEPER` | Checklist Keeper | PR 中至少有 3 个自查框，且全部已勾选 |
| `REVIEW_PASS` | Review Pass | 某个已合并 PR 至少得到一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | Returning Contributor | 该 GitHub 用户在本仓库至少有 2 个已合并 PR |
| `GREEN_LIGHT` | Green Light | 某个已合并 PR 的 Head Commit 上存在 Check Runs，且全部为 success / neutral / skipped |

这些条件故意设计成“真用过 GitHub 才会慢慢集齐”，而不是点一下按钮领满级账号。

## Tuition Achievements

| Code | 条件 |
| --- | --- |
| `TUITION_PAID_CREATIVE` | 使用 Creative Tuition 模板提交原创内容并被维护者合并 |
| `TUITION_PAID_DRESS` | 使用 Dress Tuition 模板提交本人有权公开的女装照并被维护者合并 |

`TUITION_PAID_DRESS` 同时是一条 Aethra Fanwork Pass 的快捷解锁路径。

## Aethra Fanwork Pass 解锁逻辑

满足任一条件：

```text
TUITION_PAID_DRESS
```

或：

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

写入 Credential。

完整许可内容见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。

## 自动化如何工作

`.github/workflows/stellaria_credentials.yml` 使用 `pull_request_target` 的 `closed` 事件，并且**只在 PR 已经被合并时运行**。

安全设计：

- Workflow 不 checkout PR Head；
- 不执行贡献者提交的脚本或代码；
- 只读取 PR 元数据、Reviews、Check Runs 与已有 Credential；
- 然后使用仓库 `GITHUB_TOKEN` 更新 `credentials/<login>.json`；
- 最后在已合并 PR 下留言告知新成就和 Pass 状态。

因为 `pull_request_target` 具有较高权限，所以**不要**在这个 Workflow 里加入 `checkout` 未信任 Fork、运行 PR 文件、安装 PR 中定义的依赖等操作。

## Credential 示例

```json
{
  "schema_version": 1,
  "credential_id": "SPC-GIT-example",
  "holder": "example",
  "issuer": "Stellaria Git PlayGround",
  "achievements": [
    "FIRST_CONTACT",
    "BRANCH_EXPLORER",
    "CHECKLIST_KEEPER"
  ],
  "tuition": {
    "creative": true,
    "dress": false
  },
  "aethra_fanwork_pass": {
    "active": false,
    "terms": "AETHRA-FANWORK-PASS.md"
  },
  "evidence": [
    {
      "pull_request": 42,
      "url": "https://github.com/Stellaria-Studio/Stellaria-Git-PlayGround/pull/42"
    }
  ]
}
```

## Future / Bonus Achievements

下面这些名字先占坑，后续可以接入更精细的自动判定或维护者授予：

- `CONFLICT_SURVIVOR`
- `REBASE_ENJOYER`
- `CI_DESTROYER`
- `CI_REDEEMER`
- `UPSTREAM_NAVIGATOR`
- `MERGE_PILOT`

名字可以非常高级，权限可以一丁点没有。这就是 Playground 的精神（doge）。

## Credential 不代表什么

SPC 不代表：

- Stellaria Studio 员工或正式成员身份；
- 专业技术资格证书；
- 仓库写权限、Merge 权限或管理员权限；
- Stellaria Studio 对外代表权；
- Code Review 豁免。

它唯一严肃一点的附加效果，是符合条件后可解锁单独定义的 **Aethra Fanwork Pass**。
