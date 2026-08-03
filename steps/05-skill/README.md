# Step 05 — a skill

**Goal** — A skill is a reusable procedure (`agent/skills/<name>/SKILL.md`) loaded on demand and injected into the system prompt. We load `fix-failing-test` so the agent commits to a method-driven plan before acting — sharper than its free-form answer in step 01.

The skill encodes the web3 lesson: **read `receipt.success`, never the batch status — verify on-chain truth before concluding.** Before fixing, it fetches the userOp receipt (via `node tools/query.mjs receipt <hash>` or the `get_userop_receipt` MCP tool) so the decision rests on ground truth, not the UI's "failed" narrative. A companion skill, `agent/skills/ground-truth-first/SKILL.md`, generalizes the same principle.

**What's new vs the previous step** — Appends the loaded skill text to the system prompt (`loadSkill("fix-failing-test")`) alongside prompt + context.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/05-skill/run.ts
```

**What to look for**
- The agent lists the exact steps it will take, mirroring the `fix-failing-test` procedure (read test → trace → **verify ground truth via the receipt** → hypothesize → minimal change → write file).
- It does NOT act yet — just plans.

**Try this** — Edit `agent/skills/fix-failing-test/SKILL.md` (reorder or reword steps), or swap in `ground-truth-first`, and re-run to watch the plan follow your new procedure.
