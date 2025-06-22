import { useState, useEffect } from 'react';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// src/client.ts
var LLMClient = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async chat(messages) {
    const headers = {
      "Content-Type": "application/json",
      ...this.config.headers
    };
    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }
    const response = await fetch(this.config.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};
var createOllamaClient = (model = "llama3.2:3b") => {
  return new LLMClient({
    url: "http://localhost:11434/api/chat",
    model
  });
};
var createOpenAIClient = (apiKey, model = "gpt-3.5-turbo") => {
  return new LLMClient({
    url: "https://api.openai.com/v1/chat/completions",
    model,
    apiKey
  });
};
var createAnthropicClient = (apiKey, model = "claude-3-sonnet-20240229") => {
  return new LLMClient({
    url: "https://api.anthropic.com/v1/messages",
    model,
    apiKey,
    headers: {
      "anthropic-version": "2023-06-01"
    }
  });
};
function useMCP() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const initClient = async () => {
      const mcpClient = new Client({
        name: "react-mcp-client",
        version: "1.0.0"
      });
      const transport = new StdioClientTransport({
        command: "npx",
        args: ["tsx", "mcp_server.ts"]
      });
      try {
        await mcpClient.connect(transport);
        setClient(mcpClient);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to MCP server:", error);
      }
    };
    initClient();
    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);
  const readResource = async (uri) => {
    if (!client) throw new Error("MCP client not connected");
    setLoading(true);
    try {
      const resource = await client.readResource({ uri });
      return {
        type: "resource",
        content: resource.contents[0].text
      };
    } catch (error) {
      return {
        type: "resource",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    } finally {
      setLoading(false);
    }
  };
  const callTool = async (name) => {
    if (!client) throw new Error("MCP client not connected");
    setLoading(true);
    try {
      const result = await client.callTool({ name });
      let toolText = "";
      if (Array.isArray(result.content) && result.content.length > 0) {
        const val = result.content[0].text;
        toolText = typeof val === "string" ? val : JSON.stringify(val ?? "");
      }
      return {
        type: "tool",
        content: toolText
      };
    } catch (error) {
      return {
        type: "tool",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    } finally {
      setLoading(false);
    }
  };
  return {
    isConnected,
    loading,
    readResource,
    callTool
  };
}

export { LLMClient, createAnthropicClient, createOllamaClient, createOpenAIClient, useMCP };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map