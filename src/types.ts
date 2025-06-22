export interface MCPResponse {
  type: "resource" | "tool";
  content: string;
  error?: string;
}

export interface MCPConfig {
  name: string;
  version: string;
  command?: string;
  args?: string[];
}

export interface LLMConfig {
  url: string;
  model: string;
  apiKey?: string;
  headers?: Record<string, string>;
}
