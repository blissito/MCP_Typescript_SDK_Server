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

// Tipos para LLMRestClient
export interface LLMConfig {
  apiUrl: string;
  apiKey?: string;
  model?: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}
