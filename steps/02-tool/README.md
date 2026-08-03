# Step 02 — a tool

**Goal** — An agent with no tools can only emit text. Give it the `read_file` tool and it can reach into the repo — watch it *choose* to call the tool to answer the question about `problem/buggy-math.ts` and the buggy `isUserOpSuccess` read-path.

This is the **§1.1 "give the agent a read-only tool"** pattern. The repo also ships a sibling read-only query tool — `node tools/query.mjs receipt <userOpHash>` — that fetches the on-chain **ground truth** (an ERC-4337 userOp receipt) so the agent can verify the withdrawal's real outcome instead of trusting the UI's "failed" narrative. It's GET-only with deterministic exit codes (`0` ok, `2` usage, `3` not-found).

**What's new vs the previous step** — Adds the `read_file` tool (plus a `stepCountIs(5)` stop condition) on top of model + prompt.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/02-tool/run.ts
```

Try the query tool directly (no key needed):
```bash
node tools/query.mjs list                 # known userOpHashes
node tools/query.mjs receipt 0xfa11ed      # the false-negative receipt → exit 0
node tools/query.mjs receipt 0xnope        # missing → exit 3
```

**What to look for**
- A `--- tools the agent called ---` block listing the tool names invoked (expect `read_file`).
- A `--- answer ---` block describing what `isUserOpSuccess` currently does — that it reads the batch status — and it does NOT fix it (the prompt forbids that).

**Try this** — Tweak the user prompt in `run.ts` to ask the agent about a different file in `problem/` (e.g. a fixture under `problem/fixtures/`) and watch it read that one instead.
