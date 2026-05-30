// STEP 01 — the prompt.
// Give the model a SYSTEM PROMPT (agent/prompt.md) — its identity and job.
// It now knows it's a coding agent meant to fix a test... but it still has no
// tools and no context, so it can only TALK about it, not act.
//
//   OPENROUTER_API_KEY=... npm run step steps/01-prompt/run.ts

import { generateText } from "ai";
import { createModel, loadPrompt } from "../../lib/harness.ts";

const res = await generateText({
  model: createModel(),
  system: loadPrompt(),
  prompt: "What is your job here, and what would you need to actually do it?",
});

console.log(res.text);
