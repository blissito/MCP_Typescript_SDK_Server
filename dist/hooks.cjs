'use strict';

var react = require('react');
var index_js = require('@modelcontextprotocol/sdk/client/index.js');
var stdio_js = require('@modelcontextprotocol/sdk/client/stdio.js');

// src/hooks/useMCP.ts
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

exports.useMCP = useMCP;
//# sourceMappingURL=hooks.cjs.map
//# sourceMappingURL=hooks.cjs.map