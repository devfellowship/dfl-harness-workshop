# Step 10 — iterate

**Goal** — The loop that makes a harness a harness: change something (prompt, tool, skill, or model), re-solve, re-eval, cut a new version, and *compare*. This step prints the scoreboard across every version you've recorded so you can see whether you're improving.

**What's new vs the previous step** — Reads back all recorded versions (`listVersions()`) and renders them as a comparison table — closing the loop on top of step 09's snapshots.

**Run it**
```bash
npx tsx steps/10-iterate/run.ts
```

**What to look for**
- If no versions exist: "No versions yet. Run step 09 to record one, then iterate."
- Otherwise a table with columns `version | hash | model | tests | judge | human`, one row per recorded version.
- `tests` shows `PASS`/`fail`; `judge`/`human` show scores or `-`.

**Try this** — Run the suggested loop: tweak `agent/prompt.md`, re-run step 06, `npm run eval`, bump the version + run step 09, then re-run this step and watch the table grow with a second row to compare.
