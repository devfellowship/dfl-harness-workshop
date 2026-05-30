# dfl-harness-workshop 🥋

A **kata** — a tiny, hands-on simplification of the
[`dfl-harness`](https://github.com/devfellowship/dfl-harness) (the agent OS for
DFL). Strip away the AI, the eval engine, and the 48 skill packs, and the core
idea is small:

> A **harness** runs a **skill** against a **task** and **grades** the result.

That's the whole loop. This repo lets you feel it in ~5 minutes.

## Open it (no setup, no org membership needed)

This repo is **public**. You do **not** need to be a member of `devfellowship`.

**Option A — GitHub Codespaces (recommended for the workshop):**
1. Click the green **`< > Code`** button → **Codespaces** → **Create codespace**.
2. Wait ~30s for the devcontainer to build. The terminal opens ready to go.
   (Runs on *your* personal Codespaces free quota — nothing billed to the org.)

**Option B — VS Code locally:** clone, then **"Reopen in Container"** (needs
Docker + the Dev Containers extension).

**Option C — no container at all:** just `git clone` and run, you only need
Node 20+. Zero npm dependencies.

## The kata

```bash
npm test     # ❌ one test fails — that's intentional
```

Open `tasks/buggy-math.js`, find the bug, fix it, then:

```bash
npm test     # ✅ green
```

Want the wiring smoke test? `npm run harness`.

## Branches

| Branch | What it is |
|--------|------------|
| `main` | The starting point — failing test, your kata. |
| `solution` | The fix, if you get stuck or want to compare. |

## Layout

```
src/harness.js          the run-skill-then-grade loop
src/grader.js           the simplest possible grader
tasks/buggy-math.js     the buggy "skill" you fix  ← start here
tasks/buggy-math.test.js
skills/README.md        how skills map to the real harness
.devcontainer/          the Codespaces / Dev Container we're testing today
```
