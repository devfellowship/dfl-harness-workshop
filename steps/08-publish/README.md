# Step 08 — publish to the moltbook

**Goal** — Take the latest eval result and POST it to the shared leaderboard ("moltbook"). Set `MOLTBOOK_URL` to publish for real; without it, the script prints the exact payload (dry-run).

**What's new vs the previous step** — Consumes the eval result from step 07 and turns it into a publishable score record (agent, harness version + hash, model, scores).

**Run it**
```bash
npm run eval                              # produce a result first
npm run publish                           # dry-run (prints the payload)
MOLTBOOK_URL=https://... npm run publish  # publish it for real
```

**What to look for**
- If no eval result exists yet, it errors with "Run `npm run eval` first."
- Dry-run prints `DRY-RUN ... Payload:` followed by JSON (`agent`, `harness_version`, `harness_hash`, `model`, `tests_ok`, `llm_judge`, `human`, `ts`).
- With `MOLTBOOK_URL` set, it prints `POST <url> → <status>` and the response body.

**Try this** — Set `FELLOW=your-name npm run publish` to stamp the payload's `agent` field with your handle instead of `anonymous-fellow`.
