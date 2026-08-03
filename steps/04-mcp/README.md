# Step 04 — an MCP

**Goal** — MCP (Model Context Protocol) lets an agent use tools served by a *separate process*. We spawn the bundled stdio server (`agent/mcp/problem-server.ts`), which exposes **`run_tests`** and **`get_userop_receipt`**, and hand its tools to the agent. `get_userop_receipt` returns the ERC-4337 userOp receipt (the on-chain **ground truth**) for a given userOpHash — the same read-only "query" idea as `tools/query.mjs`, now over MCP — so the agent can verify the withdrawal's real outcome (`receipt.success`) instead of trusting the UI.

**What's new vs the previous step** — Swaps the in-process `fsTools` for tools discovered over MCP via `connectProblemMcp()`.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/04-mcp/run.ts
```

**What to look for**
- `MCP tools discovered: [ 'run_tests', 'get_userop_receipt' ]` printed before the run.
- A `--- tools called ---` line showing the MCP tool that was invoked.
- A `--- answer ---` reporting either the pass/fail counts (FAIL until the bug is fixed in step 06) or the receipt's `success` for the queried userOp.

**Try this** — Open `agent/mcp/problem-server.ts` to see how a tool is registered, then ask the agent (edit the prompt in `run.ts`) to `get_userop_receipt` for `0xfa11ed` (the false-negative) and report whether the userOp actually succeeded.
