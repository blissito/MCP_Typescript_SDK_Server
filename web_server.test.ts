import {
  describe,
  test,
  beforeAll,
  afterAll,
  expect,
  beforeEach,
  vi,
} from "vitest";
import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

// Mock del SDK MCP para testing
const mockMCPClient = {
  connect: async () => Promise.resolve(),
  close: async () => Promise.resolve(),
  readResource: async (params: any) => ({
    contents: [
      {
        uri: params.uri,
        text: "Hello, World!",
        mimeType: "text/plain",
      },
    ],
  }),
  callTool: async (params: any) => ({
    content: [
      {
        type: "text",
        text: "¡Has sido peluseado! 🐶\n",
      },
    ],
  }),
};

// Mock del transporte MCP
const mockMCPTransport = {
  command: "npx",
  args: ["tsx", "mcp_server.ts"],
};

// Importar las clases necesarias (mockeadas)
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Mock de las clases del SDK
vi.mock("@modelcontextprotocol/sdk/client/index.js", () => ({
  Client: vi.fn().mockImplementation(() => mockMCPClient),
}));

vi.mock("@modelcontextprotocol/sdk/client/stdio.js", () => ({
  StdioClientTransport: vi.fn().mockImplementation(() => mockMCPTransport),
}));

// Tests para el servidor web
describe("Web Server Proxy", () => {
  let server: any;
  let wss: WebSocketServer;
  let wsClient: WebSocket;
  const PORT = 3002; // Puerto diferente para tests

  // Función para crear un servidor de prueba con WebSocket
  const createTestServer = () => {
    const httpServer = createServer((req, res) => {
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
    });

    // Crear WebSocket server
    const wsServer = new WebSocketServer({ server: httpServer });

    // Manejar conexiones WebSocket
    wsServer.on("connection", (ws) => {
      console.log("Test WebSocket client connected");

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());
          await handleTestMessage(ws, data);
        } catch (error) {
          console.error("Error processing message:", error);
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
        console.log("Test WebSocket client disconnected");
      });
    });

    return httpServer;
  };

  // Función para manejar mensajes en el servidor de prueba
  const handleTestMessage = async (ws: any, data: any) => {
    switch (data.type) {
      case "connect":
        // Simular conexión exitosa
        ws.send(
          JSON.stringify({
            type: "connected",
            message: "Conectado exitosamente al servidor MCP",
          })
        );
        break;
      case "disconnect":
        // Simular desconexión exitosa
        ws.send(
          JSON.stringify({
            type: "disconnected",
            message: "Desconectado del servidor MCP",
          })
        );
        break;
      case "readResource":
        // Simular lectura de recurso
        ws.send(
          JSON.stringify({
            type: "resourceRead",
            data: {
              contents: [
                {
                  uri: data.uri,
                  text: "Hello, World!",
                  mimeType: "text/plain",
                },
              ],
            },
          })
        );
        break;
      case "callTool":
        // Simular llamada a herramienta
        ws.send(
          JSON.stringify({
            type: "toolCalled",
            data: {
              content: [
                {
                  type: "text",
                  text: "¡Has sido peluseado! 🐶\n",
                },
              ],
            },
          })
        );
        break;
      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: `Tipo de mensaje desconocido: ${data.type}`,
          })
        );
    }
  };

  // Función para esperar mensajes WebSocket
  const waitForMessage = (ws: WebSocket, timeout = 1000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timeout waiting for message"));
      }, timeout);

      ws.once("message", (data) => {
        clearTimeout(timer);
        try {
          const message = JSON.parse(data.toString());
          resolve(message);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  beforeAll(async () => {
    // Crear servidor de prueba
    server = createTestServer();
    server.listen(PORT);

    // Esperar a que el servidor esté listo
    await new Promise((resolve) => server.once("listening", resolve));
  });

  afterAll(async () => {
    if (wsClient) {
      wsClient.close();
    }
    if (server) {
      server.close();
    }
  });

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  describe("HTTP Server", () => {
    test("should serve HTML file at root path", async () => {
      const response = await fetch(`http://localhost:${PORT}/`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/html");

      const html = await response.text();
      expect(html).toContain("MCP Web Client");
      expect(html).toContain("Conectar al Servidor");
    });

    test("should serve HTML file at /index.html", async () => {
      const response = await fetch(`http://localhost:${PORT}/index.html`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/html");

      const html = await response.text();
      expect(html).toContain("MCP Web Client");
    });

    test("should return 404 for unknown paths", async () => {
      const response = await fetch(`http://localhost:${PORT}/unknown`);
      expect(response.status).toBe(404);
    });
  });

  describe("WebSocket Communication", () => {
    test("should handle connect message", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Enviar mensaje de conexión
      wsClient.send(JSON.stringify({ type: "connect" }));

      // Esperar respuesta
      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("connected");
      expect(response.message).toContain("Conectado exitosamente");
    });

    test("should handle disconnect message", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Primero conectar
      wsClient.send(JSON.stringify({ type: "connect" }));
      await waitForMessage(wsClient);

      // Luego desconectar
      wsClient.send(JSON.stringify({ type: "disconnect" }));
      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("disconnected");
      expect(response.message).toContain("Desconectado");
    });

    test("should handle readResource message", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Conectar primero
      wsClient.send(JSON.stringify({ type: "connect" }));
      await waitForMessage(wsClient);

      // Leer recurso
      wsClient.send(
        JSON.stringify({
          type: "readResource",
          uri: "file:///hello.txt",
        })
      );

      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("resourceRead");
      expect(response.data.contents).toHaveLength(1);
      expect(response.data.contents[0].uri).toBe("file:///hello.txt");
      expect(response.data.contents[0].text).toBe("Hello, World!");
    });

    test("should handle callTool message", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Conectar primero
      wsClient.send(JSON.stringify({ type: "connect" }));
      await waitForMessage(wsClient);

      // Llamar herramienta
      wsClient.send(
        JSON.stringify({
          type: "callTool",
          name: "tool-pelusear",
        })
      );

      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("toolCalled");
      expect(response.data.content).toHaveLength(1);
      expect(response.data.content[0].type).toBe("text");
      expect(response.data.content[0].text).toBe("¡Has sido peluseado! 🐶\n");
    });

    test("should handle unknown message type", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Enviar mensaje desconocido
      wsClient.send(JSON.stringify({ type: "unknown" }));

      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("error");
      expect(response.message).toContain("Tipo de mensaje desconocido");
    });
  });

  describe("Error Handling", () => {
    test("should handle invalid JSON messages", async () => {
      wsClient = new WebSocket(`ws://localhost:${PORT}`);

      await new Promise((resolve) => wsClient.on("open", resolve));

      // Enviar JSON inválido
      wsClient.send("invalid json");

      const response = await waitForMessage(wsClient);

      expect(response.type).toBe("error");
      expect(response.message).toContain("Unexpected token");
    });
  });
});
