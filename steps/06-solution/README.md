# Step 06 — write the solution

**Goal** — The full agent: prompt + context + tools + the loaded skill. Now we let it *act* — it diagnoses the bug and writes the corrected file to `agent/solution/buggy-math.ts` using the `write_file` tool.

**What's new vs the previous step** — Combines everything (system prompt + skill + pre-loaded context + `fsTools`) and lets the agent write, with `stepCountIs(10)`.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/06-solution/run.ts
```

**What to look for**
- A `--- tools called ---` list including `write_file` (likely after a `read_file`).
- The fix written to `agent/solution/buggy-math.ts` (`total` starts at `0`).
- A closing hint to run `npm run eval` (or `npm test`) to score it.

**Try this** — Run `npm run eval -- tests` before this step (tests FAIL), then after this step (tests PASS) to see the eval flip.
