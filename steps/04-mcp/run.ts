// STEP 04 — an MCP.
// MCP (Model Context Protocol) lets an agent use tools served by a separate
// process. We spawn the bundled MCP server (agent/mcp/problem-server.ts), which
// exposes `run_tests`, and hand its tools to the agent. Watch the agent call an
// MCP tool to CHECK the current solution's test status.
//
//   OPENROUTER_API_KEY=... npm run step steps/04-mcp/run.ts

import { generateText, stepCountIs } from "ai";
import { createModel, loadPrompt } from "../../lib/harness.ts";
import { connectProblemMcp } from "../../lib/mcp.ts";

const mcp = await connectProblemMcp();
console.log("MCP tools discovered:", Object.keys(mcp.tools));

const res = await generateText({
  model: createModel(),
  system: loadPrompt(),
  tools: mcp.tools,
  stopWhen: stepCountIs(5),
  prompt: "Use the run_tests tool to check whether the current solution passes. Report the counts.",
});

await mcp.close();
console.log("\n--- tools called ---", res.steps.flatMap((s) => s.toolCalls).map((t) => t.toolName));
console.log("\n--- answer ---\n" + res.text);
