// lib/eval.ts — the eval. Three graders, the way the real dfl-harness scores:
//   1. tests     — deterministic, runs problem/buggy-math.test.ts
//   2. llm-judge — a model scores the solution against a rubric (0..10)
//   3. human     — a person rates it 1..5 (TTY prompt, or HUMAN_SCORE env, or pending)
//
// Runnable at ANY step. Before the agent solves anything you'll see tests fail
// and the judge score low — that's the baseline you improve.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { generateText } from "ai";
import { createModel, p, SOLUTION_FILE } from "./harness.ts";
import readline from "node:readline/promises";

export interface EvalResult {
  tests: { pass: number; fail: number; ok: boolean };
  llmJudge: { score: number; max: 10; rationale: string };
  human: { score: number | null; max: 5; status: "scored" | "pending"; note?: string };
  solvedFile: string;
  ts: string;
}

function currentSolution(): { path: string; code: string } {
  const path = fs.existsSync(SOLUTION_FILE) ? SOLUTION_FILE : p("problem/buggy-math.ts");
  return { path, code: fs.readFileSync(path, "utf8") };
}

/** Grader 1: deterministic tests. */
export function runTests() {
  try {
    const out = execFileSync(
      "node",
      ["--test", "--import", "tsx", "problem/buggy-math.test.ts"],
      { cwd: p(), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return parseTap(out);
  } catch (e: any) {
    // node --test exits non-zero on failures; output is still on stdout
    return parseTap((e.stdout || "") + (e.stderr || ""));
  }
}
function parseTap(out: string) {
  const pass = Number(out.match(/#?\s*pass\s+(\d+)/i)?.[1] ?? 0);
  const fail = Number(out.match(/#?\s*fail\s+(\d+)/i)?.[1] ?? 0);
  return { pass, fail, ok: fail === 0 && pass > 0 };
}

/** Grader 2: LLM judge over the solution code. */
export async function runLlmJudge() {
  const { code } = currentSolution();
  const res = await generateText({
    model: createModel(),
    system:
      "You are a strict code reviewer. Score a solution for the `sum(numbers)` task " +
      "(should total an array of numbers). Reply EXACTLY as:\nSCORE: <0-10>\nRATIONALE: <one sentence>",
    prompt: "Here is the candidate solution:\n\n```ts\n" + code + "\n```",
  });
  const score = Number(res.text.match(/SCORE:\s*(\d+(?:\.\d+)?)/i)?.[1] ?? 0);
  const rationale = res.text.match(/RATIONALE:\s*(.*)/i)?.[1]?.trim() ?? res.text.trim();
  return { score, max: 10 as const, rationale };
}

/** Grader 3: human-in-the-loop. */
export async function runHuman() {
  const envScore = process.env.HUMAN_SCORE;
  if (envScore) {
    return { score: Number(envScore), max: 5 as const, status: "scored" as const, note: "from HUMAN_SCORE" };
  }
  if (!process.stdin.isTTY) {
    return { score: null, max: 5 as const, status: "pending" as const, note: "no TTY; set HUMAN_SCORE to record" };
  }
  const { code } = currentSolution();
  console.log("\n--- solution under review ---\n" + code + "\n-----------------------------");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ans = await rl.question("Human score 1-5 (readability/quality): ");
  const note = await rl.question("Note (optional): ");
  rl.close();
  return { score: Number(ans), max: 5 as const, status: "scored" as const, note };
}

export async function runEval(modes: string[] = ["tests", "llm-judge", "human"]): Promise<EvalResult> {
  const tests = modes.includes("tests")
    ? runTests()
    : { pass: 0, fail: 0, ok: false };
  const llmJudge = modes.includes("llm-judge")
    ? await runLlmJudge()
    : { score: 0, max: 10 as const, rationale: "skipped" };
  const human = modes.includes("human")
    ? await runHuman()
    : { score: null, max: 5 as const, status: "pending" as const };

  const result: EvalResult = {
    tests,
    llmJudge,
    human,
    solvedFile: currentSolution().path.replace(p() + "/", ""),
    ts: new Date().toISOString(),
  };

  fs.mkdirSync(p(".eval-results"), { recursive: true });
  fs.writeFileSync(p(".eval-results", `${result.ts.replace(/[:.]/g, "-")}.json`), JSON.stringify(result, null, 2));
  return result;
}

export function printEval(r: EvalResult) {
  console.log("\n================ EVAL ================");
  console.log(`solution : ${r.solvedFile}`);
  console.log(`tests    : ${r.tests.ok ? "PASS" : "FAIL"}  (${r.tests.pass} pass / ${r.tests.fail} fail)`);
  console.log(`llm-judge: ${r.llmJudge.score}/10  — ${r.llmJudge.rationale}`);
  console.log(`human    : ${r.human.status === "scored" ? r.human.score + "/5" : "pending"}${r.human.note ? "  (" + r.human.note + ")" : ""}`);
  console.log("=====================================\n");
}
