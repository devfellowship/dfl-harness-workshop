# Step 04 — an MCP

**Goal** — MCP (Model Context Protocol) lets an agent use tools served by a *separate process*. We spawn the bundled stdio server (`agent/mcp/problem-server.ts`), which exposes `run_tests`, and hand its tools to the agent so it can check the current solution's test status.

**What's new vs the previous step** — Swaps the in-process `fsTools` for tools discovered over MCP via `connectProblemMcp()`.

**Run it**
```bash
OPENROUTER_API_KEY=$KEY npx tsx steps/04-mcp/run.ts
```

**What to look for**
- `MCP tools discovered: [ 'run_tests' ]` printed before the run.
- A `--- tools called ---` line showing `run_tests` was invoked.
- A `--- answer ---` reporting the pass/fail counts (FAIL until the bug is fixed in step 06).

**Try this** — Open `agent/mcp/problem-server.ts` to see how a tool is registered, then re-run step 04 to confirm it's still discovered.
