import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn } from "child_process";

// Skip integration tests by default unless INTEGRATION_TESTS=true
const shouldRunIntegrationTests = process.env.INTEGRATION_TESTS === "true";

describe("MCP Server Integration Tests", () => {
  let mcpServerProcess: any;
  let webServerProcess: any;
  let mcpServerPort = 3001;
  let webServerPort = 3000;

  // Helper function to wait for server to be ready
  const waitForServer = async (
    port: number,
    timeout = 15000
  ): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(`http://localhost:${port}/`);
        if (response.ok) {
          return true;
        }
      } catch (error) {
        // Server not ready yet, continue waiting
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
  };

  // Helper function to make HTTP requests
  const makeRequest = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      return { status: 0, error: error.message };
    }
  };

  // Helper function to kill processes
  const killProcess = async (process: any) => {
    if (process && !process.killed) {
      process.kill("SIGTERM");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  beforeAll(async () => {
    if (!shouldRunIntegrationTests) {
      console.log(
        "⏭️ Skipping integration tests. Set INTEGRATION_TESTS=true to run them."
      );
      return;
    }

    console.log("🚀 Starting integration tests...");

    try {
      // Kill any existing processes on our ports
      await new Promise((resolve) => {
        const { exec } = require("child_process");
        exec('pkill -f "tsx.*server"', () => resolve(undefined));
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Start MCP server
      console.log("📡 Starting MCP server...");
      mcpServerProcess = spawn("npx", ["tsx", "server.ts"], {
        stdio: "pipe",
        detached: false,
        env: { ...process.env, NODE_ENV: "test" },
      });

      // Wait for MCP server to be ready
      console.log("⏳ Waiting for MCP server...");
      const mcpReady = await waitForServer(mcpServerPort);
      if (!mcpReady) {
        throw new Error("MCP server failed to start");
      }
      console.log("✅ MCP server ready");

      // Start web server
      console.log("🌐 Starting web server...");
      webServerProcess = spawn("npx", ["tsx", "web_server.ts"], {
        stdio: "pipe",
        detached: false,
        env: { ...process.env, NODE_ENV: "test" },
      });

      // Wait for web server to be ready
      console.log("⏳ Waiting for web server...");
      const webReady = await waitForServer(webServerPort);
      if (!webReady) {
        throw new Error("Web server failed to start");
      }
      console.log("✅ Web server ready");

      console.log("✅ Both servers started successfully");
    } catch (error) {
      console.error("❌ Failed to start servers:", error);
      await killProcess(mcpServerProcess);
      await killProcess(webServerProcess);
      throw error;
    }
  }, 60000);

  afterAll(async () => {
    if (!shouldRunIntegrationTests) return;

    console.log("🛑 Shutting down servers...");

    // Cleanup: kill both processes
    await killProcess(mcpServerProcess);
    await killProcess(webServerProcess);

    console.log("✅ Servers shut down");
  });

  describe("MCP Server (Port 3001)", () => {
    it("should start and respond to health check", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(`http://localhost:${mcpServerPort}/`);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("message");
      expect(result.data).toHaveProperty("timestamp");
      expect(result.data).toHaveProperty("test");
      expect(result.data.message).toBe("Servidor MCP funcionando");
      expect(result.data.test).toBe(true);
    });

    it("should read resources correctly", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(
        `http://localhost:${mcpServerPort}/resource?uri=file:///hello.txt`
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("success");
      expect(result.data.success).toBe(true);
      expect(result.data).toHaveProperty("data");
      expect(result.data.data).toHaveProperty("content");
      expect(result.data.data).toHaveProperty("mimeType");
      expect(result.data.data.mimeType).toBe("text/plain");
      expect(typeof result.data.data.content).toBe("string");
      expect(result.data.data.content.length).toBeGreaterThan(0);
    });

    it("should execute tools correctly", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(
        `http://localhost:${mcpServerPort}/tool`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tool: "tool-pelusear",
          }),
        }
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("success");
      expect(result.data.success).toBe(true);
      expect(result.data).toHaveProperty("data");
      expect(result.data.data).toHaveProperty("result");
      expect(result.data.data.result).toHaveProperty("message");
      expect(result.data.data.result.message).toContain("¡Has sido peluseado!");
      expect(result.data.data.result).toHaveProperty("timestamp");
    });

    it("should process LLM queries", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(
        `http://localhost:${mcpServerPort}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: "¿Qué hora es?",
          }),
        }
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("success");
      expect(result.data.success).toBe(true);
      expect(result.data).toHaveProperty("data");
      expect(result.data.data).toHaveProperty("content");
      expect(Array.isArray(result.data.data.content)).toBe(true);
      expect(result.data.data.content.length).toBeGreaterThan(0);
      expect(result.data.data.content[0]).toHaveProperty("type");
      expect(result.data.data.content[0]).toHaveProperty("text");
      expect(result.data.data.content[0].type).toBe("text");
      expect(typeof result.data.data.content[0].text).toBe("string");
    });

    it("should handle invalid resource requests", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(
        `http://localhost:${mcpServerPort}/resource?uri=file:///nonexistent.txt`
      );

      // Should return an error response
      expect(result.status).toBe(200); // fixtergeek-mcp-server returns 200 with error in body
      expect(result.data).toHaveProperty("success");
      expect(result.data.success).toBe(false);
    });

    it("should handle invalid tool requests", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const result = await makeRequest(
        `http://localhost:${mcpServerPort}/tool`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tool: "nonexistent-tool",
          }),
        }
      );

      // Should return an error response
      expect(result.status).toBe(200); // fixtergeek-mcp-server returns 200 with error in body
      expect(result.data).toHaveProperty("success");
      expect(result.data.success).toBe(false);
    });
  });

  describe("Web Server (Port 3000)", () => {
    it("should serve the web client HTML", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const response = await fetch(`http://localhost:${webServerPort}/`);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("MCP Web Client");
      expect(html).toContain("fixtergeek-mcp-server");
    });

    it("should handle 404 for unknown routes", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      const response = await fetch(
        `http://localhost:${webServerPort}/nonexistent`
      );

      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe("Not Found");
    });
  });

  describe("WebSocket Communication", () => {
    it("should establish WebSocket connection", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const WebSocket = require("ws");
        const ws = new WebSocket(`ws://localhost:${webServerPort}`);

        ws.on("open", () => {
          expect(ws.readyState).toBe(WebSocket.OPEN);
          ws.close();
          resolve();
        });

        ws.on("error", (error: any) => {
          reject(error);
        });

        // Timeout after 5 seconds
        setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
        }, 5000);
      });
    });

    it("should handle connection message", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const WebSocket = require("ws");
        const ws = new WebSocket(`ws://localhost:${webServerPort}`);

        ws.on("open", () => {
          ws.send(JSON.stringify({ type: "connect" }));
        });

        ws.on("message", (data: any) => {
          try {
            const message = JSON.parse(data.toString());
            expect(message).toHaveProperty("type");

            if (message.type === "connected") {
              expect(message).toHaveProperty("message");
              expect(message.message).toContain("Conectado exitosamente");
              ws.close();
              resolve();
            } else if (message.type === "error") {
              reject(new Error(message.message));
            }
          } catch (error) {
            reject(error);
          }
        });

        ws.on("error", (error: any) => {
          reject(error);
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error("WebSocket message timeout"));
        }, 10000);
      });
    });
  });

  describe("End-to-End Functionality", () => {
    it("should handle complete workflow: connect -> read resource -> call tool -> query LLM", async () => {
      if (!shouldRunIntegrationTests) {
        console.log("⏭️ Skipping integration test");
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const WebSocket = require("ws");
        const ws = new WebSocket(`ws://localhost:${webServerPort}`);
        let step = 0;

        ws.on("open", () => {
          // Step 1: Connect
          ws.send(JSON.stringify({ type: "connect" }));
        });

        ws.on("message", (data: any) => {
          try {
            const message = JSON.parse(data.toString());

            switch (step) {
              case 0: // Connect
                if (message.type === "connected") {
                  step = 1;
                  ws.send(
                    JSON.stringify({
                      type: "readResource",
                      uri: "file:///hello.txt",
                    })
                  );
                }
                break;

              case 1: // Read resource
                if (message.type === "resourceRead") {
                  expect(message.data).toHaveProperty("success");
                  expect(message.data.success).toBe(true);
                  step = 2;
                  ws.send(
                    JSON.stringify({
                      type: "callTool",
                      name: "tool-pelusear",
                    })
                  );
                }
                break;

              case 2: // Call tool
                if (message.type === "toolCalled") {
                  expect(message.data).toHaveProperty("success");
                  expect(message.data.success).toBe(true);
                  step = 3;
                  ws.send(
                    JSON.stringify({
                      type: "processQuery",
                      query: "¿Qué hora es?",
                    })
                  );
                }
                break;

              case 3: // Query LLM
                if (message.type === "queryProcessed") {
                  expect(message.data).toHaveProperty("success");
                  expect(message.data.success).toBe(true);
                  ws.close();
                  resolve();
                }
                break;
            }

            if (message.type === "error") {
              reject(new Error(message.message));
            }
          } catch (error) {
            reject(error);
          }
        });

        ws.on("error", (error: any) => {
          reject(error);
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          reject(new Error("End-to-end workflow timeout"));
        }, 30000);
      });
    });
  });
});
