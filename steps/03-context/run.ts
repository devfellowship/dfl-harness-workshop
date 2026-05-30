// STEP 03 — context.
// Tools let the agent FETCH information; context PRE-LOADS the important parts so
// it doesn't have to. We inject the problem (the buggy file + the test) straight
// into the conversation. Now the agent fully understands the task in one shot.
//
//   OPENROUTER_API_KEY=... npm run step steps/03-context/run.ts

import { generateText, stepCountIs } from "ai";
import { createModel, loadPrompt, loadContext, fsTools } from "../../lib/harness.ts";

const res = await generateText({
  model: createModel(),
  system: loadPrompt(),
  tools: fsTools,
  stopWhen: stepCountIs(8),
  messages: [
    { role: "user", content: loadContext() },
    { role: "user", content: "Diagnose the bug in one sentence. Do NOT write the fix yet." },
  ],
});

console.log(res.text);
