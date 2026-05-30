// lib/version.ts — versioning "the whole harness": model + prompt + context +
// skills + tools, captured as a snapshot with a content hash, tagged with the
// config version, plus the latest eval score. Lets you compare runs (step 10).

import fs from "node:fs";
import crypto from "node:crypto";
import { p, loadConfig } from "./harness.ts";

const VERSIONS_DIR = p("agent/versions");

export function snapshotBundle() {
  const cfg = loadConfig();
  const files: Record<string, string> = {};
  for (const f of ["agent/prompt.md", "agent/context.md", "agent/skills/fix-failing-test/SKILL.md"]) {
    files[f] = fs.readFileSync(p(f), "utf8");
  }
  const skills = fs.readdirSync(p("agent/skills"));
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ cfg, files }))
    .digest("hex")
    .slice(0, 12);
  return { version: cfg.version, model: cfg.model, skills, hash, files };
}

export function latestEvalScore(): any | null {
  if (!fs.existsSync(p(".eval-results"))) return null;
  const files = fs.readdirSync(p(".eval-results")).filter((f) => f.endsWith(".json")).sort();
  if (!files.length) return null;
  return JSON.parse(fs.readFileSync(p(".eval-results", files.at(-1)!), "utf8"));
}

export function recordVersion() {
  const bundle = snapshotBundle();
  const evalResult = latestEvalScore();
  const record = {
    ...bundle,
    eval: evalResult && {
      tests: evalResult.tests,
      llmJudge: evalResult.llmJudge?.score,
      human: evalResult.human?.score,
    },
    ts: new Date().toISOString(),
  };
  fs.mkdirSync(VERSIONS_DIR, { recursive: true });
  const file = p("agent/versions", `${bundle.version}+${bundle.hash}.json`);
  fs.writeFileSync(file, JSON.stringify(record, null, 2));
  return { file: file.replace(p() + "/", ""), record };
}

export function listVersions() {
  if (!fs.existsSync(VERSIONS_DIR)) return [];
  return fs
    .readdirSync(VERSIONS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(p("agent/versions", f), "utf8")))
    .sort((a, b) => a.ts.localeCompare(b.ts));
}
