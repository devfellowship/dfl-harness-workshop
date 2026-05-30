// lib/mcp.ts — connect to an MCP server (stdio) and expose its tools as AI SDK
// tools. ai v5 has no built-in MCP client, so we bridge it ourselves: that's
// literally all an "MCP integration" is — list the server's tools, and forward
// the model's tool calls to the server.

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tool, jsonSchema } from "ai";
import { ROOT } from "./harness.ts";

export async function connectProblemMcp() {
  const client = new Client({ name: "workshop-agent", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "agent/mcp/problem-server.ts"],
    cwd: ROOT,
  });
  await client.connect(transport);

  const { tools } = await client.listTools();
  const aiTools: Record<string, ReturnType<typeof tool>> = {};
  for (const t of tools) {
    aiTools[t.name] = tool({
      description: t.description ?? t.name,
      inputSchema: jsonSchema(t.inputSchema as any),
      execute: async (args) => {
        const res: any = await client.callTool({ name: t.name, arguments: args as any });
        return (res.content ?? []).map((c: any) => c.text ?? "").join("\n");
      },
    });
  }
  return { tools: aiTools, close: () => client.close() };
}
