# Skill: ground-truth-first

When a system reports an outcome (a UI says "failed", a dashboard says "error",
a status field says `0`), do not trust the narrative. Fetch the authoritative
source — the on-chain receipt, the database row, the ledger — and decide from
THAT.

This is the lesson of the Pods/Deframe ERC-4337 false-negative: the UI showed a
withdrawal as "failed", but the userOp's on-chain receipt said `success: true`.
The UI was reading the wrong field (the `handleOps` BATCH status instead of the
userOp's own `success`).

## Procedure

1. Identify the authoritative source of truth (here: the userOp receipt).
2. Fetch it with the read-only query tool — `node tools/query.mjs receipt <hash>`
   or the `get_userop_receipt` MCP tool. Read-only, no side effects.
3. In an ERC-4337 receipt: trust `receipt.success` (THIS userOp's result), never
   `receipt.receipt.status` (the whole batch). A bundle can mine fine while one
   userOp reverts, and a userOp can succeed while the batch status is absent.
4. Reconcile the narrative against ground truth. If they disagree, the narrative
   is the bug.

## Definition of done

The read-path trusts the userOp's own `receipt.success`, verified against the
on-chain receipt — not the UI's claim.
