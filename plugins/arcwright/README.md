# Arcwright (Claude Code plugin)

> **Get started:** [Sign up free](https://arcwrightai.com/account/signup) for an Arcwright account and API key. Higher limits are on the [paid plans](https://arcwrightai.com/pricing).

Connect [Claude Code](https://code.claude.com) to [Arcwright](https://arcwrightai.com) — an AI coding/build tool that asks before it writes and shows every change as a diff.

## What you get

- **MCP connector** — hosted Arcwright MCP/API (HTTP) authenticated with your API key
- **Skill** — `use-arcwright` teaches Claude when to call Arcwright build tools

## Requirements

- Claude Code (recent; MCP plugin validation needs v2.1.281+)
- An Arcwright API key (set as plugin config `ARCWRIGHT_API_KEY`)

## Install from this marketplace

From a clone of this repository:

```bash
claude plugin marketplace add ./path/to/arcwright-marketplace
claude plugin install arcwright@arcwright-marketplace
```

From GitHub (after you push):

```bash
claude plugin marketplace add suspectmds/arcwright-marketplace
claude plugin install arcwright@arcwright-marketplace
```

Then configure the API key: `/plugin` → Installed → **arcwright** → Configure, or use `/config`.

## MCP configuration

`.mcp.json` points at the hosted endpoint and injects your key:

```json
{
  "mcpServers": {
    "arcwright": {
      "type": "http",
      "url": "https://api.arcwrightai.com/mcp",
      "headers": {
        "Authorization": "Bearer ${user_config.ARCWRIGHT_API_KEY}"
      }
    }
  }
}
```

**TODO:** Replace `https://api.arcwrightai.com/mcp` with the real public MCP/API URL when Arcwright publishes it. The path and auth scheme above are placeholders matching the intended design (Bearer token = `ARCWRIGHT_API_KEY`).

For a local stdio wrapper instead, see `../../mcp-server/`.

## Validate

```bash
claude plugin validate ./plugins/arcwright
claude plugin validate .
```

(Run the second command from the marketplace root.)

## License

MIT — see repository `LICENSE`.
