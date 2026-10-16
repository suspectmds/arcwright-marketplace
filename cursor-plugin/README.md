# Arcwright (Cursor plugin)

> **Get started:** [Sign up free](https://arcwrightai.com/account/signup) for an Arcwright account and API key. Higher limits are on the [paid plans](https://arcwrightai.com/pricing).

Connect [Cursor](https://cursor.com) to [Arcwright](https://arcwrightai.com).

## Contents

| Path | Purpose |
|------|---------|
| `.cursor-plugin/plugin.json` | Cursor Plugin manifest + `ARCWRIGHT_API_KEY` variable schema |
| `mcp.json` | Hosted MCP/API config (`${ARCWRIGHT_API_KEY}` placeholder) |
| `skills/use-arcwright/` | Skill: when to use Arcwright |
| `rules/arcwright.mdc` | Optional rule for Arcwright-oriented sessions |
| `assets/logo.svg` | Marketplace logo |

## Configure

1. Install the plugin (local test or Marketplace — see root `PUBLISHING.md`).
2. In Cursor: **Plugins → Configure** and set **Arcwright API key** (`ARCWRIGHT_API_KEY`).
3. Do not commit secrets. Only `${ARCWRIGHT_API_KEY}` placeholders live in `mcp.json`.

## MCP config

```json
{
  "mcpServers": {
    "arcwright": {
      "url": "https://api.arcwrightai.com/mcp",
      "headers": {
        "Authorization": "Bearer ${ARCWRIGHT_API_KEY}"
      }
    }
  }
}
```

**TODO:** Replace `https://api.arcwrightai.com/mcp` with the real public MCP URL when available.

### Local stdio alternative

To use the Node wrapper in this repo instead of the hosted URL, temporarily point `mcp.json` at:

```json
{
  "mcpServers": {
    "arcwright": {
      "command": "node",
      "args": ["${CURSOR_PLUGIN_ROOT}/../mcp-server/src/index.js"],
      "env": {
        "ARCWRIGHT_API_KEY": "${ARCWRIGHT_API_KEY}"
      }
    }
  }
}
```

Prefer `npx -y @YOUR_SCOPE/arcwright-mcp` after you publish the npm package (see `mcp-server/`).

## Local test (Cursor)

Per [Cursor plugins docs](https://cursor.com/docs/plugins):

1. Copy this `cursor-plugin/` folder to `~/.cursor/plugins/local/arcwright`
2. Restart Cursor / reload plugins
3. Set `ARCWRIGHT_API_KEY` under Plugins → Configure
4. Confirm MCP tools appear

## License

MIT — see repository `LICENSE`.
