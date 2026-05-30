# Step 05 — a skill

**Goal** — A skill is a reusable procedure (`agent/skills/<name>/SKILL.md`) loaded on demand and injected into the system prompt. We load `fix-failing-test` so the agent commits to a method-driven plan before acting — sharper than its free-form answer in step 01.

**What's new vs the previous step** — Appends the loaded skill text to the system prompt (`loadSkill("fix-failing-test")`) alongside prompt + context.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/05-skill/run.ts
```

**What to look for**
- The agent lists the exact steps it will take, mirroring the `fix-failing-test` procedure (read test → trace → hypothesize → minimal change → write file).
- It does NOT act yet — just plans.

**Try this** — Edit `agent/skills/fix-failing-test/SKILL.md` (reorder or reword steps) and re-run to watch the plan follow your new procedure.
