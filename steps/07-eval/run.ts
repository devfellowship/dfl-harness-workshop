// STEP 07 — eval.
// Score the current solution with all three graders. Run it BEFORE solving to
// see the baseline (tests FAIL), and after step 06 to see it flip to PASS.
//
//   npm run eval                       # all graders
//   npm run eval -- tests              # just the deterministic tests
//   npm run eval -- tests llm-judge    # pick graders
//   HUMAN_SCORE=5 npm run eval         # record a human score non-interactively
//
// Graders: tests (deterministic) · llm-judge (model, 0-10) · human (1-5).

import { runEval, printEval } from "../../lib/eval.ts";

const modes = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const r = await runEval(modes.length ? modes : ["tests", "llm-judge", "human"]);
printEval(r);
