# Step 01 — the prompt

**Goal** — Give the model a system prompt (`agent/prompt.md`) — its identity and job. It now knows it's a coding agent meant to fix a failing test, but with no tools or context it can only *talk* about the job, not act.

**What's new vs the previous step** — Adds the system prompt on top of the bare model from step 00.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/01-prompt/run.ts
```

**What to look for**
- The agent describes its job as a coding/test-fixing agent (sourced from `agent/prompt.md`).
- It states what it still *lacks* — access to the files, the ability to run/edit code — because it has no tools or context yet.

**Try this** — Edit `agent/prompt.md` to sharpen the agent's persona or instructions, then re-run and compare the framing of its answer.
