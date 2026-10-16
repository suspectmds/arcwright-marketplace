#!/usr/bin/env node
/**
 * Arcwright MCP server (stdio)
 *
 * Wraps Arcwright's public HTTP API with a small set of MCP tools.
 * Endpoints below are PLACEHOLDERS — replace when the real API is published.
 *
 * Env:
 *   ARCWRIGHT_API_KEY   (required) Bearer token / API key
 *   ARCWRIGHT_API_BASE  (optional) Default https://api.arcwrightai.com
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = (
  process.env.ARCWRIGHT_API_BASE || "https://api.arcwrightai.com"
).replace(/\/$/, "");

const API_KEY = process.env.ARCWRIGHT_API_KEY || "";

/** @param {string} method @param {string} path @param {unknown} [body] */
async function arcwrightFetch(method, path, body) {
  if (!API_KEY) {
    return {
      ok: false,
      status: 401,
      error:
        "Missing ARCWRIGHT_API_KEY. Set the environment variable before starting this MCP server.",
    };
  }

  // TODO: Confirm real paths with Arcwright API docs when published.
  // Assumed placeholders (NOT live contracts):
  //   POST {API_BASE}/v1/builds
  //   GET  {API_BASE}/v1/builds/{buildId}
  const url = `${API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      // Surface the placeholder nature when the host returns 404/HTML
      note:
        res.status === 404
          ? "TODO: Endpoint may be a placeholder. Update ARCWRIGHT_API_BASE and paths in mcp-server/src/index.js when the public API is finalized."
          : undefined,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function toolText(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
    isError: payload.ok === false,
  };
}

const server = new Server(
  {
    name: "arcwright",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "start_build",
      description:
        "Start an Arcwright build/job from a natural-language prompt. Returns a build id to poll with build_status.",
      inputSchema: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "What to build or change",
          },
          project_path: {
            type: "string",
            description: "Optional local project path hint for the build context",
          },
          mode: {
            type: "string",
            description:
              "Optional Arcwright mode hint: ask | forge | blueprint | sketch",
            enum: ["ask", "forge", "blueprint", "sketch"],
          },
        },
        required: ["prompt"],
      },
    },
    {
      name: "build_status",
      description:
        "Get status for an Arcwright build previously started with start_build.",
      inputSchema: {
        type: "object",
        properties: {
          build_id: {
            type: "string",
            description: "Build identifier returned by start_build",
          },
        },
        required: ["build_id"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args = request.params.arguments ?? {};

  if (name === "start_build") {
    const prompt = String(args.prompt ?? "").trim();
    if (!prompt) {
      return toolText({ ok: false, error: "prompt is required" });
    }

    // TODO: Align body fields with the real Arcwright public API schema.
    const result = await arcwrightFetch("POST", "/v1/builds", {
      prompt,
      project_path: args.project_path ?? undefined,
      mode: args.mode ?? "forge",
    });
    return toolText(result);
  }

  if (name === "build_status") {
    const buildId = String(args.build_id ?? "").trim();
    if (!buildId) {
      return toolText({ ok: false, error: "build_id is required" });
    }

    // TODO: Confirm path `/v1/builds/{id}` against real docs.
    const result = await arcwrightFetch(
      "GET",
      `/v1/builds/${encodeURIComponent(buildId)}`
    );
    return toolText(result);
  }

  return toolText({ ok: false, error: `Unknown tool: ${name}` });
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("arcwright-mcp failed:", err);
  process.exit(1);
});
