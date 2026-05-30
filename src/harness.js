// harness.js — a kata-sized version of the DFL agent harness.
//
// The real harness loads SKILLS, runs an agent against a TASK, then scores
// the result with a GRADER. This file keeps the same shape, minus the AI.
//
//   skill  -> a reusable capability the runner can apply to a task
//   task   -> { input, expected }
//   grader -> scores the produced output

import { grade } from "./grader.js";

export function runHarness(skill, task) {
  const output = skill(task.input);
  const result = grade(output, task.expected);
  return { skill: skill.name || "anonymous", output, ...result };
}

// Allow `npm run harness` to smoke-test the wiring with a trivial skill.
if (import.meta.url === `file://${process.argv[1]}`) {
  const echo = (x) => x;
  console.log(runHarness(echo, { input: "hello", expected: "hello" }));
}
