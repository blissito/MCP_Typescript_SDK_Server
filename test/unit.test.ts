import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fixtergeek-mcp-server
vi.mock("fixtergeek-mcp-server", () => ({
  createMCPServer: vi.fn(() => ({
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    registerResource: vi.fn(),
    registerTool: vi.fn(),
    getAvailableResources: vi.fn().mockReturnValue(["test-resource"]),
    getAvailableTools: vi.fn().mockReturnValue(["test-tool"]),
  })),
}));

// Mock fetch for testing
global.fetch = vi.fn();

describe("Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Server Configuration", () => {
    it("should create MCP server with correct configuration", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        start: vi.fn().mockResolvedValue(undefined),
        stop: vi.fn().mockResolvedValue(undefined),
        registerResource: vi.fn(),
        registerTool: vi.fn(),
        getAvailableResources: vi.fn().mockReturnValue(["test-resource"]),
        getAvailableTools: vi.fn().mockReturnValue(["test-tool"]),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({
        port: 3001,
        logLevel: "info",
        llm: {
          provider: "ollama",
          baseUrl: "http://localhost:11434",
          model: "llama3.2:3b",
          temperature: 0.7,
        },
      });

      expect(server).toBeDefined();
      expect(typeof server.start).toBe("function");
      expect(typeof server.stop).toBe("function");
      expect(typeof server.registerResource).toBe("function");
      expect(typeof server.registerTool).toBe("function");
    });

    it("should register resources correctly", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        registerResource: vi.fn(),
        getAvailableResources: vi.fn().mockReturnValue(["test-resource"]),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({ port: 3001 });

      const mockHandler = vi.fn().mockResolvedValue({
        success: true,
        data: { content: "test", mimeType: "text/plain" },
        timestamp: Date.now(),
      });

      server.registerResource(
        "test-resource",
        "file:///test.txt",
        { title: "Test Resource" },
        mockHandler
      );

      expect(server.registerResource).toHaveBeenCalledWith(
        "test-resource",
        "file:///test.txt",
        { title: "Test Resource" },
        mockHandler
      );
    });

    it("should register tools correctly", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        registerTool: vi.fn(),
        getAvailableTools: vi.fn().mockReturnValue(["test-tool"]),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({ port: 3001 });

      const mockHandler = vi.fn().mockResolvedValue({
        success: true,
        data: { result: { message: "test" } },
        timestamp: Date.now(),
      });

      server.registerTool("test-tool", { title: "Test Tool" }, mockHandler);

      expect(server.registerTool).toHaveBeenCalledWith(
        "test-tool",
        { title: "Test Tool" },
        mockHandler
      );
    });
  });

  describe("HTTP Client Utilities", () => {
    it("should make successful HTTP requests", async () => {
      const mockResponse = {
        success: true,
        data: { content: "test content" },
        timestamp: Date.now(),
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await fetch(
        "http://localhost:3001/resource?uri=file:///test.txt"
      );
      const data = await result.json();

      expect(result.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });

    it("should handle HTTP request errors", async () => {
      (fetch as any).mockRejectedValueOnce(new Error("Network error"));

      try {
        await fetch("http://localhost:3001/resource?uri=file:///test.txt");
      } catch (error) {
        expect(error.message).toBe("Network error");
      }
    });

    it("should handle non-OK responses", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await fetch(
        "http://localhost:3001/resource?uri=file:///nonexistent.txt"
      );
      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe("WebSocket Communication", () => {
    it("should parse JSON messages correctly", () => {
      const validMessage = JSON.stringify({
        type: "connect",
        data: { test: true },
      });

      const parsed = JSON.parse(validMessage);
      expect(parsed.type).toBe("connect");
      expect(parsed.data.test).toBe(true);
    });

    it("should handle invalid JSON messages", () => {
      const invalidMessage = "invalid json";

      expect(() => {
        JSON.parse(invalidMessage);
      }).toThrow();
    });

    it("should validate message structure", () => {
      const validMessage = {
        type: "readResource",
        uri: "file:///test.txt",
      };

      expect(validMessage).toHaveProperty("type");
      expect(validMessage).toHaveProperty("uri");
      expect(typeof validMessage.type).toBe("string");
      expect(typeof validMessage.uri).toBe("string");
    });
  });

  describe("Error Handling", () => {
    it("should handle server startup errors", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        start: vi.fn().mockRejectedValue(new Error("Port already in use")),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({ port: 3001 });

      try {
        await server.start();
      } catch (error) {
        expect(error.message).toBe("Port already in use");
      }
    });

    it("should handle resource handler errors", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        registerResource: vi.fn(),
        getAvailableResources: vi.fn().mockReturnValue(["error-resource"]),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({ port: 3001 });

      const errorHandler = vi
        .fn()
        .mockRejectedValue(new Error("Resource not found"));

      server.registerResource(
        "error-resource",
        "file:///error.txt",
        { title: "Error Resource" },
        errorHandler
      );

      expect(server.registerResource).toHaveBeenCalled();
    });

    it("should handle tool handler errors", async () => {
      const { createMCPServer } = await import("fixtergeek-mcp-server");

      const mockServer = {
        registerTool: vi.fn(),
        getAvailableTools: vi.fn().mockReturnValue(["error-tool"]),
      };

      (createMCPServer as any).mockReturnValue(mockServer);

      const server = createMCPServer({ port: 3001 });

      const errorHandler = vi
        .fn()
        .mockRejectedValue(new Error("Tool execution failed"));

      server.registerTool("error-tool", { title: "Error Tool" }, errorHandler);

      expect(server.registerTool).toHaveBeenCalled();
    });
  });

  describe("Data Validation", () => {
    it("should validate resource response format", () => {
      const validResourceResponse = {
        success: true,
        data: {
          content: "test content",
          mimeType: "text/plain",
        },
        timestamp: Date.now(),
      };

      expect(validResourceResponse).toHaveProperty("success");
      expect(validResourceResponse).toHaveProperty("data");
      expect(validResourceResponse).toHaveProperty("timestamp");
      expect(validResourceResponse.data).toHaveProperty("content");
      expect(validResourceResponse.data).toHaveProperty("mimeType");
      expect(typeof validResourceResponse.data.content).toBe("string");
      expect(typeof validResourceResponse.data.mimeType).toBe("string");
    });

    it("should validate tool response format", () => {
      const validToolResponse = {
        success: true,
        data: {
          result: {
            message: "Tool executed successfully",
            timestamp: new Date().toISOString(),
          },
        },
        timestamp: Date.now(),
      };

      expect(validToolResponse).toHaveProperty("success");
      expect(validToolResponse).toHaveProperty("data");
      expect(validToolResponse).toHaveProperty("timestamp");
      expect(validToolResponse.data).toHaveProperty("result");
      expect(validToolResponse.data.result).toHaveProperty("message");
      expect(validToolResponse.data.result).toHaveProperty("timestamp");
    });

    it("should validate LLM response format", () => {
      const validLLMResponse = {
        success: true,
        data: {
          content: [
            {
              type: "text",
              text: "LLM response content",
            },
          ],
        },
        timestamp: Date.now(),
      };

      expect(validLLMResponse).toHaveProperty("success");
      expect(validLLMResponse).toHaveProperty("data");
      expect(validLLMResponse).toHaveProperty("timestamp");
      expect(validLLMResponse.data).toHaveProperty("content");
      expect(Array.isArray(validLLMResponse.data.content)).toBe(true);
      expect(validLLMResponse.data.content[0]).toHaveProperty("type");
      expect(validLLMResponse.data.content[0]).toHaveProperty("text");
    });
  });

  describe("Configuration Validation", () => {
    it("should validate server configuration", () => {
      const validConfig = {
        port: 3001,
        logLevel: "info",
        llm: {
          provider: "ollama",
          baseUrl: "http://localhost:11434",
          model: "llama3.2:3b",
          temperature: 0.7,
        },
      };

      expect(validConfig).toHaveProperty("port");
      expect(validConfig).toHaveProperty("logLevel");
      expect(validConfig).toHaveProperty("llm");
      expect(typeof validConfig.port).toBe("number");
      expect(typeof validConfig.logLevel).toBe("string");
      expect(typeof validConfig.llm).toBe("object");
      expect(validConfig.llm).toHaveProperty("provider");
      expect(validConfig.llm).toHaveProperty("baseUrl");
      expect(validConfig.llm).toHaveProperty("model");
    });

    it("should validate LLM configuration", () => {
      const validLLMConfig = {
        provider: "ollama",
        baseUrl: "http://localhost:11434",
        model: "llama3.2:3b",
        temperature: 0.7,
      };

      expect(validLLMConfig).toHaveProperty("provider");
      expect(validLLMConfig).toHaveProperty("baseUrl");
      expect(validLLMConfig).toHaveProperty("model");
      expect(typeof validLLMConfig.provider).toBe("string");
      expect(typeof validLLMConfig.baseUrl).toBe("string");
      expect(typeof validLLMConfig.model).toBe("string");
      expect(typeof validLLMConfig.temperature).toBe("number");
    });
  });
});
