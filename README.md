# Stellaria Git PlayGround

> **Dream. Commit. Push. Become.**

[![Contributors](https://img.shields.io/github/contributors/Stellaria-Studio/Stellaria-Git-PlayGround.svg)](https://github.com/Stellaria-Studio/Stellaria-Git-PlayGround/graphs/contributors)
![GitHub repo size](https://img.shields.io/github/repo-size/Stellaria-Studio/Stellaria-Git-PlayGround.svg)
[![Upstream](https://img.shields.io/badge/upstream-Cute--Dress%2FDress-8A2BE2)](https://github.com/Cute-Dress/Dress)
[![License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Stellaria Git PlayGround** 是 Stellaria Studio 的公开 Git / GitHub 协作练习场，也是 [Cute-Dress/Dress](https://github.com/Cute-Dress/Dress) 的正式 Fork。

这里保留上游项目的完整 Git 历史、历史贡献者与历史照片；Stellaria Studio 不把这些历史内容重新包装成自己的作品。来源与 Fork 关系见 [UPSTREAM.md](UPSTREAM.md)。

项目目标很简单：用一次真实但低风险的贡献，把 **Fork → Clone → Branch → Commit → Push → Pull Request → Review → Merge** 走完整。不会编程也完全可以参加。

与此同时，我们似乎不小心把一个 Git 教程工程化成了 **Mission Control + Credential + Achievement + SVG Badge + 上游同步系统**。（doge）

---

## 🎓 学费：任选一种

你不需要真的给 Stellaria Studio 交钱。这里的“学费”是一个需要通过 Git 提交的贡献物。

### 👗 A. 传统学费 · Dress Tuition

继承上游 Dress 的祖传业务：提交**至少一张你本人、由你有权公开的女装 / Cross-dressing 照片**。

- 性别不限，萌即正义。
- 不接受盗图或未经授权的转载。
- 图片请尽量控制在 1 MiB 以内。
- 提交前移除 GPS、地址、联系方式等高敏感 EXIF。
- 只接受适合公开互联网的普通照片；不要提交裸露、性暗示或私密影像。
- 照片仍按 `A-Z/#/昵称/` 的上游目录规则存放。

这条路线会获得隐藏程度约等于“写在 README 正中央”的成就：**`TUITION_PAID_DRESS 👗`**。

### 🌟 B. Stellaria 创意学费 · Creative Tuition

不想交女装照？完全没问题。提交一份**你自己创作、且有权公开的小作品**也可以完成学费：

- 一张原创插画、表情包或小型视觉作品；
- 一段短文、设定、教程或有意思的 Markdown；
- 小型非执行创意资产（例如 MIDI、JSON、SVG 等）；
- 对本 PlayGround 有实际价值的文档、模板或工具改进；
- 其他维护者认为“确实有点东西”的原创贡献。

创意学费建议放在：

```text
playground/<你的 GitHub ID>/
```

例如：

```text
playground/example/README.md
playground/example/art.webp
```

这条路线获得 **`TUITION_PAID_CREATIVE 🌟`**。

> 女装从来不是加入或学习 Git 的强制条件。两条学费路线都能正常参与；只是其中一条保留了上游传统，以及一个非常离谱的小福利。

详细规则见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 🛰️ Mission Control：你的 Git 行为现在有“飞行记录”了

每个被合并的有效 PR 都可能更新一份 **Stellaria Playground Credential（SPC）**。

机器可读记录：

```text
credentials/<github-login>.json
```

自动生成 SVG Badge：

```text
badges/<github-login>.svg
```

在线验证页：

**https://stellaria-studio.github.io/Stellaria-Git-PlayGround/**

验证页可以输入 GitHub ID、`@GitHub-ID` 或 `SPC-GIT-<GitHub-ID>`，然后显示：

- Credential ID；
- Callsign；
- `SPC-CL-*` Clearance；
- Core Achievement 进度；
- Tuition / Prestige；
- Merge Evidence；
- Aethra Fanwork Pass 状态；
- 可复制的 GitHub Profile SVG Badge。

`VERIFIED` 的意思只是“Stellaria 官方公开仓库存在匹配的 canonical record”，不是现实世界身份认证。

---

## 🏆 Achievements / Clearance

Core Achievements：

| 成就 | 解锁条件 |
| --- | --- |
| `FIRST_CONTACT` | 第一个 PR 被合并 |
| `BRANCH_EXPLORER` | 从非默认分支 / Fork 完成一次合并 |
| `CHECKLIST_KEEPER` | PR 自查清单完整且全部勾选 |
| `REVIEW_PASS` | 至少获得一次 `APPROVED` Review |
| `RETURNING_CONTRIBUTOR` | 至少有 2 个 PR 被合并 |
| `GREEN_LIGHT` | PR Head 上检测到的 Checks 全部成功 / neutral / skipped |

Core 数量自动决定：

```text
SPC-CL-0  Visitor Interface
SPC-CL-1  Commit Initiate
SPC-CL-2  Branch Operator
SPC-CL-3  Merge Navigator
SPC-CL-4  Repository Interface Clearance
SPC-CL-5  Advanced Collaboration Clearance
SPC-CL-6  PlayGround Flight Clearance
```

名字已经开始像可以刷卡进舰桥了，**实际一丁点仓库权限都不会自动增加**。（doge）

另外还有：

- `CONFLICT_SURVIVOR`
- `REBASE_ENJOYER`
- `CI_DESTROYER`
- `CI_REDEEMER`
- `UPSTREAM_NAVIGATOR`
- `MERGE_PILOT`
- `DOCS_ORBITER`
- `EXIF_PURIFIER`
- `BLOB_MINIMALIST`
- `HOTFIX_SURGEON`
- `PATCH_CARTOGRAPHER`

Bonus 成就可通过仓库的 **Achievement Claim** Issue Form 带公开证据申请，由维护者审核后使用专门的 Grant Workflow 写入 Credential。

完整目录见 [ACHIEVEMENTS.md](ACHIEVEMENTS.md)，机制见 [CREDENTIALS.md](CREDENTIALS.md)。

---

## 📟 Callsign

Credential v2 会根据你的 GitHub Login 确定性生成一个 Mission Control Callsign，例如：

```text
Aster-Vector-7C2D
Nebula-Pilot-A91F
```

同一个 GitHub ID 会稳定得到同一个 Callsign。

它不是密钥，也没有任何安全意义。它存在的主要理由是：**如果都做成 Credential 了，不发个呼号总觉得少了点什么。**

---

## 🪪 SVG Badge

Credential 更新后会生成：

```text
https://raw.githubusercontent.com/Stellaria-Studio/Stellaria-Git-PlayGround/master/badges/<github-login>.svg
```

可以贴进 GitHub Profile：

```md
[![Stellaria SPC](https://raw.githubusercontent.com/Stellaria-Studio/Stellaria-Git-PlayGround/master/badges/<github-login>.svg)](https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=SPC-GIT-<github-login>)
```

如果 Aethra Fanwork Pass 激活，Badge 也会把 `AETHRA PASS` 挂上去。

---

## ✨ Aethra Fanwork Pass

Stellaria Studio 决定把这个梗工程化到底。

满足以下任意一项：

1. 获得 **`TUITION_PAID_DRESS 👗`**；或
2. 集齐全部 6 个 Core Git Achievements：`FIRST_CONTACT`、`BRANCH_EXPLORER`、`CHECKLIST_KEEPER`、`REVIEW_PASS`、`RETURNING_CONTRIBUTOR`、`GREEN_LIGHT`；

即可在 Credential 中解锁：

> **AETHRA_FANWORK_PASS · ACTIVE**

它不是“看起来像证书但什么都没有”的纯空气：在 Stellaria Studio 或相关权利人实际拥有 / 控制的权利范围内，Pass 持有人会获得对 **李观澜（Aethra）** 的广泛二次创作许可，包括创作、改编、发布、展示、传播，以及对自己二创作品的合理商业化。

它**不会转让原作著作权或 Stellaria 商标权，也不会把持有人变成官方代表**。完整边界与许可文本见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。

简单说：

> 会 Git 的可以肝满成就；愿意继承 Dress 传统的可以走隐藏捷径。Stellaria Studio 慷慨地发出一张真的稍微有点用的许可证。（doge）

---

## 🔄 自动同步上游

`.github/workflows/upstream_sync.yml` 每周自动检查并把 `Cute-Dress/Dress` 同步到 `upstream-sync` staging branch。

为了避免把公开上游的结构性变化或 Workflow 直接无人值守灌进 Stellaria：

- **只有 `A-Z/` 与 `#/` 传统贡献目录发生变化时允许自动 Merge**；
- README、License、文档、`.github/`、模板、Credential、Pages 等任何结构性路径出现变化，都会留下 PR 等待人工 Review；
- Merge conflict 永远不会被 Bot 自作主张解决，而是开 Issue 通知 Mission Control。

也就是说：照片等祖传内容能比较丝滑地跟着上游走；会影响 Stellaria 自己规则和自动化的东西必须有人看一眼。

详情见 [UPSTREAM.md](UPSTREAM.md)。

---

## 🚀 怎么开始

第一次参加建议先阅读 [GUIDE.md](GUIDE.md)。仓库很大，只想改自己目录的话可以使用 [PARTIAL_CLONE.md](PARTIAL_CLONE.md) 的部分克隆方案。

典型流程：

```bash
# 1. Fork 本仓库
# 2. clone 你的 Fork
git clone <your-fork-url>
cd Stellaria-Git-PlayGround

# 3. 新建分支
git switch -c playground/<your-id>

# 4. 添加学费 / 修改内容
git add .
git commit -m "feat: pay my playground tuition"

# 5. Push 并创建 Pull Request
git push -u origin playground/<your-id>
```

然后等待 CI、Review，以及命运的 `Merge`。

第一次 PR 还会收到来自 **Stellaria PlayGround Mission Control** 的欢迎 Telemetry。

---

## 🔐 隐私与内容安全

照片可能包含拍摄位置、设备信息等 EXIF。请务必阅读 [EXIF.md](EXIF.md) 与 [CONTRIBUTING.md](CONTRIBUTING.md)。

无论提交哪种学费，都不要提交密码、Token、API Key、家庭住址、身份证件、私人联系方式或其他不应永久出现在公开 Git 历史里的信息。

Git 可以回滚代码，互联网不一定帮你回滚隐私。

---

## 🌌 Upstream / 历史内容来源

本项目 Fork 自：**[Cute-Dress/Dress](https://github.com/Cute-Dress/Dress)**。

Fork 时已经存在的照片、文档、提交与贡献记录均来自上游项目及其历史贡献者。Stellaria Studio 保留 Git 历史与 Fork 关系作为 provenance，不主张这些历史照片是 Stellaria Studio 的原创内容。

详情与 Fork point 见 [UPSTREAM.md](UPSTREAM.md)。

---

## 📜 License

仓库继承上游的 **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International（CC BY-NC-SA 4.0）**，原 [`LICENSE`](LICENSE) 保持不变。

`AETHRA-FANWORK-PASS.md` 是针对 Stellaria 自有 / 可授权角色权利的**额外许可**，不会改变上游照片或其他第三方贡献内容的许可证与权利归属。

---

## 🧪 PlayGround 原则

1. **真的学 Git。** 梗可以很浓，流程必须是真的。
2. **奖励可以离谱，权限不能含糊。** Credential 不会偷偷变成成员身份或管理员权限。
3. **可验证优先。** 成就尽量绑定 PR / Commit / Check 等公开证据。
4. **隐私优先。** 公开仓库里不该出现的东西，不要因为“整活”而提交。
5. **上游有来源，Stellaria 有边界。** Fork 历史、第三方内容和额外许可各自说清楚。
6. **名字可以非常高级。** 这一条不需要解释。

---

**Dream. Commit. Push. Become.**
