import { test } from "node:test";
import assert from "node:assert/strict";
import { runHarness } from "../src/harness.js";
import { sum } from "./buggy-math.js";

test("sum adds the numbers in an array", () => {
  const result = runHarness(sum, { input: [1, 2, 3], expected: 6 });
  assert.equal(result.pass, true, result.detail);
});

test("sum of an empty array is 0", () => {
  const result = runHarness(sum, { input: [], expected: 0 });
  assert.equal(result.pass, true, result.detail);
});
