import { describe, test, beforeAll, afterAll, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Definimos un tipo para el contenido de la herramienta para mayor claridad
type ToolContent = {
  type: string;
  text: string;
};

// Test de integración para mcp_server.ts

describe("MCP Server Integration Test", () => {
  let client: Client;
  let transport: StdioClientTransport;

  // Antes de todos los tests, creamos el cliente y el transporte
  beforeAll(async () => {
    // 1. Creamos el cliente MCP
    client = new Client({
      name: "integration-test-client",
      version: "1.0.0",
    });

    // 2. Creamos el transporte stdio, que ejecutará nuestro servidor
    transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "mcp_server.ts"],
    });

    // 3. Conectamos el cliente al servidor
    await client.connect(transport);
  }, 30000); // Aumentamos el timeout para dar tiempo a que el servidor inicie

  // Después de todos los tests, cerramos la conexión
  // El transporte se encargará de terminar el proceso del servidor
  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  // Test 1: Leer el recurso 'file:///hello.txt'
  test("should read the hello.txt resource from the server", async () => {
    const resource = await client.readResource({
      uri: "file:///hello.txt",
    });

    // Verificamos que el contenido es el esperado
    expect(resource).toBeDefined();
    expect(resource.contents).toHaveLength(1);
    expect(resource.contents[0].text).toBe("Hello, World!");
  });

  // Test 2: Llamar a la herramienta 'tool-pelusear'
  test("should call the tool-pelusear tool from the server", async () => {
    const result = await client.callTool({
      name: "tool-pelusear",
    });

    // Verificamos que la respuesta es la esperada
    const content = result.content as ToolContent[];
    expect(result).toBeDefined();
    expect(content).toHaveLength(1);
    expect(content[0].text).toBe("¡Has sido peluseado! 🐶\n");
  });
});
