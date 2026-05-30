// lib/harness.ts — the shared kit every step builds on.
// Keep this small: each step under steps/ wires these pieces together itself,
// so you can SEE the agent grow. Nothing magic hides here.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { tool } from "ai";
import { z } from "zod";

export const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
export const p = (...s: string[]) => path.join(ROOT, ...s);

// Tiny .env loader (no dependency) — so `npx tsx steps/..` just works if the
// fellow created a .env. Existing env vars always win.
(() => {
  const envFile = path.join(ROOT, ".env");
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

export interface HarnessConfig {
  version: string;
  model: string;
  temperature: number;
}

export function loadConfig(): HarnessConfig {
  return JSON.parse(fs.readFileSync(p("agent/harness.config.json"), "utf8"));
}

/** Step 00 — the model. Reads the OpenRouter key from the env. */
export function createModel(cfg: HarnessConfig = loadConfig()) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. See the root README → 'Get the key'.",
    );
  }
  const openrouter = createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });
  // The shared workshop key is OSS-only (closed-source / big-lab models are
  // blocked), so the default model MUST be an open model that also tool-calls.
  // Override per-run with OPENROUTER_MODEL=... without editing the config.
  const model = process.env.OPENROUTER_MODEL || cfg.model;
  return openrouter(model);
}

/** Step 01 — the prompt (the agent's approach to the problem). */
export const loadPrompt = () => fs.readFileSync(p("agent/prompt.md"), "utf8");

/** Step 03 — the context the agent gets about the problem. */
export function loadContext(): string {
  const ctx = fs.readFileSync(p("agent/context.md"), "utf8");
  const buggy = fs.readFileSync(p("problem/buggy-math.ts"), "utf8");
  const test = fs.readFileSync(p("problem/buggy-math.test.ts"), "utf8");
  return [
    ctx,
    "\n--- problem/buggy-math.ts ---\n" + buggy,
    "\n--- problem/buggy-math.test.ts ---\n" + test,
  ].join("\n");
}

/** Step 05 — a skill = an instruction block + (optionally) tools, loaded on demand. */
export function loadSkill(name: string): string {
  return fs.readFileSync(p("agent/skills", name, "SKILL.md"), "utf8");
}

/** Where the agent writes its fix. Eval reads here first, falls back to the buggy original. */
export const SOLUTION_FILE = p("agent/solution/buggy-math.ts");

/** Step 02+ — filesystem tools, sandboxed to the repo. */
export const fsTools = {
  read_file: tool({
    description: "Read a UTF-8 text file inside the workshop repo.",
    inputSchema: z.object({ path: z.string().describe("repo-relative path") }),
    execute: async ({ path: rel }) => {
      const abs = p(rel);
      if (!abs.startsWith(ROOT)) throw new Error("path escapes repo");
      return fs.readFileSync(abs, "utf8");
    },
  }),
  write_file: tool({
    description: "Write a UTF-8 text file inside the workshop repo (creates dirs).",
    inputSchema: z.object({ path: z.string(), content: z.string() }),
    execute: async ({ path: rel, content }) => {
      const abs = p(rel);
      if (!abs.startsWith(ROOT)) throw new Error("path escapes repo");
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
      return `wrote ${rel} (${content.length} bytes)`;
    },
  }),
};
