# Stellaria PlayGround Achievement Catalog

> **名字可以像航天器执照，权限可以一丁点没有。**

本文件定义 Stellaria Git PlayGround 的游戏化成就、Clearance 等级和 Prestige 标记。

所有内容默认只属于 **PlayGround**。除 `AETHRA_FANWORK_PASS` 另有明确许可文本外，成就不会授予仓库写权限、Stellaria Studio 成员身份、雇佣关系、职业资格或对外代表权。

## Core Git Achievements

这 6 个成就决定 `SPC-CL-*` Clearance 等级；全部集齐也是 Aethra Fanwork Pass 的正常技术路线。

| Code | Display name | 判定 |
| --- | --- | --- |
| `FIRST_CONTACT` | First Contact | 第一个 PR 被 Merge |
| `BRANCH_EXPLORER` | Branch Explorer | 从非默认分支 / Fork 分支完成 Merge |
| `CHECKLIST_KEEPER` | Checklist Keeper | PR 至少 3 个自查框且全部勾选 |
| `REVIEW_PASS` | Review Pass | 已合并 PR 获得至少一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | Returning Contributor | 本仓库至少 2 个 PR 被 Merge |
| `GREEN_LIGHT` | Green Light | Merge 时 PR Head 上可见 Checks 全部为 success / neutral / skipped |

## Tuition Achievements

| Code | Display name | 判定 |
| --- | --- | --- |
| `TUITION_PAID_CREATIVE` | Creative Tuition | Creative Tuition PR 被接受并 Merge |
| `TUITION_PAID_DRESS` | Dress Tuition 👗 | Dress Tuition PR 被接受并 Merge |

`TUITION_PAID_DRESS` 是祖传隐藏捷径：它会直接满足 Aethra Fanwork Pass 的解锁条件。

## Bonus / Claimable Achievements

这些成就主要用于“明明只是 Git 行为，为什么名字像舰桥人员资格认证”。部分暂时需要维护者根据证据授予，后续可以逐步自动化。

| Code | Display name | 建议证据 |
| --- | --- | --- |
| `CONFLICT_SURVIVOR` | Conflict Survivor | 真实解决 merge / rebase conflict 的 PR 或 commit |
| `REBASE_ENJOYER` | Certified Rebase Enjoyer | 明确完成一次 rebase 并保持历史可解释 |
| `CI_DESTROYER` | CI Destroyer | 自己的提交让 CI 红过 |
| `CI_REDEEMER` | CI Redeemer | 把自己弄红的 CI 修回绿灯 |
| `UPSTREAM_NAVIGATOR` | Upstream Navigator | 参与一次上游同步 / 冲突处理 |
| `MERGE_PILOT` | Merge Pilot | 有证据地完成一次 Merge 操作 |
| `DOCS_ORBITER` | Documentation Orbiter | 对 PlayGround 文档有有效贡献 |
| `EXIF_PURIFIER` | EXIF Purifier | 发现并正确清理高敏感 EXIF |
| `BLOB_MINIMALIST` | Blob Minimalist | 使用 partial clone / sparse workflow 完成大仓库贡献 |
| `HOTFIX_SURGEON` | Hotfix Surgeon | 用最小改动修复一次真实问题 |
| `PATCH_CARTOGRAPHER` | Patch Cartographer | 把一个混乱改动拆成可 Review 的清晰 patch / PR |
| `NO_SECRET_INCIDENT` | No Secret Incident | 恭喜，没有把 Token 提交进公开历史；默认不发，因为这本来就应该做到 |

最后一个属于典型的“活着就是成就，但我们决定不颁奖”（doge）。

## Clearance Levels

Clearance 由 **Core Achievements 数量**自动计算，不需要人工审批。

| Level | Code | Title | 实际效果 |
| ---: | --- | --- | --- |
| 0 | `SPC-CL-0` | Visitor Interface | 看起来像游客卡，确实也是游客卡 |
| 1 | `SPC-CL-1` | Commit Initiate | 证明至少真的 Merge 过一次 |
| 2 | `SPC-CL-2` | Branch Operator | 开始像会 Git 的样子了 |
| 3 | `SPC-CL-3` | Merge Navigator | 证书含金量约等于“没有完全迷路” |
| 4 | `SPC-CL-4` | Repository Interface Clearance | 名字已经开始明显比实际权限高级 |
| 5 | `SPC-CL-5` | Advanced Collaboration Clearance | 听起来快能进机房了，其实不能 |
| 6 | `SPC-CL-6` | PlayGround Flight Clearance | Core 全收集；仍然不会自动获得任何仓库权限 |

## Callsign

Credential v2 会根据 GitHub Login 的 SHA-256 摘要确定性生成一个 Callsign，例如：

```text
Aster-Vector-7C2D
Nebula-Pilot-A91F
```

同一个 GitHub Login 会稳定得到同一个 Callsign。它没有安全意义，也不是随机密钥，只是为了让 Credential 更像 Mission Control 发出来的东西。

## Prestige Flags

Prestige 不计入 Core Clearance，但会显示在验证页：

- `CREATIVE_ROUTE` — 完成 Creative Tuition；
- `DRESS_ROUTE` — 完成 Dress Tuition；
- `AETHRA_PASS_HOLDER` — Aethra Fanwork Pass 已激活。

未来还可以继续塞奇怪东西，但原则是：**先保证判定可解释，再保证名字足够离谱。**

## Aethra Fanwork Pass

Pass 激活条件：

```text
TUITION_PAID_DRESS
```

或集齐全部 6 个 Core Achievements。

只有这一项拥有单独的实际授权效果，详见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。
