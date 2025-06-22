/**
 * Hook personalizado para conectar React con el servidor MCP
 *
 * Requisitos:
 * - React instalado: npm install react
 * - MCP SDK instalado: npm install @modelcontextprotocol/sdk
 * - Servidor MCP corriendo: npm start
 */

import { useState, useEffect } from "react";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface MCPResponse {
  type: "resource" | "tool";
  content: string;
  error?: string;
}

interface MCPStatus {
  isConnected: boolean;
  loading: boolean;
  client: "connected" | "disconnected";
}

export function useMCP() {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      const mcpClient = new Client({
        name: "react-mcp-client",
        version: "1.0.0",
      });

      const transport = new StdioClientTransport({
        command: "npx",
        args: ["tsx", "mcp_server.ts"],
      });

      try {
        await mcpClient.connect(transport);
        setClient(mcpClient);
        setIsConnected(true);
        console.log("✅ MCP Client conectado desde React");
      } catch (error) {
        console.error("Error connecting to MCP server:", error);
        setIsConnected(false);
      }
    };

    initClient();

    return () => {
      if (client) {
        client.close();
        console.log("🔌 MCP Client desconectado desde React");
      }
    };
  }, []);

  const readResource = async (uri: string): Promise<MCPResponse> => {
    if (!client) throw new Error("MCP client not connected");

    setLoading(true);
    try {
      const resource = await client.readResource({ uri });
      return {
        type: "resource",
        content: resource.contents[0].text,
      };
    } catch (error) {
      return {
        type: "resource",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setLoading(false);
    }
  };

  const callTool = async (name: string): Promise<MCPResponse> => {
    if (!client) throw new Error("MCP client not connected");

    setLoading(true);
    try {
      const result = await client.callTool({ name });
      const content = result.content as Array<{ type: string; text: unknown }>;
      return {
        type: "tool",
        content: String(content[0].text).trim(),
      };
    } catch (error) {
      return {
        type: "tool",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (): MCPStatus => {
    return {
      isConnected,
      loading,
      client: client ? "connected" : "disconnected",
    };
  };

  const disconnect = async () => {
    if (client) {
      await client.close();
      setClient(null);
      setIsConnected(false);
      console.log("🔌 MCP Client desconectado manualmente");
    }
  };

  return {
    isConnected,
    loading,
    readResource,
    callTool,
    getStatus,
    disconnect,
  };
}
