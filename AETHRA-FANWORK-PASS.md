# Aethra Fanwork Pass

**Version 1.1 · Stellaria Git PlayGround**

> 这是一份针对符合资格的 PlayGround 贡献者提供的额外二次创作许可，不是著作权转让、商标授权书、雇佣关系证明或 Stellaria Studio 成员证明。

## 1. 谁可以获得

当 Stellaria 官方 canonical Credential 满足以下任意一项时，`AETHRA_FANWORK_PASS` 可以标记为 `ACTIVE`：

1. 已获得经过维护者人工核验的 `TUITION_PAID_DRESS`；或
2. 已集齐全部 Core Git Achievements：
   - `FIRST_CONTACT`
   - `BRANCH_EXPLORER`
   - `CHECKLIST_KEEPER`
   - `REVIEW_PASS`
   - `RETURNING_CONTRIBUTOR`
   - `GREEN_LIGHT`

### Dress Tuition 的核验门

仅在 PR Body 写：

```text
<!-- tuition: dress -->
```

**不构成授权资格。**

Dress route 必须包含实际图片贡献，并由具备仓库写权限的维护者实际查看后运行 **Verify Playground Tuition** Workflow，写入：

```text
tuition:verified:dress
```

随后 PR 被 Merge，Credential Reconciler 才会把 `TUITION_PAID_DRESS` 与 Pass 写入 canonical record。

### Core route 的核验门

`REVIEW_PASS` 必须来自与 PR 作者不同的 GitHub 用户所提交的 `APPROVED` Review，因此 PR 作者不能靠自己给自己的 PR 点一下就凭空凑齐全套 Core。

## 2. 授权对象

本 Pass 针对 Stellaria Studio 创作体系中的角色 **李观澜（Aethra）**。

本授权仅在 **Stellaria Studio 或相关权利人确实拥有、控制并有权授权的知识产权范围内**生效。如果某项素材、音乐、字体、演员 / 配音者声音、第三方角色、商标、合作方资产或其他元素的权利属于第三方，本 Pass 不会 magically 获得那些第三方的权利。

## 3. 获得的二创权限

在上述权利范围内，持有 `ACTIVE · VERIFIED` Pass 的贡献者获得一项**非独占、全球范围、免版税**的二次创作许可，可无需逐次向 Stellaria Studio 申请，包括：

- 绘制插画、漫画、表情包、壁纸及视觉作品；
- 创作小说、短篇、同人设定、翻译或改写；
- 创建 2D / 3D 模型、动画、视频、PV、MMD / 动捕内容及游戏 Mod；
- 创作与角色有关的音乐、音频、互动内容或其他媒介作品；
- 对本人创作的上述作品进行修改、重制、混剪、再编辑；
- 在网站、社交媒体、视频平台、线下活动等场景公开展示、发布与传播；
- 对**本人原创的二创作品**进行合理商业化，包括平台创作收益、委托、印刷品、数字作品与小规模周边销售。

换句话说：这张 Pass 不是空气 Badge。你确实可以拿它去做 Aethra 二创，而不必每次都来问一句“这个能不能发”。

## 4. 没有一起送出去的东西

本 Pass **不包含**：

- 李观澜（Aethra）原始角色著作权、商标权或其他底层权利的所有权转让；
- Stellaria Studio 名称、Logo、商标或官方视觉识别的独立商业授权；
- 将自己包装成 Stellaria Studio 官方账号、官方作品、官方员工或官方合作方的权利；
- 把 Aethra 的底层角色权利再次授权、出售或独占许可给无关第三方的权利；
- 注册与 Aethra / Stellaria 容易混淆的商标、公司名、域名或账号并据为己有的权利；
- 大型品牌联名、影视 / 游戏独占授权、角色品牌整体商业运营等应单独协商的商业权利；
- 任何第三方素材、第三方 IP、真人肖像 / 声音或其他不属于 Stellaria 可授权范围的权利。

## 5. 署名与官方关系

建议在公开作品中使用类似说明：

> Fanwork based on 李观澜（Aethra） / Stellaria Studio. Unofficial derivative work.

不强制使用固定格式，但不得故意制造“官方出品”“官方认证作品”“Stellaria Studio 委托制作”等不存在的关系。

## 6. 合理边界

本 Pass 不是规避法律、平台规则或第三方权利的工具。作品仍需遵守适用法律及发布平台规则，不得侵犯他人合法权利。

如果二创涉及第三方素材、现实人物、合作角色或其他外部 IP，你仍需自行获得相应授权。

## 7. 如何验证 Pass

每个 ACTIVE Pass 会在 canonical Credential 中包含：

```text
Authorization ID: AETHRA-<github-user-id>-<checksum>
```

以及 Credential schema v4 的：

```text
SPC-CANONICAL-SHA256-V1
```

Security Seal。

官方在线验证地址：

```text
https://stellaria-studio.github.io/Stellaria-Git-PlayGround/
```

### 有效验证应同时满足

1. Credential 存在于 `Stellaria-Studio/Stellaria-Git-PlayGround` canonical registry；
2. `aethra_fanwork_pass.active == true`；
3. 存在 `authorization_id`；
4. Record Proof、Registry Proof 与浏览器重新计算的 SHA-256 一致；
5. stable GitHub subject 匹配；
6. Mission Control 显示 `ACTIVE · VERIFIED`。

**截图本身不构成验证。** 截图可以被编辑，Fork 也可以被任意修改。发生争议时，以官方 canonical verifier 的实时结果与仓库记录为准。

详细安全模型见 [SECURITY-MODEL.md](SECURITY-MODEL.md)。

## 8. 持续性与版本更新

- Pass 的资格以 Stellaria 官方 canonical Credential 的实时状态为准；
- Stellaria Studio 可以对未来版本的规则进行澄清或更新；
- 对于在当时有效 Pass 与当时规则下已经合法公开的二创作品，后续规则调整原则上不要求追溯下架；法律要求、第三方权利争议或明显滥用情形除外。

## 9. 与仓库 LICENSE 的关系

本仓库从 Cute-Dress/Dress 继承的历史内容继续适用仓库 [`LICENSE`](LICENSE) 及其各自权利归属。

**Aethra Fanwork Pass 是一份额外许可，只针对 Stellaria 有权授权的 Aethra 相关角色权利。** 它不会改变上游真人照片、历史贡献或第三方作品的许可证。

---

**Dream. Commit. Push. Become.**

然后拿着一张因为学 Git 或交了经人工核验的女装照得到的许可证去画角色二创。这个因果链仍然非常 GitHub。（doge）
