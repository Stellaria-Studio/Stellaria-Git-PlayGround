# Contributing to Stellaria Git PlayGround

> Dream. Commit. Push. Become.

这里的目标不是筛选“会不会 Git 的人”，而是让你真的走完一次 Git / GitHub 协作流程。

本仓库 Fork 自 [Cute-Dress/Dress](https://github.com/Cute-Dress/Dress)，因此保留了原项目的照片目录、贡献习惯和隐私规则；同时新增 Stellaria 的创意学费、Credential 与 Achievement 机制。

## 1. 选择你的学费路线

### 👗 Dress Tuition

提交至少一张**你本人、由你有权公开的女装 / Cross-dressing 照片**。

要求：

- 不接受盗图或未授权转载。
- 萌即正义，性别不限。
- 只接受适合公开互联网的普通照片；不要提交裸露、性暗示或私密影像。
- 请尽量把单张图片压缩到 1 MiB 以下。
- 必须检查并移除 GPS、地址、联系方式等高敏感 EXIF。
- 按上游规则放入 `A-Z/#/昵称/`，例如 `M/moe/photo.webp`。
- 不要为了排序使用 `AAAA.xxx`、`0xxx`、`111xxx` 等故意抢位的目录名。

完成并经维护者合并后，Credential 会记录 `TUITION_PAID_DRESS`。

### 🌟 Creative Tuition

如果不想提交照片，可以提交你自己创作并有权公开的小作品，例如原创插画、表情包、短文、教程、Markdown、SVG、JSON、MIDI、小型非执行创意资产，或对本 Playground 有实际价值的文档 / 模板 / 工具改进。

个人创意内容建议放入：

```text
playground/<GitHub-ID>/
```

要求：

- 必须是你原创，或你明确拥有提交与再许可权的内容。
- 不要提交第三方版权素材的整包复制、盗图、破解内容或来源不明资产。
- 不要提交可执行二进制、恶意代码、凭据、Token、API Key 或个人敏感信息。
- 尽量保持小而清晰；大型工程、视频和超大音频不适合作为这个仓库的“学费”。
- 如果是图片，同样需要清理高敏感 EXIF，并尽量控制在 1 MiB 以下。

完成并经维护者合并后，Credential 会记录 `TUITION_PAID_CREATIVE`。

> 两条路线都可以正常参与 Playground。女装不是强制要求，也不会带来仓库写权限、成员身份或 Code Review 豁免。

## 2. Git / GitHub 流程

推荐流程：

1. Fork `Stellaria-Studio/Stellaria-Git-PlayGround`。
2. Clone 你的 Fork；仓库较大时可参考 [PARTIAL_CLONE.md](PARTIAL_CLONE.md)。
3. 创建独立分支，不要直接在默认分支乱冲。
4. 添加你的内容。
5. `git add` → `git commit` → `git push`。
6. 创建 Pull Request。
7. 使用对应 PR 模板并完整勾选自查项。
8. 等待 CI 与 Review；需要修改时继续 push 到同一分支。
9. PR 被合并后，由 Credential workflow 更新公开记录。

## 3. PR 模板

- 女装照片：使用 **Photo / Dress Tuition** 模板。
- 创意学费：使用 **Creative Tuition** 模板。
- CI / 工作流：使用 CI 模板。
- 纯文档：使用 Docs 模板。
- 其他维护：使用 Others 模板。

不要删除模板顶部的 `pr-type` / `tuition` 隐藏标记；自动检查与 Credential 会用到它们。

维护者合并一个带 `<!-- tuition: dress -->` 或 `<!-- tuition: creative -->` 的 PR，代表维护者已经对该“学费类型”进行了人工确认。请不要用错误标记碰瓷成就（doge）。

## 4. 照片隐私与 EXIF

照片 EXIF 可能储存地理位置、拍摄设备、时间等信息。Push 前请仔细检查。

推荐方式：

### ExifTool

```bash
exiftool -all= -o new_image.jpg image.jpg
```

### GIMP

导出图片时关闭“保存 EXIF 数据”。

### 在线工具

可以使用可信的 EXIF 清理工具，但如果照片本身较敏感，不建议先上传到未知第三方网站。

仓库现有工作流会检查部分高敏感元数据；字段范围见 [EXIF.md](EXIF.md)。自动检查不是隐私保险，请以你自己的检查为准。

## 5. Credential 与 Achievement

PR 合并后，`.github/workflows/stellaria_credentials.yml` 会尝试为贡献者更新：

```text
credentials/<github-login>.json
```

Core Git Achievements：

- `FIRST_CONTACT`
- `BRANCH_EXPLORER`
- `CHECKLIST_KEEPER`
- `REVIEW_PASS`
- `RETURNING_CONTRIBUTOR`
- `GREEN_LIGHT`

Tuition Achievements：

- `TUITION_PAID_CREATIVE`
- `TUITION_PAID_DRESS`

完整规则见 [CREDENTIALS.md](CREDENTIALS.md)。

Credential 是项目内游戏化记录，不代表 Stellaria Studio 的员工 / 成员身份、现实世界专业认证、仓库写权限或对外代表权。

## 6. Aethra Fanwork Pass

满足以下任意一项时，Credential 可标记 `AETHRA_FANWORK_PASS: ACTIVE`：

- `TUITION_PAID_DRESS`；或
- 集齐全部 6 个 Core Git Achievements。

这个 Pass 对 **李观澜（Aethra）** 提供额外的二次创作许可，但只覆盖 Stellaria Studio 或相关权利人实际拥有 / 控制并有权授权的部分。具体许可范围、商业化边界和排除项见 [AETHRA-FANWORK-PASS.md](AETHRA-FANWORK-PASS.md)。

## 7. 内容与仓库许可

仓库历史内容继续遵循原有 [`LICENSE`](LICENSE) 与各贡献者拥有的权利。

你提交内容时，应确保自己有权按本仓库适用的许可条件公开该内容。Aethra Fanwork Pass 是针对 Stellaria 自有 / 可授权角色权利的额外许可，不会给任何人授予上游真人照片、第三方角色、第三方商标或其他贡献者作品的额外权利。

## 8. 最后提醒

- 不要把秘密 commit 进公开 Git 历史。
- 不确定照片是否适合永久公开时，就走 Creative Tuition。
- PR 被要求修改不等于“你失败了”；把 Review 改完本身就是 Git 协作的一部分。
- 如果你亲手把 CI 搞红又亲手救回来，我们原则上认为这比一次全绿更有教学价值（成就系统迟早会记住这件事）。
