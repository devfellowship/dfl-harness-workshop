// A tiny MCP server, bundled with the repo so step 04 is self-contained
// (no external server to configure). It exposes ONE tool: run_tests — run the
// project's tests and return the pass/fail counts. The agent can call it to
// CHECK ITS OWN WORK, which is the whole point of giving an agent an MCP.
//
// Speaks MCP over stdio. The client in lib/mcp.ts spawns it.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { runTests } from "../../lib/eval.ts";

const server = new McpServer({ name: "problem-server", version: "1.0.0" });

server.registerTool(
  "run_tests",
  {
    description: "Run the project's tests against the current solution. Returns pass/fail counts.",
    inputSchema: {},
  },
  async () => {
    const r = runTests();
    return { content: [{ type: "text", text: JSON.stringify(r) }] };
  },
);

await server.connect(new StdioServerTransport());
