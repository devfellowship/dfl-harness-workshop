// problem/buggy-math.ts — THE PROBLEM (web3 tempero).
//
// Real production bug from Pods/Deframe. A withdrawal SUCCEEDED on-chain, but
// the UI showed "failed". Why? ERC-4337 (account abstraction) batches multiple
// userOps into a single `handleOps` transaction. The transaction RECEIPT has a
// `receipt.status` — but that is the status of the WHOLE BATCH, not of any one
// userOp inside it. Each userOp carries its OWN result in `receipt.success`.
//
// The frontend read `receipt.receipt.status` (the batch's status) instead of
// `receipt.success` (this userOp's own outcome). When the bundler's status
// field was misleading or absent — but the userOp itself succeeded
// independently — the read-path lied. Result: a successful withdrawal rendered
// as "failed", and a confused user.
//
// `isUserOpSuccess` should answer: "did THIS userOp succeed?" — which is exactly
// `receipt.success`. It currently (wrongly) trusts the batch status.
//
// You don't fix this by hand — your AGENT does, once you've built it up through
// the steps. The agent writes its fix to agent/solution/buggy-math.ts.
//
// The fix: trust the userOp's own `receipt.success`, never the batch status.

/** Shape of an ERC-4337 userOp receipt (the on-chain "ground truth"). */
export interface UserOpReceipt {
  userOpHash: string;
  /** THIS userOp's own outcome — the field to trust. */
  success: boolean;
  /** The inner transaction receipt for the `handleOps` BATCH (all userOps). */
  receipt: {
    /** Batch status: 1 = the bundle tx mined, 0 = the bundle tx reverted.
     *  May be undefined/misleading per bundler — NOT this userOp's result. */
    status?: number;
    transactionHash: string;
  };
}

export function isUserOpSuccess(receipt: UserOpReceipt): boolean {
  // <-- bug: reads the BATCH status, not this userOp's own `success`.
  return receipt.receipt.status === 1;
}
