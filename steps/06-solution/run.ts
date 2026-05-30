// STEP 06 — write the solution.
// The full agent: prompt + context + tools + the loaded skill. Now we let it
// ACT — it diagnoses the bug and WRITES the fix to agent/solution/buggy-math.ts
// with the write_file tool. After this, run step 07 and watch the eval flip to PASS.
//
//   OPENROUTER_API_KEY=... npm run step steps/06-solution/run.ts

import { generateText, stepCountIs } from "ai";
import { createModel, loadPrompt, loadContext, loadSkill, fsTools } from "../../lib/harness.ts";

const system = [loadPrompt(), "\n# Loaded skill\n", loadSkill("fix-failing-test")].join("\n");

const res = await generateText({
  model: createModel(),
  system,
  tools: fsTools,
  stopWhen: stepCountIs(10),
  messages: [
    { role: "user", content: loadContext() },
    { role: "user", content: "Fix the bug. Write the complete corrected file to agent/solution/buggy-math.ts now." },
  ],
});

console.log("--- tools called ---");
console.log(res.steps.flatMap((s) => s.toolCalls).map((t) => t.toolName));
console.log("\n--- agent ---\n" + res.text);
console.log("\nNext: `npm run eval` (or `npm test`) to score the solution.");
