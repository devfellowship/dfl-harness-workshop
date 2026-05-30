// STEP 00 — the model.
// The smallest possible thing: pick a model and ask it something. No system
// prompt, no tools, no context. The agent is "raw" — it knows nothing about us.
//
//   OPENROUTER_API_KEY=... npm run step steps/00-model/run.ts

import { generateText } from "ai";
import { createModel, loadConfig } from "../../lib/harness.ts";

const cfg = loadConfig();
console.log(`model: ${cfg.model}\n`);

const res = await generateText({
  model: createModel(cfg),
  prompt: "In one sentence: what is an AI agent?",
});

console.log(res.text);
