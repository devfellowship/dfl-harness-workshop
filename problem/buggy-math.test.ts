// The deterministic part of the eval. Tests the agent's SOLUTION if it exists
// (agent/solution/buggy-math.ts), otherwise the original buggy file — so a
// fresh repo fails, and a solved repo passes.
//
// web3 tempero: these are realistic ERC-4337 userOp receipts. Reading the BATCH
// status (`receipt.receipt.status`) gives the WRONG answer on the false-negative
// case; reading the userOp's own `receipt.success` gives the RIGHT answer.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SOLUTION_FILE } from "../lib/harness.ts";

const target = fs.existsSync(SOLUTION_FILE)
  ? SOLUTION_FILE
  : new URL("./buggy-math.ts", import.meta.url).pathname;

const { isUserOpSuccess } = await import(target);

// THE PRODUCTION FALSE-NEGATIVE: the withdrawal userOp SUCCEEDED on-chain
// (success: true), but the bundler omitted the batch status field. The buggy
// read-path (`receipt.status === 1`) yields `false` → UI shows "failed". The
// correct read-path (`receipt.success`) yields `true`.
test("false-negative: userOp succeeded but batch status is absent → success", () => {
  const receipt = {
    userOpHash: "0xfa11ed",
    success: true,
    receipt: { transactionHash: "0xbatch1" }, // status absent
  };
  assert.equal(isUserOpSuccess(receipt), true);
});

// Misleading batch status: the bundle tx mined fine (status 1) for OTHER ops,
// but THIS userOp reverted (success: false). Trusting the batch would lie.
test("true-negative: userOp reverted even though batch mined → failure", () => {
  const receipt = {
    userOpHash: "0xrevert",
    success: false,
    receipt: { status: 1, transactionHash: "0xbatch2" },
  };
  assert.equal(isUserOpSuccess(receipt), false);
});

// Happy path: userOp succeeded and the batch mined.
test("true-positive: userOp succeeded and batch mined → success", () => {
  const receipt = {
    userOpHash: "0x900d",
    success: true,
    receipt: { status: 1, transactionHash: "0xbatch3" },
  };
  assert.equal(isUserOpSuccess(receipt), true);
});

// Both failed: userOp reverted and the whole batch reverted.
test("true-negative: userOp failed and batch reverted → failure", () => {
  const receipt = {
    userOpHash: "0xdead",
    success: false,
    receipt: { status: 0, transactionHash: "0xbatch4" },
  };
  assert.equal(isUserOpSuccess(receipt), false);
});
