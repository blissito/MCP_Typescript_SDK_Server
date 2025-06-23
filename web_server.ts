import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { WebSocketServer } from "ws";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const PORT = 3001;

export class MCPWebServer {
  static start() {
    return new MCPWebServer();
  }
  private server: any;
  private wss: WebSocketServer;
  private mcpClient: Client | null = null;
  private mcpTransport: StdioClientTransport | null = null;

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.server });
    this.init();
  }

  private init() {
    console.log(`🚀 Servidor web iniciado en puerto ${PORT}`);
    console.log(`📱 Cliente web disponible en: http://localhost:${PORT}`);

    this.wss.on("connection", (ws) => {
      console.log("🔌 Cliente web conectado");

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleMessage(ws, data);
        } catch (error) {
          console.error("Error procesando mensaje:", error);
          ws.send(
            JSON.stringify({
              type: "error",
              message:
                error instanceof Error ? error.message : "Error desconocido",
            })
          );
        }
      });

      ws.on("close", () => {
        console.log("🔌 Cliente web desconectado");
      });
    });

    this.server.listen(PORT);
  }

  private handleRequest(req: any, res: any) {
    if (req.url === "/" || req.url === "/index.html") {
      try {
        const htmlPath = join(process.cwd(), "web_client.html");
        const html = readFileSync(htmlPath, "utf8");

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error cargando el archivo HTML");
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }

  private async handleMessage(ws: any, data: any) {
    switch (data.type) {
      case "connect":
        await this.connectToMCPServer(ws);
        break;
      case "disconnect":
        await this.disconnectFromMCPServer(ws);
        break;
      case "readResource":
        await this.readResource(ws, data.uri);
        break;
      case "callTool":
        await this.callTool(ws, data.name);
        break;
      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: `Tipo de mensaje desconocido: ${data.type}`,
          })
        );
    }
  }

  private async connectToMCPServer(ws: any) {
    try {
      console.log("🔄 Conectando al servidor MCP...");

      // Crear cliente MCP
      this.mcpClient = new Client({
        name: "web-proxy-client",
        version: "1.0.0",
      });

      // Crear transporte stdio que ejecutará nuestro servidor
      this.mcpTransport = new StdioClientTransport({
        command: "npx",
        args: ["tsx", "mcp_server.ts"],
      });

      // Conectar al servidor MCP
      await this.mcpClient.connect(this.mcpTransport);

      console.log("✅ Conectado al servidor MCP");

      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Conectado exitosamente al servidor MCP",
        })
      );
    } catch (error) {
      console.error("❌ Error conectando al servidor MCP:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Error de conexión: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        })
      );
    }
  }

  private async disconnectFromMCPServer(ws: any) {
    try {
      if (this.mcpClient) {
        await this.mcpClient.close();
        this.mcpClient = null;
        this.mcpTransport = null;
        console.log("🔌 Desconectado del servidor MCP");
      }

      ws.send(
        JSON.stringify({
          type: "disconnected",
          message: "Desconectado del servidor MCP",
        })
      );
    } catch (error) {
      console.error("❌ Error desconectando del servidor MCP:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Error de desconexión: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        })
      );
    }
  }

  private async readResource(ws: any, uri: string) {
    try {
      if (!this.mcpClient) {
        throw new Error("No conectado al servidor MCP");
      }

      console.log(`📖 Leyendo recurso: ${uri}`);
      const resource = await this.mcpClient.readResource({ uri });

      ws.send(
        JSON.stringify({
          type: "resourceRead",
          data: resource,
        })
      );
    } catch (error) {
      console.error("❌ Error leyendo recurso:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Error leyendo recurso: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        })
      );
    }
  }

  private async callTool(ws: any, name: string) {
    try {
      if (!this.mcpClient) {
        throw new Error("No conectado al servidor MCP");
      }

      console.log(`🛠️ Llamando herramienta: ${name}`);
      const result = await this.mcpClient.callTool({ name });

      ws.send(
        JSON.stringify({
          type: "toolCalled",
          data: result,
        })
      );
    } catch (error) {
      console.error("❌ Error llamando herramienta:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Error llamando herramienta: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        })
      );
    }
  }
}

// Iniciar el servidor web
new MCPWebServer();
