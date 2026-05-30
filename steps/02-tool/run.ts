// STEP 02 — a tool.
// An agent without tools can only emit text. Give it `read_file` and now it can
// reach into the repo. Watch it CHOOSE to call the tool to answer the question.
//
//   OPENROUTER_API_KEY=... npm run step steps/02-tool/run.ts

import { generateText, stepCountIs } from "ai";
import { createModel, loadPrompt, fsTools } from "../../lib/harness.ts";

const res = await generateText({
  model: createModel(),
  system: loadPrompt(),
  tools: { read_file: fsTools.read_file },
  stopWhen: stepCountIs(5),
  prompt:
    "Read problem/buggy-math.ts and tell me what the sum function currently does. Do NOT fix it yet.",
});

console.log("--- tools the agent called ---");
console.log(res.steps.flatMap((s) => s.toolCalls).map((t) => t.toolName));
console.log("\n--- answer ---");
console.log(res.text);
