// src/client.ts
var LLMClient = class {
  config;
  constructor(config) {
    this.config = config;
  }
  async chat(messages) {
    const headers = {
      "Content-Type": "application/json",
      ...this.config.headers
    };
    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }
    const response = await fetch(this.config.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};
var createOllamaClient = (model = "llama3.2:3b") => {
  return new LLMClient({
    url: "http://localhost:11434/api/chat",
    model
  });
};
var createOpenAIClient = (apiKey, model = "gpt-3.5-turbo") => {
  return new LLMClient({
    url: "https://api.openai.com/v1/chat/completions",
    model,
    apiKey
  });
};
var createAnthropicClient = (apiKey, model = "claude-3-sonnet-20240229") => {
  return new LLMClient({
    url: "https://api.anthropic.com/v1/messages",
    model,
    apiKey,
    headers: {
      "anthropic-version": "2023-06-01"
    }
  });
};

export { LLMClient, createAnthropicClient, createOllamaClient, createOpenAIClient };
//# sourceMappingURL=client.js.map
//# sourceMappingURL=client.js.map