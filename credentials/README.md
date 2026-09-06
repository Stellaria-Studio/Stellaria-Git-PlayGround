# credentials/

这个目录由 **Stellaria Playground Credentials** workflow 维护。

每位获得过有效合并 PR 的贡献者会拥有一个机器可读记录：

```text
credentials/<github-login>.json
```

请不要手动修改别人的 Credential；正常情况下它们应由 `.github/workflows/stellaria_credentials.yml` 在 PR 合并后自动更新。

规则说明见 [CREDENTIALS.md](../CREDENTIALS.md)。
