# @arcwright/mcp-server

Standalone **stdio** MCP server that wraps Arcwright's public HTTP API with two tools:

| Tool | Purpose |
|------|---------|
| `start_build` | Start a build/job from a prompt |
| `build_status` | Poll a build by id |

## TODO (API placeholders)

Real Arcwright public endpoints were not published at package time. This server assumes:

- `POST {ARCWRIGHT_API_BASE}/v1/builds`
- `GET  {ARCWRIGHT_API_BASE}/v1/builds/{buildId}`
- Auth: `Authorization: Bearer $ARCWRIGHT_API_KEY`

Update `src/index.js` when the real contract is known. Do not point production traffic at inventing endpoints without confirming docs.

## Run locally

```bash
cd mcp-server
npm install
set ARCWRIGHT_API_KEY=your_key_here   # Windows PowerShell: $env:ARCWRIGHT_API_KEY="..."
npm start
```

Claude Code / Cursor stdio example:

```json
{
  "mcpServers": {
    "arcwright": {
      "command": "node",
      "args": ["F:/Projects/arcwright-marketplace/mcp-server/src/index.js"],
      "env": {
        "ARCWRIGHT_API_KEY": "your_key_here"
      }
    }
  }
}
```

Prefer env injection from the host UI — never hardcode keys in committed files.

## Tests (offline)

```bash
cd mcp-server
npm install
npm test
```

These tests only validate package JSON/skill shape. They do **not** call live servers.

## Publish (manual — owner)

See root `PUBLISHING.md` for npm + MCP Registry steps. Replace `YOUR_GITHUB_USERNAME` / `YOUR_ORG` in `package.json` and `server.json` first.
