import { beforeAll, afterAll, vi } from "vitest";

// Global test setup
beforeAll(async () => {
  // Set up any global test configuration
  process.env.NODE_ENV = "test";
});

afterAll(async () => {
  // Clean up any global test resources
  // Kill any remaining processes
  const { exec } = require("child_process");

  // Kill any processes that might be using our test ports
  exec('pkill -f "tsx.*server"', (error: any) => {
    if (error) {
      // Ignore errors - processes might not exist
    }
  });
});

// Global fetch mock for tests that don't need real HTTP
if (!global.fetch) {
  global.fetch = require("node-fetch");
}

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});
