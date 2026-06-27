# Problem context

This is a real production bug from Pods/Deframe. A user's withdrawal SUCCEEDED
on-chain, but the UI showed "failed".

The app uses ERC-4337 (account abstraction). Many userOps get bundled into one
`handleOps` transaction. The transaction receipt carries a `receipt.status` —
but that is the status of the WHOLE BATCH, not of any single userOp. Each userOp
carries its OWN result in `receipt.success`.

There is a function `isUserOpSuccess(receipt): boolean` in
`problem/buggy-math.ts`. It is supposed to answer "did THIS userOp succeed?" but
it wrongly reads the batch status (`receipt.receipt.status`) instead of the
userOp's own `receipt.success`. On the false-negative case — userOp succeeded
but the bundler omitted the batch status — it reports failure, and the UI lies.

Trust the on-chain GROUND TRUTH, not the UI narrative. You can fetch a userOp's
receipt with the read-only query tool (`node tools/query.mjs receipt <hash>`, or
the `get_userop_receipt` MCP tool). The test file defines the expected behavior.

Your deliverable is a corrected copy of the file written to
`agent/solution/buggy-math.ts` — `isUserOpSuccess` must return `receipt.success`.
