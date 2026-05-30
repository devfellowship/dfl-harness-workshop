# Step 02 — a tool

**Goal** — An agent with no tools can only emit text. Give it the `read_file` tool and it can reach into the repo — watch it *choose* to call the tool to answer the question about `problem/buggy-math.ts`.

**What's new vs the previous step** — Adds the `read_file` tool (plus a `stepCountIs(5)` stop condition) on top of model + prompt.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/02-tool/run.ts
```

**What to look for**
- A `--- tools the agent called ---` block listing the tool names invoked (expect `read_file`).
- A `--- answer ---` block describing what `sum` currently does — and it does NOT fix it (the prompt forbids that).

**Try this** — Tweak the user prompt in `run.ts` to ask about a different file in `problem/` and watch the agent read that one instead.
