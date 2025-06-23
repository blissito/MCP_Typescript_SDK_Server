export interface MCPResourceContent {
  uri: string;
  text: string;
  mimeType: string;
}

export interface MCPResponse {
  contents: MCPResourceContent[];
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

// Tipos para MCP
export interface MCPResourceContent {
  uri: string;
  text: string;
  mimeType: string;
}

export interface MCPResponse {
  contents: MCPResourceContent[];
  error?: string;
}
