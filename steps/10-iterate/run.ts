// STEP 10 — iterate.
// The loop that makes a harness a harness: change something (the prompt, a
// tool, the skill, the model in harness.config.json), re-run the eval, cut a new
// version, and COMPARE. This step prints the scoreboard across every version
// you've recorded so you can see whether you're improving.
//
//   npm run step steps/10-iterate/run.ts
//
// Suggested loop:
//   1. tweak agent/prompt.md (or model in harness.config.json)
//   2. npm run step steps/06-solution/run.ts   # re-solve
//   3. npm run eval                            # re-score
//   4. bump version in harness.config.json, then steps/09-version/run.ts
//   5. re-run THIS step and watch the table grow

import { listVersions } from "../../lib/version.ts";

const versions = listVersions();
if (!versions.length) {
  console.log("No versions yet. Run step 09 to record one, then iterate.");
  process.exit(0);
}

console.log("version          hash          model                         tests  judge  human");
console.log("-".repeat(92));
for (const v of versions) {
  const e = v.eval || {};
  console.log(
    `${(v.version + "").padEnd(15)}  ${(v.hash + "").padEnd(12)}  ${(v.model + "").padEnd(28)}  ` +
      `${(e.tests?.ok ? "PASS" : "fail").padEnd(5)}  ${String(e.llmJudge ?? "-").padEnd(5)}  ${String(e.human ?? "-")}`,
  );
}
