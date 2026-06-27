# WEB3.md — the web3 tempero

This is the **`web3` branch** of the `dfl-harness-workshop` kata. It is the
**same harness** as `main` (same `model → prompt → tool → context → MCP → skill
→ solve → eval → publish → version → iterate` arc), re-flavored around **two real
Pods/Deframe production cases**:

- **§1.1 — give the agent a read-only tool.** A product feature aimed at the
  agent: a GET-only `query` that fetches on-chain ground truth, no mutation.
- **§2.2 — the ERC-4337 userOp receipt false-negative.** The bug being fixed.

## The story

A user's withdrawal **succeeded on-chain**, but the UI showed **"failed"**.

The app uses **ERC-4337** (account abstraction). Multiple userOps are bundled
into a single `handleOps` transaction. The transaction receipt has a
`receipt.status` — but that's the status of the **whole batch**, not of any one
userOp. Each userOp carries its **own** result in `receipt.success`.

The frontend read `receipt.receipt.status` (the batch) instead of
`receipt.success` (the userOp). When the bundler's status field was misleading
or absent — while the userOp itself succeeded — the read-path lied. A successful
withdrawal rendered as "failed."

## The agent's job

1. Use a **read-only** tool to fetch the userOp receipt (the on-chain **ground
   truth**), served from a local fixture:
   - CLI: `node tools/query.mjs receipt <userOpHash>` (exit `0` ok, `2` usage,
     `3` not-found).
   - MCP: the bundled `agent/mcp/problem-server.ts` exposes `get_userop_receipt`
     alongside `run_tests`.
2. **Fix the read-path** in `problem/buggy-math.ts` so `isUserOpSuccess` returns
   `receipt.success` — never the batch `receipt.receipt.status`.

## What changed from `main`

| File | Change |
|------|--------|
| `problem/buggy-math.ts` | `sum()` → `isUserOpSuccess(receipt)` (buggy: reads batch status) |
| `problem/buggy-math.test.ts` | asserts userOp receipts incl. the false-negative + true-negative |
| `problem/fixtures/*.json` | userOp receipt fixtures (incl. `0xfa11ed`, the false-negative) |
| `tools/query.mjs` | new read-only Node CLI — `query receipt <hash>` (the §1.1 tool) |
| `agent/mcp/problem-server.ts` | now exposes `get_userop_receipt` (+ keeps `run_tests`) |
| `agent/context.md`, `agent/prompt.md` | re-framed around the userOp false-negative |
| `agent/skills/` | `fix-failing-test` verifies ground truth; new `ground-truth-first` skill |
| `steps/02,04,05,07/README.md` | re-flavored: tool / MCP / skill / eval |

The **filenames** `problem/buggy-math.ts` + `problem/buggy-math.test.ts` are kept
on purpose — the whole `steps/00..10` pipeline and the `package.json` scripts
reference them; renaming would break the kata.

## Runs with Node 20+ only

**No Foundry, no Anvil, no Docker, no network/RPC.** The userOp receipts are
local JSON fixtures. `npm install` pulls only the existing AI-SDK + MCP deps.

## Red → green (no API key needed)

```bash
npm install
npm run eval -- tests                    # tests FAIL (the false-negative is red)
# fix it the way step 06 expects: write the corrected file to agent/solution/buggy-math.ts
#   (isUserOpSuccess returns receipt.success)
npm run eval -- tests                    # tests PASS
```

Leave the problem in its **buggy** state — attendees start from red. See the root
[`README.md`](README.md) for the full step-by-step arc, the 1Password key link,
and the Codespaces/local instructions.
