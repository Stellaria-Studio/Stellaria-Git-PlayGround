# Stellaria PlayGround Achievement Catalog

> **名字可以像航天器执照，权限可以一丁点没有。**

本文件定义 Stellaria Git PlayGround 的游戏化成就、Clearance 与 Prestige。

所有内容默认只属于 **PlayGround**。除 `AETHRA_FANWORK_PASS` 另有明确许可文本外，成就不会授予仓库写权限、Stellaria Studio 成员身份、雇佣关系、职业资格或对外代表权。

## Core Git Achievements

这 6 个成就决定 `SPC-CL-*` Clearance；全部集齐也是 Aethra Fanwork Pass 的技术路线。

| Code | Display name | 判定 |
| --- | --- | --- |
| `FIRST_CONTACT` | First Contact | 第一个 PR 被 Merge |
| `BRANCH_EXPLORER` | Branch Explorer | 从非默认分支 / Fork 分支完成 Merge |
| `CHECKLIST_KEEPER` | Checklist Keeper | PR 至少 3 个自查框且全部勾选 |
| `REVIEW_PASS` | Review Pass | 已合并 PR 获得**其他 GitHub 用户**至少一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | Returning Contributor | 本仓库至少 2 个 PR 被 Merge |
| `GREEN_LIGHT` | Green Light | 某个已合并 PR Head 上可见 Checks 全部 success / neutral / skipped |

## Tuition Achievements

| Code | Display name | 判定 |
| --- | --- | --- |
| `TUITION_PAID_CREATIVE` | Creative Tuition 🌟 | Creative marker + `playground/<GitHub-ID>/` 实际文件 + Merge |
| `TUITION_PAID_DRESS` | Dress Tuition 👗 | Dress marker + 传统图片路径 + **维护者 Tuition Verification label** + Merge |

`TUITION_PAID_DRESS` 是祖传隐藏捷径：它会直接满足 Aethra Fanwork Pass 的解锁条件，所以不能靠自己在 PR Body 里写一行 marker 糊弄过去。

Dress Tuition 的人工核验使用：

```text
Verify Playground Tuition
```

Workflow。维护者实际查看贡献后，Workflow 写入：

```text
tuition:verified:dress
```

Reconciler 只认这个 GitHub evidence。

## Bonus / Claimable Achievements

| Code | Display name | 建议证据 |
| --- | --- | --- |
| `CONFLICT_SURVIVOR` | Conflict Survivor | 真实解决 merge / rebase conflict 的 PR 或 commit |
| `REBASE_ENJOYER` | Certified Rebase Enjoyer | 完成一次可解释的 rebase |
| `CI_DESTROYER` | CI Destroyer | 自己的提交让 CI 红过 |
| `CI_REDEEMER` | CI Redeemer | 把自己弄红的 CI 修回绿灯 |
| `UPSTREAM_NAVIGATOR` | Upstream Navigator | 参与一次上游同步 / 冲突处理 |
| `MERGE_PILOT` | Merge Pilot | 有证据地完成一次 Merge 操作 |
| `DOCS_ORBITER` | Documentation Orbiter | 对 PlayGround 文档有有效贡献 |
| `EXIF_PURIFIER` | EXIF Purifier | 发现并正确清理高敏感 EXIF |
| `BLOB_MINIMALIST` | Blob Minimalist | 使用 partial clone / sparse workflow 完成大仓库贡献 |
| `HOTFIX_SURGEON` | Hotfix Surgeon | 用最小改动修复一次真实问题 |
| `PATCH_CARTOGRAPHER` | Patch Cartographer | 把混乱改动拆成清晰可 Review 的 patch / PR |
| `NO_SECRET_INCIDENT` | No Secret Incident | 没把 Token 提交进公开历史；默认不发，因为这本来就应该做到 |

Bonus 由维护者根据公开 Evidence 使用 `Grant Playground Achievement` Workflow 授予。普通 PR 直接修改 `credentials/*.json` 会被 Canonical Guard 拦截。

## Clearance Levels

| Level | Code | Title | 实际效果 |
| ---: | --- | --- | --- |
| 0 | `SPC-CL-0` | Visitor Interface | 看起来像游客卡，确实也是游客卡 |
| 1 | `SPC-CL-1` | Commit Initiate | 至少真的 Merge 过一次 |
| 2 | `SPC-CL-2` | Branch Operator | 开始像会 Git 的样子了 |
| 3 | `SPC-CL-3` | Merge Navigator | 证书含金量约等于“没有完全迷路” |
| 4 | `SPC-CL-4` | Repository Interface Clearance | 名字明显开始比实际权限高级 |
| 5 | `SPC-CL-5` | Advanced Collaboration Clearance | 听起来快能进机房了，其实不能 |
| 6 | `SPC-CL-6` | PlayGround Flight Clearance | Core 全收集；仍然不会自动获得任何仓库权限 |

## Callsign

Callsign 根据 GitHub Login 的 SHA-256 摘要确定性生成，例如：

```text
Aster-Vector-7C2D
Nebula-Pilot-A91F
```

它不是密钥，不参与安全认证。真正的完整性检查使用 Credential schema v4 的 canonical proof。

## Prestige Flags

- `CREATIVE_ROUTE` — 完成 Creative Tuition；
- `DRESS_ROUTE` — 完成经过核验的 Dress Tuition；
- `AETHRA_PASS_HOLDER` — Aethra Fanwork Pass 已激活；
- `BONUS_HUNTER` / `ACHIEVEMENT_GREMLIN` — Bonus 收集类 Prestige。

## Dynamic rarity

Mission Control 的成就图鉴会根据当前 canonical Registry 统计每个成就的持有人比例，并显示 Common / Uncommon / Rare / Legendary。

这只是动态稀有度，不代表技能难度。仓库只有一个人时，“100% 持有”也可能只是因为全世界只有一个样本（doge）。

## Aethra Fanwork Pass

Pass 激活条件：

```text
maintainer-verified TUITION_PAID_DRESS
```

或集齐全部 6 个 Core Achievements。

只有这一项拥有单独的实际授权效果，详见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。
