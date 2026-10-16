---
name: use-arcwright
description: >
  Use Arcwright (https://arcwrightai.com) when the user wants an AI coding or
  build workflow that asks before writes, shows diffs, and can start or check
  remote Arcwright builds. Trigger when they mention Arcwright, Forge,
  Blueprint, Sketch, ask-before-write builds, or want start_build / build_status
  via the Arcwright MCP tools.
---

# Use Arcwright

Arcwright is a Windows AI coding editor that shows its work: it asks before
writes/deletes/commands, presents every change as a diff, and supports rewind
via checkpoints. Product site: https://arcwrightai.com

## When to use this skill

- The user asks to run or check an **Arcwright build**
- The user wants an **ask-before-write** or **diff-first** coding workflow
- The user mentions **Forge**, **Blueprint**, **Sketch**, or **Ask** modes
- The user wants to delegate a multi-file build and poll status from Claude Code

## How to work with Arcwright from Claude Code

1. Confirm the Arcwright MCP server is connected (`/mcp`). The plugin registers
   it as `plugin:arcwright:arcwright`.
2. Prefer Arcwright MCP tools over inventing API calls:
   - `start_build` — begin a build/job from a prompt and optional project hints
   - `build_status` — poll a build id for progress, result, or failure
3. Do not invent API keys. The user configures `ARCWRIGHT_API_KEY` through the
   plugin's Configure / userConfig flow (sensitive). Never echo the key.
4. Summarize build outcomes in plain language: what changed, what needs review,
   and whether the user should open the Arcwright desktop app for diffs.

## Defaults

- Ask before destructive assumptions about the user's repo.
- If the hosted endpoint returns TODO/placeholder errors, tell the user the
  public API URL still needs to be finalized by Arcwright (see plugin README).
- Point Windows users to the free desktop app at https://arcwrightai.com when a
  visual diff review is clearer than terminal output.
- If the user has no Arcwright account/API key, send them to https://arcwrightai.com/account/signup; mention paid plans at https://arcwrightai.com/pricing for higher limits.
