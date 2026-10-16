# Arcwright marketplace distribution

> **Get started:** [Sign up free](https://arcwrightai.com/account/signup) for an Arcwright account and API key. Higher limits are on the [paid plans](https://arcwrightai.com/pricing).

Ready-to-publish packages so [Arcwright](https://arcwrightai.com) can ship on **Claude Code** marketplaces and the **Cursor** plugin ecosystem, plus a small **stdio MCP server**.

Nothing here has been submitted to any store. No secrets are included. API URLs and paths are **TODO placeholders** until Arcwright publishes a public MCP/API contract.

## What’s in this folder

| Path | What it is |
|------|------------|
| `.claude-plugin/marketplace.json` | Claude Code marketplace catalog |
| `plugins/arcwright/` | Claude Code plugin (`plugin.json`, `.mcp.json`, skill) |
| `.cursor-plugin/marketplace.json` | Cursor multi-plugin marketplace catalog |
| `cursor-plugin/` | Cursor plugin (manifest, `mcp.json`, skill, rule) |
| `mcp-server/` | Node stdio MCP server (`start_build`, `build_status`) |
| `PUBLISHING.md` | Exact submit steps + official links |
| `scripts/validate-package.mjs` | Offline structural checks |

## How to run (local)

### 1. Offline validation (no network, no secrets)

Requires Node 18+:

```bash
node scripts/validate-package.mjs
```

### 2. Claude Code plugin

Requires [Claude Code CLI](https://code.claude.com):

```bash
claude plugin validate ./plugins/arcwright
claude plugin validate .
claude plugin marketplace add .
claude plugin install arcwright@arcwright-marketplace
```

Set **Arcwright API key** via `/plugin` → Configure (maps to `ARCWRIGHT_API_KEY`). Check `/mcp`.

### 3. Cursor plugin

Copy `cursor-plugin/` to `~/.cursor/plugins/local/arcwright`, reload Cursor, set `ARCWRIGHT_API_KEY` under **Plugins → Configure**.

### 4. Standalone MCP server (stdio)

```bash
cd mcp-server
npm install
# Windows PowerShell:
$env:ARCWRIGHT_API_KEY="your_key_here"
npm start
# then: npm test
```

Hosted MCP URL used by the Claude/Cursor plugins:

`https://api.arcwrightai.com/mcp` — **TODO: replace with the real public endpoint.**

## Publish

Follow **[PUBLISHING.md](./PUBLISHING.md)** for GitHub, Claude Code marketplace add, Anthropic directory, Cursor Marketplace, MCP Registry, and cursor.directory. All of those steps need your accounts and form submissions.

## License

MIT — see [LICENSE](./LICENSE).
