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
- The user wants to start a build and poll status from Cursor

## How to work with Arcwright from Cursor

1. Confirm the Arcwright MCP server is enabled for the workspace.
2. Prefer these tools:
   - `start_build` — begin a build/job from a prompt and optional project hints
   - `build_status` — poll a build id for progress, result, or failure
3. The API key is supplied as plugin variable `ARCWRIGHT_API_KEY` (Plugins → Configure). Never echo it.
4. Summarize outcomes in plain language and remind the user to review diffs before accepting.

## Defaults

- Ask before destructive assumptions about the user's repo.
- If the hosted endpoint returns TODO/placeholder errors, tell the user the
  public API URL still needs to be finalized (see plugin README).
- Point Windows users to https://arcwrightai.com for the desktop app when visual
  diff review is clearer than chat-only output.
- If the user has no Arcwright account/API key, send them to https://arcwrightai.com/account/signup; mention paid plans at https://arcwrightai.com/pricing for higher limits.
