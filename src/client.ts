import type { LLMConfig } from "./types";

export class LLMClient {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const url = this.config.apiUrl || this.config.url;
    if (!url) {
      throw new Error("URL de la API no especificada");
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Pre-configured clients for common providers
export const createOllamaClient = (model = "llama3.2:3b") => {
  return new LLMClient({
    apiUrl: "http://localhost:11434/api/chat",
    model,
  });
};

export const createOpenAIClient = (apiKey: string, model = "gpt-3.5-turbo") => {
  return new LLMClient({
    apiUrl: "https://api.openai.com/v1/chat/completions",
    model,
    apiKey,
  });
};

export const createAnthropicClient = (
  apiKey: string,
  model = "claude-3-sonnet-20240229"
) => {
  return new LLMClient({
    url: "https://api.anthropic.com/v1/messages",
    model,
    apiKey,
    headers: {
      "anthropic-version": "2023-06-01",
    },
  });
};
