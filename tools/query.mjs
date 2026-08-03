#!/usr/bin/env node
// tools/query.mjs — a read-only "query" tool, the §1.1 pattern: a product
// feature aimed at the AGENT. It mirrors the Pods/Deframe backoffice `query`
// idea — GET-only, no mutation — letting the agent fetch the on-chain GROUND
// TRUTH (an ERC-4337 userOp receipt) instead of trusting the UI's narrative.
//
// Self-contained: reads JSON fixtures from problem/fixtures/. No network, no RPC.
//
// Usage:
//   node tools/query.mjs receipt <userOpHash>   # print the receipt fixture JSON
//   node tools/query.mjs list                   # list known userOpHashes
//
// Deterministic exit codes (so a harness can branch on them):
//   0  ok
//   2  usage error (bad/missing subcommand or args)
//   3  not found (no fixture for that userOpHash)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, "..", "problem", "fixtures");

const [, , cmd, arg] = process.argv;

function fail(code, msg) {
  process.stderr.write(msg + "\n");
  process.exit(code);
}

function listHashes() {
  return fs
    .readdirSync(FIXTURES)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

switch (cmd) {
  case "receipt": {
    if (!arg) fail(2, "usage: node tools/query.mjs receipt <userOpHash>");
    const file = path.join(FIXTURES, `${arg}.json`);
    if (!fs.existsSync(file)) {
      fail(3, `not found: no userOp receipt for ${arg}\nknown: ${listHashes().join(", ")}`);
    }
    process.stdout.write(fs.readFileSync(file, "utf8"));
    process.exit(0);
    break;
  }
  case "list": {
    process.stdout.write(listHashes().join("\n") + "\n");
    process.exit(0);
    break;
  }
  default:
    fail(
      2,
      "usage:\n" +
        "  node tools/query.mjs receipt <userOpHash>   # print a userOp receipt (read-only)\n" +
        "  node tools/query.mjs list                   # list known userOpHashes",
    );
}
