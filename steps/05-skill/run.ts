// STEP 05 — a skill.
// A skill is a reusable procedure (agent/skills/<name>/SKILL.md) loaded on
// demand and injected into the system prompt. Here we load `fix-failing-test`
// and the agent commits to its procedure before acting. Compare the plan it
// gives here vs. step 01 (no skill) — it's sharper and method-driven.
//
//   OPENROUTER_API_KEY=... npm run step steps/05-skill/run.ts

import { generateText } from "ai";
import { createModel, loadPrompt, loadContext, loadSkill } from "../../lib/harness.ts";

const system = [loadPrompt(), "\n# Loaded skill\n", loadSkill("fix-failing-test")].join("\n");

const res = await generateText({
  model: createModel(),
  system,
  messages: [
    { role: "user", content: loadContext() },
    { role: "user", content: "Following your loaded skill, list the exact steps you will take. Don't act yet." },
  ],
});

console.log(res.text);
