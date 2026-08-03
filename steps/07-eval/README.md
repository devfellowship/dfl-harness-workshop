# Step 07 — eval

**Goal** — Score the current solution with three graders: `tests` (deterministic), `llm-judge` (model, 0–10), and `human` (1–5). Run it BEFORE step 06 to see the baseline (tests FAIL), and after to watch it flip to PASS.

The deterministic `tests` grader asserts **correct userOp success detection**: that `isUserOpSuccess` returns `receipt.success` and so handles the production false-negative (userOp succeeded, batch status absent → must report success) plus the misleading-batch case (batch mined, this userOp reverted → must report failure). The buggy read-path that trusts `receipt.receipt.status` fails these; the fix passes them.

**What's new vs the previous step** — Stops building the agent and starts *measuring* it. The `tests` grader needs no key, but `llm-judge` calls the model — so the all-graders run still needs `OPENROUTER_API_KEY`.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npm run eval          # all graders
npm run eval -- tests                          # deterministic tests only (no key)
HUMAN_SCORE=5 npm run eval                     # record a human score non-interactively
```

**What to look for**
- An `EVAL` block printing `tests : PASS/FAIL (N pass / N fail)`, `llm-judge: X/10`, and `human: N/5` or `pending`.
- Before step 06: tests FAIL (the false-negative case is red) and the judge scores low. After: tests PASS.
- Each run also writes a JSON result under `.eval-results/`.

**Try this** — Run `npm run eval -- tests` (no key needed) before solving and after, to isolate the deterministic flip from FAIL to PASS.
