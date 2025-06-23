/**
 * Hook personalizado para conectar React con el servidor MCP
 *
 * Requisitos:
 * - React instalado: npm install react
 * - MCP SDK instalado: npm install @modelcontextprotocol/sdk
 * - Servidor MCP corriendo: npm start
 */

import { useState, useEffect } from "react";
import { MCPHttpClient } from "./http_client";
import type { MCPResponse, MCPStatus, MCPHookResult } from "../types";

// Los tipos MCPResponse, MCPStatus y MCPHookResult se importan desde types.ts

export function useMCP(): MCPHookResult {
  const [client, setClient] = useState<MCPHttpClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      try {
        const httpClient = new MCPHttpClient();
        setClient(httpClient);
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
        // No necesitamos desconectar el cliente HTTP
        setIsConnected(false);
      }
    };
  }, []);

  const readResource = async (uri: string): Promise<MCPResponse> => {
    if (!client) throw new Error("MCP client not connected");

    setLoading(true);
    try {
      return await client.readResource(uri);
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

  const processQuery = async (query: string): Promise<MCPResponse> => {
    if (!client) throw new Error("MCP client not connected");

    setLoading(true);
    try {
      return await client.processQuery(query);
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

  const callTool = async (name: string): Promise<MCPResponse> => {
    if (!client) throw new Error("MCP client not connected");

    setLoading(true);
    try {
      return await client.callTool(name);
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

  const getStatus = () => ({
    isConnected,
    loading,
    client: isConnected ? "connected" : "disconnected"
  });

  const disconnect = async () => {
    setIsConnected(false);
  };

  return {
    isConnected,
    loading,
    readResource,
    callTool,
    processQuery,
    getStatus,
    disconnect
  };
}
