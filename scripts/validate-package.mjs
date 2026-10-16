#!/usr/bin/env node
/**
 * Offline structural validation for this distribution package.
 * Does not call live APIs, GitHub, or marketplace submission endpoints.
 *
 * Usage (from repo root):
 *   node scripts/validate-package.mjs
 *
 * Also recommended after installing Claude Code CLI:
 *   claude plugin validate .
 *   claude plugin validate ./plugins/arcwright
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function ok(msg) {
  console.log(`✔ ${msg}`);
}

function fail(msg) {
  console.error(`✘ ${msg}`);
  failed += 1;
}

function readJson(rel) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    fail(`Missing file: ${rel}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`Invalid JSON: ${rel} (${e.message})`);
    return null;
  }
}

function mustExist(rel) {
  if (existsSync(join(root, rel))) ok(`exists ${rel}`);
  else fail(`missing ${rel}`);
}

const marketplace = readJson(".claude-plugin/marketplace.json");
if (marketplace) {
  if (marketplace.name && marketplace.owner?.name && Array.isArray(marketplace.plugins)) {
    ok("Claude marketplace.json required fields");
  } else fail("Claude marketplace.json missing name/owner/plugins");
  const entry = marketplace.plugins?.[0];
  if (entry?.name === "arcwright" && entry?.source === "./plugins/arcwright") {
    ok("Claude marketplace lists arcwright at ./plugins/arcwright");
  } else fail("Claude marketplace plugin entry incorrect");
  if (String(entry?.source || "").includes("..")) {
    fail('Claude plugin source must not contain ".."');
  }
}

const plugin = readJson("plugins/arcwright/.claude-plugin/plugin.json");
if (plugin) {
  if (plugin.name === "arcwright") ok("Claude plugin.json name is arcwright");
  else fail("Claude plugin.json name must be arcwright");
  if (plugin.userConfig?.ARCWRIGHT_API_KEY?.sensitive) {
    ok("Claude userConfig.ARCWRIGHT_API_KEY is sensitive");
  } else fail("Claude userConfig.ARCWRIGHT_API_KEY missing or not sensitive");
}

const claudeMcp = readJson("plugins/arcwright/.mcp.json");
if (claudeMcp?.mcpServers?.arcwright) {
  const s = claudeMcp.mcpServers.arcwright;
  if (s.type === "http" && String(s.url).startsWith("https://")) {
    ok("Claude .mcp.json http URL");
  } else fail("Claude .mcp.json must be type http with https URL");
  if (s.headers?.Authorization?.includes("${user_config.ARCWRIGHT_API_KEY}")) {
    ok("Claude .mcp.json uses ${user_config.ARCWRIGHT_API_KEY}");
  } else fail("Claude .mcp.json Authorization must reference user_config.ARCWRIGHT_API_KEY");
}

const cursorMarket = readJson(".cursor-plugin/marketplace.json");
if (cursorMarket?.plugins?.[0]?.source === "cursor-plugin") {
  ok("Cursor marketplace points at cursor-plugin");
} else fail("Cursor marketplace.json plugin source incorrect");

const cursorPlugin = readJson("cursor-plugin/.cursor-plugin/plugin.json");
if (cursorPlugin?.variables?.properties?.ARCWRIGHT_API_KEY) {
  ok("Cursor plugin declares ARCWRIGHT_API_KEY variable");
} else fail("Cursor plugin variables.ARCWRIGHT_API_KEY missing");

const cursorMcp = readJson("cursor-plugin/mcp.json");
if (cursorMcp?.mcpServers?.arcwright?.headers?.Authorization?.includes("${ARCWRIGHT_API_KEY}")) {
  ok("Cursor mcp.json uses ${ARCWRIGHT_API_KEY}");
} else fail("Cursor mcp.json must use ${ARCWRIGHT_API_KEY}");

mustExist("plugins/arcwright/skills/use-arcwright/SKILL.md");
mustExist("cursor-plugin/skills/use-arcwright/SKILL.md");
mustExist("cursor-plugin/rules/arcwright.mdc");
mustExist("mcp-server/src/index.js");
mustExist("mcp-server/server.json");
mustExist("PUBLISHING.md");
mustExist("README.md");

const serverJson = readJson("mcp-server/server.json");
if (serverJson?.packages?.[0]?.transport?.type === "stdio") {
  ok("mcp-server/server.json stdio transport");
} else fail("mcp-server/server.json transport missing");

console.log("");
if (failed) {
  console.error(`Validation failed with ${failed} issue(s).`);
  process.exit(1);
}
console.log("Validation passed (offline structural checks).");
console.log("Next (manual): claude plugin validate . && cd mcp-server && npm test");
