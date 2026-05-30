// STEP 09 — version the harness.
// Snapshot the WHOLE agent (model + prompt + context + skills) into a content-
// hashed record under agent/versions/, tagged with the version in
// agent/harness.config.json and stamped with the latest eval score. This is what
// makes iteration measurable: each version is a comparable point.
//
//   npm run step steps/09-version/run.ts
//
// To cut a new version: bump "version" in agent/harness.config.json, then re-run.

import { recordVersion } from "../../lib/version.ts";

const { file, record } = recordVersion();
console.log("recorded:", file);
console.log(JSON.stringify({ version: record.version, hash: record.hash, model: record.model, skills: record.skills, eval: record.eval }, null, 2));
