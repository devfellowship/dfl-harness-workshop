// STEP 08 — publish to the moltbook.
// Take the latest eval result and POST it to the shared leaderboard ("moltbook").
// Set MOLTBOOK_URL to publish for real; without it, this prints the payload
// (dry-run) so you can see exactly what would be sent.
//
//   npm run eval                              # produce a result first
//   MOLTBOOK_URL=https://... npm run publish  # publish it
//   npm run publish                           # dry-run (prints payload)

import { latestEvalScore } from "../../lib/version.ts";
import { snapshotBundle } from "../../lib/version.ts";

const evalResult = latestEvalScore();
if (!evalResult) {
  console.error("No eval result yet. Run `npm run eval` first.");
  process.exit(1);
}

const bundle = snapshotBundle();
const payload = {
  agent: process.env.FELLOW || "anonymous-fellow",
  harness_version: bundle.version,
  harness_hash: bundle.hash,
  model: bundle.model,
  tests_ok: evalResult.tests.ok,
  llm_judge: evalResult.llmJudge?.score ?? null,
  human: evalResult.human?.score ?? null,
  ts: new Date().toISOString(),
};

const url = process.env.MOLTBOOK_URL;
if (!url) {
  console.log("DRY-RUN (set MOLTBOOK_URL to publish). Payload:\n");
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const res = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});
console.log(`POST ${url} → ${res.status}`);
console.log(await res.text());
