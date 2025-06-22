'use strict';

var react = require('react');
var index_js = require('@modelcontextprotocol/sdk/client/index.js');
var stdio_js = require('@modelcontextprotocol/sdk/client/stdio.js');

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
  const [client, setClient] = react.useState(null);
  const [isConnected, setIsConnected] = react.useState(false);
  const [loading, setLoading] = react.useState(false);
  react.useEffect(() => {
    const initClient = async () => {
      const mcpClient = new index_js.Client({
        name: "react-mcp-client",
        version: "1.0.0"
      });
      const transport = new stdio_js.StdioClientTransport({
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

exports.LLMClient = LLMClient;
exports.createAnthropicClient = createAnthropicClient;
exports.createOllamaClient = createOllamaClient;
exports.createOpenAIClient = createOpenAIClient;
exports.useMCP = useMCP;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map