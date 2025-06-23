import { createMCPServer, exampleConfigs } from "fixtergeek-mcp-server";

// Configuración del servidor MCP usando fixtergeek-mcp-server
const server = createMCPServer({
  port: 3001,
  logLevel: "info",
  // Configuración de LLM (opcional)
  llm: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b",
    temperature: 0.7,
  },
});

// Registrar recursos personalizados
server.registerResource(
  "hello-resource",
  "file:///hello.txt",
  {
    title: "Hello Resource",
    description: "A simple hello world resource",
  },
  async () => ({
    success: true,
    data: {
      content:
        "Hello, World! This is a custom resource from fixtergeek-mcp-server!",
      mimeType: "text/plain",
    },
    timestamp: Date.now(),
  })
);

// Registrar herramientas personalizadas
server.registerTool(
  "tool-pelusear",
  {
    title: "Pelusear Tool",
    description: "A simple tool that pelusea (pets) you",
  },
  async (params) => ({
    success: true,
    data: {
      result: {
        message: "¡Has sido peluseado! 🐶",
        params,
        timestamp: new Date().toISOString(),
      },
    },
    timestamp: Date.now(),
  })
);

// Función principal para iniciar el servidor
async function main() {
  try {
    console.log("🚀 Starting MCP server with fixtergeek-mcp-server...");

    // Iniciar el servidor
    await server.start();

    console.log("✅ MCP server started successfully!");
    console.log("📡 Server running on port 3001");
    console.log("🌐 Web interface available at: http://localhost:3001");
    console.log("🔧 Available resources:", server.getAvailableResources());
    console.log("🛠️ Available tools:", server.getAvailableTools());
  } catch (error) {
    console.error("❌ Error starting MCP server:", error);
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down MCP server...");
  try {
    await server.stop();
    console.log("✅ Server stopped gracefully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error stopping server:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down MCP server...");
  try {
    await server.stop();
    console.log("✅ Server stopped gracefully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error stopping server:", error);
    process.exit(1);
  }
});

// Ejecutar el servidor
main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
