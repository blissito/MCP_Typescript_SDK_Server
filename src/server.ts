import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { MCPConfig } from "./types";

export class MCPServer {
  private server: McpServer;
  private transport?: StdioServerTransport;

  constructor(config: MCPConfig) {
    this.server = new McpServer({
      name: config.name,
      version: config.version,
    });
  }

  registerResource(
    name: string,
    uri: string,
    metadata: { title: string; description?: string },
    handler: () => Promise<{
      contents: Array<{ uri: string; text: string; mimeType: string }>;
    }>
  ) {
    this.server.registerResource(name, uri, metadata, handler);
  }

  registerTool(
    name: string,
    metadata: { title: string; description: string },
    handler: () => Promise<{ content: Array<{ type: string; text: string }> }>
  ) {
    this.server.registerTool(name, metadata, handler);
  }

  async start() {
    try {
      console.error("Starting MCP server...");
      this.transport = new StdioServerTransport();
      await this.server.connect(this.transport);
      console.error("MCP server connected and ready");
    } catch (error) {
      console.error("Error starting MCP server:", error);
      throw error;
    }
  }

  async stop() {
    if (this.transport) {
      await this.server.close();
    }
  }
}

// Default server instance for backward compatibility
export const createDefaultServer = () => {
  const server = new MCPServer({
    name: "example-server",
    version: "1.0.0",
  });

  // Register default resources and tools
  server.registerResource(
    "hello-resource",
    "file:///hello.txt",
    { title: "Hello Resource" },
    async () => ({
      contents: [
        {
          uri: "file:///hello.txt",
          text: "Hello, World!",
          mimeType: "text/plain",
        },
      ],
    })
  );

  server.registerTool(
    "tool-pelusear",
    {
      title: "Pelusear Tool",
      description: "A simple tool Peluseadora",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "¡Has sido peluseado! 🐶\n",
        },
      ],
    })
  );

  return server;
};
