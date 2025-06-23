import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { WebSocketServer } from "ws";

const PORT = 3000;
const MCP_SERVER_URL = "http://localhost:3001";

export class MCPWebServer {
  static start() {
    return new MCPWebServer();
  }
  private server: any;
  private wss: WebSocketServer;
  private isConnected: boolean = false;

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.server });
    this.init();
  }

  private init() {
    console.log(`🚀 Servidor web iniciado en puerto ${PORT}`);
    console.log(`📱 Cliente web disponible en: http://localhost:${PORT}`);
    console.log(`🔗 Conectando a MCP server en: ${MCP_SERVER_URL}`);

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
        await this.callTool(ws, data.name, data.params);
        break;
      case "processQuery":
        await this.processQuery(ws, data.query);
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

      // Verificar que el servidor MCP esté disponible
      const response = await fetch(`${MCP_SERVER_URL}/`);

      if (!response.ok) {
        throw new Error(`MCP server not available: ${response.status}`);
      }

      this.isConnected = true;
      console.log("✅ Conectado al servidor MCP");

      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Conectado exitosamente al servidor MCP",
        })
      );
    } catch (error) {
      console.error("❌ Error conectando al servidor MCP:", error);
      this.isConnected = false;
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
      this.isConnected = false;
      console.log("🔌 Desconectado del servidor MCP");

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
      if (!this.isConnected) {
        throw new Error("No conectado al servidor MCP");
      }

      console.log(`📖 Leyendo recurso: ${uri}`);

      const response = await fetch(
        `${MCP_SERVER_URL}/resource?uri=${encodeURIComponent(uri)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const resource = await response.json();

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

  private async callTool(ws: any, name: string, params?: any) {
    try {
      if (!this.isConnected) {
        throw new Error("No conectado al servidor MCP");
      }

      console.log(`🛠️ Llamando herramienta: ${name}`);

      const response = await fetch(`${MCP_SERVER_URL}/tool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: name,
          params: params || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const toolResult = await response.json();

      ws.send(
        JSON.stringify({
          type: "toolCalled",
          data: toolResult,
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

  private async processQuery(ws: any, query: string) {
    try {
      if (!this.isConnected) {
        throw new Error("No conectado al servidor MCP");
      }

      console.log(`🤖 Procesando consulta: ${query}`);

      const response = await fetch(`${MCP_SERVER_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const queryResult = await response.json();

      ws.send(
        JSON.stringify({
          type: "queryProcessed",
          data: queryResult,
        })
      );
    } catch (error) {
      console.error("❌ Error procesando consulta:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Error procesando consulta: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        })
      );
    }
  }
}

// Iniciar el servidor web
if (require.main === module) {
  MCPWebServer.start();
}
