# Step 00 — the model

**Goal** — Show the smallest possible agent: pick a model and ask it one question. No system prompt, no tools, no context — the model is "raw" and knows nothing about us or the task.

**What's new vs the previous step** — This is the start.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/00-model/run.ts
```

**What to look for**
- First line prints the active model from `agent/harness.config.json` (e.g. `model: anthropic/claude-3.5-haiku`).
- A one-sentence, generic definition of "an AI agent" — no awareness of this repo or the bug.

**Try this** — Change `"model"` in `agent/harness.config.json` (any OpenRouter model id) and re-run to see a different model answer.
