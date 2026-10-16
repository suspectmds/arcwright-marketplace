/**
 * Offline checks that do not call live Arcwright servers.
 * Run: npm test  (from mcp-server/)
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "..");

function readJson(rel) {
  return JSON.parse(readFileSync(join(repoRoot, rel), "utf8"));
}

describe("package manifests", () => {
  it("Claude marketplace.json has required fields", () => {
    const m = readJson(".claude-plugin/marketplace.json");
    assert.equal(typeof m.name, "string");
    assert.ok(m.owner?.name);
    assert.ok(Array.isArray(m.plugins));
    assert.equal(m.plugins[0].name, "arcwright");
    assert.equal(m.plugins[0].source, "./plugins/arcwright");
  });

  it("Claude plugin.json name matches marketplace entry", () => {
    const p = readJson("plugins/arcwright/.claude-plugin/plugin.json");
    assert.equal(p.name, "arcwright");
    assert.ok(p.userConfig?.ARCWRIGHT_API_KEY);
    assert.equal(p.userConfig.ARCWRIGHT_API_KEY.sensitive, true);
  });

  it("Claude .mcp.json uses user_config ARCWRIGHT_API_KEY", () => {
    const mcp = readJson("plugins/arcwright/.mcp.json");
    const srv = mcp.mcpServers.arcwright;
    assert.equal(srv.type, "http");
    assert.ok(String(srv.url).startsWith("https://"));
    assert.match(
      srv.headers.Authorization,
      /\$\{user_config\.ARCWRIGHT_API_KEY\}/
    );
  });

  it("Cursor plugin declares ARCWRIGHT_API_KEY variable", () => {
    const p = readJson("cursor-plugin/.cursor-plugin/plugin.json");
    assert.equal(p.name, "arcwright");
    assert.ok(p.variables?.properties?.ARCWRIGHT_API_KEY);
  });

  it("Cursor mcp.json uses ${ARCWRIGHT_API_KEY}", () => {
    const mcp = readJson("cursor-plugin/mcp.json");
    assert.match(
      mcp.mcpServers.arcwright.headers.Authorization,
      /\$\{ARCWRIGHT_API_KEY\}/
    );
  });

  it("MCP server package.json has mcpName for registry", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    assert.ok(pkg.mcpName);
    assert.ok(pkg.dependencies["@modelcontextprotocol/sdk"]);
  });

  it("server.json schema fields present", () => {
    const s = JSON.parse(readFileSync(join(root, "server.json"), "utf8"));
    assert.ok(s.$schema);
    assert.ok(s.name);
    assert.ok(s.packages?.[0]?.transport?.type === "stdio");
    assert.ok(
      s.packages[0].environmentVariables?.some(
        (e) => e.name === "ARCWRIGHT_API_KEY"
      )
    );
  });
});

describe("skill frontmatter", () => {
  it("Claude skill has description", () => {
    const md = readFileSync(
      join(repoRoot, "plugins/arcwright/skills/use-arcwright/SKILL.md"),
      "utf8"
    );
    assert.match(md, /^---\r?\n[\s\S]*description:/);
  });

  it("Cursor skill has name and description", () => {
    const md = readFileSync(
      join(repoRoot, "cursor-plugin/skills/use-arcwright/SKILL.md"),
      "utf8"
    );
    assert.match(md, /name:\s*use-arcwright/);
    assert.match(md, /description:/);
  });
});
