# Generated SVG Badges

这个目录由 `.github/workflows/stellaria_credentials.yml` 自动维护。

每个拥有 Credential 的 GitHub 用户会得到：

```text
badges/<github-login>.svg
```

Badge 显示当前 `SPC-CL-*` Clearance；如果 `AETHRA_FANWORK_PASS` 已激活，也会显示 `AETHRA PASS`。

推荐嵌入方式：

```md
[![Stellaria SPC](https://raw.githubusercontent.com/Stellaria-Studio/Stellaria-Git-PlayGround/master/badges/<github-login>.svg)](https://stellaria-studio.github.io/Stellaria-Git-PlayGround/?id=SPC-GIT-<github-login>)
```

这些 SVG 是公开、可缓存、可嵌入的展示层；真正的机器可读事实以 `credentials/<github-login>.json` 为准。
