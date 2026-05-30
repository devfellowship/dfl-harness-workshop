// The deterministic part of the eval. Tests the agent's SOLUTION if it exists
// (agent/solution/buggy-math.ts), otherwise the original buggy file — so a
// fresh repo fails, and a solved repo passes.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SOLUTION_FILE } from "../lib/harness.ts";

const target = fs.existsSync(SOLUTION_FILE)
  ? SOLUTION_FILE
  : new URL("./buggy-math.ts", import.meta.url).pathname;

const { sum } = await import(target);

test("sum([1,2,3]) === 6", () => {
  assert.equal(sum([1, 2, 3]), 6);
});
test("sum([]) === 0", () => {
  assert.equal(sum([]), 0);
});
test("sum([10,-4]) === 6", () => {
  assert.equal(sum([10, -4]), 6);
});
