export interface MCPResponse {
  type: "resource" | "tool";
  content: string;
  error?: string;
}

export class MCPHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async readResource(uri: string): Promise<MCPResponse> {
    try {
      const response = await this.request<MCPResponse>(`/resource`, 'POST', { uri });
      return response;
    } catch (error) {
      return {
        type: "resource",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async callTool(name: string): Promise<MCPResponse> {
    try {
      const response = await this.request<MCPResponse>(`/tool`, 'POST', { name });
      return response;
    } catch (error) {
      return {
        type: "tool",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async processQuery(query: string): Promise<MCPResponse> {
    try {
      const response = await this.request<MCPResponse>(`/query`, 'POST', { query });
      return response;
    } catch (error) {
      return {
        type: "tool",
        content: "",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
