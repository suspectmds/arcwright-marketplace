# Publishing Arcwright to Claude Code & Cursor marketplaces

This guide is **step-by-step for the owner**. Nothing in this repository has been submitted or published for you. Replace every `YOUR_ORG` / `YOUR_GITHUB_USERNAME` placeholder before going live.

**Do not commit secrets.** Use `ARCWRIGHT_API_KEY` only via env vars, Claude plugin Configure, or Cursor Plugins → Configure.

---

## 0. Before anything else

1. Create a GitHub account/org that will own the public repo.
2. Decide the public API URL for Arcwright MCP (today’s placeholder is `https://api.arcwrightai.com/mcp`). Update:
   - `plugins/arcwright/.mcp.json`
   - `cursor-plugin/mcp.json`
   - `mcp-server/src/index.js` (`ARCWRIGHT_API_BASE` + `/v1/builds` paths — marked **TODO**)
3. Obtain or create a real API-key product surface so users can mint `ARCWRIGHT_API_KEY` (the marketing site currently emphasizes sign-in without pasting a key — you may need to ship key issuance first).
4. Paid [claude.ai](https://claude.com) plan (Pro/Max/Team/Enterprise) if you will submit to Anthropic’s directory.
5. Cursor account for [marketplace publish](https://cursor.com/marketplace/publish) and [cursor.directory](https://cursor.directory/plugins/new).
6. npm account if you will publish `@arcwright/mcp-server`.

---

## 1. Push this package to GitHub

Docs: [Create a marketplace (Claude Code)](https://code.claude.com/docs/en/plugins/create-marketplace), [Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace)

1. Create a **public** repository (example name: `arcwright-marketplace`).
2. From this folder:

```bash
git init
git add .
git commit -m "Add Arcwright Claude Code and Cursor marketplace package"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/arcwright-marketplace.git
git push -u origin main
```

3. Edit manifests to replace `YOUR_ORG` / `YOUR_GITHUB_USERNAME` in:
   - `plugins/arcwright/.claude-plugin/plugin.json` (`repository`)
   - `cursor-plugin/.cursor-plugin/plugin.json` (`repository`)
   - `mcp-server/package.json` (`mcpName`, `repository`)
   - `mcp-server/server.json` (`name`, `repository.url`)
4. Commit and push those edits.

---

## 2. Add the marketplace in Claude Code (team / self-serve)

Docs: [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace), [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)

**Validate locally first:**

```bash
claude plugin validate ./plugins/arcwright
claude plugin validate .
```

Expect: `✔ Validation passed` (warnings about placeholders are OK if documented).

**Local marketplace:**

```bash
claude plugin marketplace add .
claude plugin install arcwright@arcwright-marketplace
```

**From GitHub (after push):**

```bash
claude plugin marketplace add YOUR_ORG/arcwright-marketplace
claude plugin install arcwright@arcwright-marketplace
```

Or inside a Claude Code session:

```text
/plugin marketplace add YOUR_ORG/arcwright-marketplace
/plugin install arcwright@arcwright-marketplace
```

Then Configure → set **Arcwright API key** (`ARCWRIGHT_API_KEY`). Confirm with `/mcp`.

Share with users: the same `marketplace add` + `install` commands.

---

## 3. Submit to Anthropic’s official plugin / connector directory

Docs:

- [Publish to the directory](https://claude.com/docs/directory/publish)
- [Submit your plugin](https://claude.com/docs/plugins/submit)
- Developer portal: [claude.ai/directory/manage](https://claude.ai/directory/manage)

Anthropic’s directory is **not** the same as adding your own marketplace with `/plugin marketplace add`. Directory listings are reviewed.

### 3a. MCP connector (hosted server)

If you operate the remote MCP at your HTTPS URL:

1. Open [claude.ai/directory/manage](https://claude.ai/directory/manage) → **Submit new**.
2. Choose **MCP connector**.
3. Enter the server URL (same URL as in `plugins/arcwright/.mcp.json`).
4. Complete auth/config per the connector checklist (OAuth or whatever you ship — Bearer API key must match what the portal expects).
5. Submit for review. Default listing label is often **Community**; Anthropic may escalate to Verified.

### 3b. Plugin bundle

1. Ensure the Claude plugin lives in the public GitHub repo (`plugins/arcwright/` with `.claude-plugin/plugin.json`).
2. Portal → **Submit new** → **Plugin bundle**.
3. Paste the GitHub repo URL; set **Plugin path** to `plugins/arcwright` if the plugin is not at the repo root.
4. Pick branch/tag to track (usually `main`).
5. Confirm listing details pulled from `plugin.json` + README.
6. Submit for review.

**Recommended:** submit **both** the connector and the plugin bundle from the **same** claude.ai organization, then pair them so users see one tool set.

Requirements reminder: paid Claude plan; Team/Enterprise needs Owner (or Directory permission). Free accounts cannot submit.

---

## 4. Submit to the Cursor Marketplace (official)

Docs:

- [Plugins](https://cursor.com/docs/plugins)
- [Plugins reference](https://cursor.com/docs/reference/plugins)
- Publish form: [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish)

1. Test locally: copy `cursor-plugin/` to `~/.cursor/plugins/local/arcwright`, reload Cursor, set `ARCWRIGHT_API_KEY` under Plugins → Configure, confirm MCP + skill/rule load.
2. Ensure the GitHub repo is public and includes either:
   - this repo’s `.cursor-plugin/marketplace.json` + `cursor-plugin/`, or
   - a dedicated repo whose root is the Cursor plugin (with `.cursor-plugin/plugin.json`).
3. Open [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).
4. Submit the repository URL.
5. Wait for **manual review** (Cursor emails; there may be no public status page).

Checklist (from Cursor docs):

- Valid `.cursor-plugin/plugin.json` (or root Agent Plugin `plugin.json`)
- Unique kebab-case `name`
- Clear `description`, README, relative logo path
- Every `${VAR}` in `mcp.json` declared under `variables`
- No `..` or absolute paths in manifests
- Multi-plugin repos have `.cursor-plugin/marketplace.json` at repo root

---

## 5. List on the official MCP Registry

Docs:

- [Quickstart: Publish an MCP Server](https://modelcontextprotocol.io/registry/quickstart)
- [Authentication](https://modelcontextprotocol.io/registry/authentication)
- Registry: `https://registry.modelcontextprotocol.io`

1. Update `mcp-server/package.json`:
   - `name` (npm scope you own)
   - `mcpName` (must match `server.json` `name`, e.g. `io.github.YOUR_GITHUB_USERNAME/arcwright`)
2. Update `mcp-server/server.json` the same way.
3. Publish the package to npm (registry hosts **metadata only**):

```bash
cd mcp-server
npm install
npm publish --access public
```

4. Install publisher CLI ([releases](https://github.com/modelcontextprotocol/registry/releases) or `brew install mcp-publisher`).
5. Authenticate (GitHub namespace → name must be `io.github.USERNAME/...`):

```bash
mcp-publisher login github
mcp-publisher publish ./server.json
```

6. Verify:

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.YOUR_GITHUB_USERNAME/arcwright"
```

Optional later: domain auth for `com.arcwrightai/arcwright` via DNS/HTTP verification on arcwrightai.com.

---

## 6. List on cursor.directory (community)

Sites:

- Submit: [cursor.directory/plugins/new](https://cursor.directory/plugins/new)
- Also referenced: [cursor.directory/mcp/new](https://cursor.directory/mcp/new)

This is **separate** from the official Cursor Marketplace. Community listing does not auto-list on cursor.com/marketplace.

1. Keep root `.mcp.json` (and/or Cursor plugin files) on the public default branch.
2. Sign in with GitHub or Google at [cursor.directory/plugins/new](https://cursor.directory/plugins/new).
3. Paste `https://github.com/YOUR_ORG/arcwright-marketplace`.
4. Use **Scan repo** / auto-detect (looks for `.mcp.json`, `mcp.json`, skills, rules, etc.).
5. Publish. A security scan typically marks `safe` / `suspicious` / `malicious` before the listing appears.

---

## 7. Validation you should run (owner machine)

```bash
# Offline structural checks (no network)
node scripts/validate-package.mjs

# Claude Code official validator
claude plugin validate .
claude plugin validate ./plugins/arcwright

# MCP package offline tests
cd mcp-server && npm install && npm test
```

Do **not** point validators or demos at production with real keys in the repo.

---

## Owner checklist (manual only)

| Done in this repo | You must do manually |
|-------------------|----------------------|
| Claude marketplace + `arcwright` plugin layout | Create GitHub repo & push |
| Cursor plugin + marketplace manifest | Create/replace real API URL & key product |
| stdio MCP server + `server.json` | npm account + `npm publish` |
| `PUBLISHING.md` / README | Claude paid plan + [directory/manage](https://claude.ai/directory/manage) forms |
| Offline validate script | Cursor [marketplace/publish](https://cursor.com/marketplace/publish) form |
| Placeholder TODOs marked | MCP Registry `mcp-publisher login` + publish |
| No secrets committed | cursor.directory submit form |
| | Answer Anthropic/Cursor review emails |

---

## Official links (bookmark)

| Resource | URL |
|----------|-----|
| Claude Code create marketplace | https://code.claude.com/docs/en/plugins/create-marketplace |
| Claude Code marketplace reference | https://code.claude.com/docs/en/plugins/marketplace-reference |
| Claude Code plugin manifest | https://code.claude.com/docs/en/plugins/manifest-reference |
| Claude Code plugin components (`.mcp.json`, skills) | https://code.claude.com/docs/en/plugins/components |
| Anthropic directory publish | https://claude.com/docs/directory/publish |
| Anthropic directory portal | https://claude.ai/directory/manage |
| Cursor plugins | https://cursor.com/docs/plugins |
| Cursor plugins reference | https://cursor.com/docs/reference/plugins |
| Cursor Marketplace publish | https://cursor.com/marketplace/publish |
| MCP Registry quickstart | https://modelcontextprotocol.io/registry/quickstart |
| cursor.directory submit | https://cursor.directory/plugins/new |
| Arcwright product | https://arcwrightai.com |
