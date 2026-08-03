// A tiny MCP server, bundled with the repo so step 04 is self-contained
// (no external server to configure). It exposes TWO tools:
//   - run_tests          — run the project's tests, return pass/fail counts.
//   - get_userop_receipt — fetch an ERC-4337 userOp receipt (the on-chain
//                          "ground truth") from the bundled fixtures, read-only.
//
// The agent can call run_tests to CHECK ITS OWN WORK, and get_userop_receipt to
// fetch the ground truth for the withdrawal — instead of trusting the UI's
// "failed" narrative. That's the §1.1 "give the agent a read-only tool" pattern.
//
// Speaks MCP over stdio. The client in lib/mcp.ts spawns it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runTests } from "../../lib/eval.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, "..", "..", "problem", "fixtures");

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

server.registerTool(
  "get_userop_receipt",
  {
    description:
      "Fetch the ERC-4337 userOp receipt (on-chain ground truth) for a userOpHash. " +
      "Read-only. The receipt's own `success` is THIS userOp's outcome; " +
      "`receipt.status` is only the handleOps BATCH status — do not trust it for one userOp.",
    inputSchema: { userOpHash: z.string().describe("the userOp hash, e.g. 0xfa11ed") },
  },
  async ({ userOpHash }) => {
    const file = path.join(FIXTURES, `${userOpHash}.json`);
    if (!fs.existsSync(file)) {
      const known = fs
        .readdirSync(FIXTURES)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""));
      return {
        content: [{ type: "text", text: `not found: no receipt for ${userOpHash}. known: ${known.join(", ")}` }],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: fs.readFileSync(file, "utf8") }] };
  },
);

await server.connect(new StdioServerTransport());
