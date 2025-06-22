import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Crear el servidor
const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

// Agregar un recurso simple
server.registerResource(
  "hello-resource",
  "file:///hello.txt",
  {
    title: "Hello Resource",
  },
  async () => {
    return {
      contents: [
        {
          uri: "file:///hello.txt",
          text: "Hello, World!",
          mimeType: "text/plain",
        },
      ],
    };
  }
);

// Agregar una herramienta simple
server.registerTool(
  "tool-pelusear",
  {
    title: "Pelusear Tool",
    description: "A simple tool Peluseadora",
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "¡Has sido peluseado! 🐶\n",
        },
      ],
    };
  }
);

// Función principal para iniciar el servidor
async function main() {
  try {
    console.error("Starting MCP server...");

    // Conectar usando transporte stdio
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("MCP server connected and ready");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

// Ejecutar el servidor
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
