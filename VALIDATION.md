# Validation status

## Constraints

This package was built with **no shell commands** (workspace policy). Automated validators that need a terminal were **not executed in the authoring session**.

## What was checked by hand against current docs

Aligned with:

- [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace) — `.claude-plugin/marketplace.json` with `name`, `owner`, `plugins[]` (`name` + `source`)
- [Plugin manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference) — `.claude-plugin/plugin.json`, `userConfig.ARCWRIGHT_API_KEY`, directory listing URL fields
- [Plugin components](https://code.claude.com/docs/en/plugins/components) — `.mcp.json` at plugin root, `skills/*/SKILL.md`
- [Cursor plugins reference](https://cursor.com/docs/reference/plugins) — `.cursor-plugin/plugin.json`, `mcp.json`, `variables`, skills/rules discovery, marketplace.json
- [MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart) — `server.json` + `mcpName` placeholders

## What you should run locally

```bash
node scripts/validate-package.mjs
claude plugin validate .
claude plugin validate ./plugins/arcwright
cd mcp-server && npm install && npm test
```

## Still TODO before production traffic

1. Replace hosted MCP URL placeholders once Arcwright publishes them.
2. Align `mcp-server` `/v1/builds` paths with the real API.
3. Replace `suspectmds` / `suspectmds` strings.
4. Submit forms listed in `PUBLISHING.md` (accounts required).
