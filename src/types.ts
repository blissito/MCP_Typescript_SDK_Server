// Tipos para MCP
export interface MCPResourceContent {
  uri: string;
  text: string;
  mimeType: string;
}

// Tipo base para MCPResponse
export interface BaseMCPResponse {
  error?: string;
}

// Tipos específicos de respuesta
export interface ResourceMCPResponse extends BaseMCPResponse {
  type: "resource";
  content: string;
}

export interface ToolMCPResponse extends BaseMCPResponse {
  type: "tool";
  content: string;
}

// Unión de tipos para MCPResponse
export type MCPResponse = ResourceMCPResponse | ToolMCPResponse;

// Tipos para MCPConfig
export interface MCPConfig {
  name: string;
  version: string;
  command?: string;
  args?: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

// Tipos para LLMRestClient
export interface LLMConfig {
  // URL de la API (puede ser apiUrl o url)
  url?: string;
  apiUrl?: string;
  model?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}
