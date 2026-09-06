# Stellaria PlayGround Credential Security Model

这套安全设计的目标不是把 GitHub 玩梗 Credential 伪装成国家级 PKI，而是解决一个很现实的问题：**不能让人随便改个 JSON、P 张截图，就把项目内成就或额外授权说成“Stellaria 发的”。**

## 1. Canonical source

唯一 canonical issuer 是：

```text
Stellaria-Studio/Stellaria-Git-PlayGround
```

官方验证页面是：

```text
https://stellaria-studio.github.io/Stellaria-Git-PlayGround/
```

截图、Fork、镜像站、本地 JSON、自己生成的 SVG 都不是独立的授权依据。遇到争议时，应回到官方仓库 / 官方 Mission Control 页面重新验证。

## 2. Stable subject

Credential 使用 GitHub numeric user ID 作为稳定 subject：

```text
subject = github-user:<numeric-id>
```

GitHub Login 改名后，旧 Login 只保留 redirect alias，canonical credential 会迁移到新 Login，不会因为改名获得第二套身份。

## 3. Canonical SHA-256 Seal

Credential schema v4 对与资格有关的稳定字段生成：

```text
SPC-CANONICAL-SHA256-V1
```

每条 canonical record 的 `integrity.proof` 必须同时满足：

1. 浏览器根据公开算法重新计算出的 SHA-256 与 record 一致；
2. `credentials/index.json` 中该 stable subject 的 registry proof 与 record 一致；
3. `canonical_repo` 指向官方仓库；
4. issuer / credential ID / stable subject 结构校验通过。

这不是“秘密签名”——算法和数据都是公开的。它的作用是把 **record 与官方 registry 锚定在同一个 canonical 仓库状态**，快速发现手改、过期镜像、错误复制或伪造记录。

## 4. Generated artifact guard

以下内容由 Mission Control 生成：

```text
credentials/*.json
badges/*.svg
```

普通 Pull Request 直接修改这些 canonical artifacts 会被 `Guard Canonical Mission Control Artifacts` Workflow 判定失败。

正确做法是修改**底层证据**（PR、Review、Check、Tuition Verification、Achievement Grant 等），再让 Reconciler 重建 canonical record。

## 5. Dress Tuition / Aethra Fanwork Pass

Dress Tuition 是涉及真实额外授权效果的敏感捷径，因此 schema v4 不再相信 PR Body 里的：

```text
<!-- tuition: dress -->
```

这一行本身。

要获得 `TUITION_PAID_DRESS`，必须同时满足：

1. PR 使用 Dress Tuition marker；
2. PR 至少包含一张位于传统 `A-Z/#/昵称/` 路径的图片；
3. 有仓库写权限的维护者**实际查看贡献**；
4. 维护者运行 `Verify Playground Tuition` Workflow；
5. Workflow 写入 `tuition:verified:dress` label；
6. PR 被 Merge；
7. Credential Reconciler 再根据 GitHub evidence 写入成就 / Pass。

Automation 不尝试用计算机视觉判断“照片里的人是谁”“穿的算不算女装”，因为这类判断既不可靠也没必要。**人工看图 + GitHub 权限边界**就是这里故意选择的简单信任门。

Aethra Fanwork Pass 的另一条路线——集齐全部 Core Achievements——也必须包含其他人的 `APPROVED` Review，不能由 PR 作者自己给自己凑出 `REVIEW_PASS`。

## 6. Manual bonus achievements

Bonus Achievement 使用维护者专用 `workflow_dispatch` Grant Workflow 写入，并要求公开 GitHub Evidence URL。普通贡献者不能通过改 Credential JSON 自助发奖。

## 7. Authorization ID

ACTIVE 的 Aethra Fanwork Pass 会获得独立：

```text
AETHRA-<github-user-id>-<checksum>
```

Authorization ID 会被包含在 canonical proof 中。验证页面只有在 Record / Registry / Proof 全部一致时，才显示 `ACTIVE · VERIFIED`。

## 8. What this does not prevent

任何截图都可以被图像编辑软件伪造；任何人也可以 Fork 本仓库并修改自己的副本。

因此正确的问题不是：

> “这张截图看起来真不真？”

而是：

> “这个 Credential / Authorization ID 能不能在 Stellaria 官方 canonical verifier 中实时查到，并通过 proof 校验？”

这就是本项目采用 live verifier 而不是发一张 PNG 证书的原因。

## 9. Trust boundary

本安全模型保护的是 **Stellaria Git PlayGround 项目内 Credential / Achievement / Aethra Fanwork Pass 的来源与可验证性**。

它不是现实身份认证系统，不验证身份证件，不代表职业资格、雇佣关系、组织成员身份、仓库写权限或 Stellaria Studio 对外代表权。

---

**Security level：足够防“我自己编一张糊弄过去”，不打算为了女装 Git 教程部署一套国家密码基础设施。（doge）**
