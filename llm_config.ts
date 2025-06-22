import { LLMConfig } from "./llm_rest_client.js";

// Configuraciones predefinidas para diferentes proveedores de LLM
export const LLMConfigs = {
  // OpenAI
  openai: (apiKey: string): LLMConfig => ({
    apiUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: apiKey,
    model: "gpt-3.5-turbo",
  }),

  // Anthropic (Claude)
  anthropic: (apiKey: string): LLMConfig => ({
    apiUrl: "https://api.anthropic.com/v1/messages",
    apiKey: apiKey,
    model: "claude-3-sonnet-20240229",
  }),

  // Ollama (local)
  ollama: (model: string = "phi4:14b"): LLMConfig => ({
    apiUrl: "http://localhost:11434/api/chat",
    model: model,
  }),

  // Custom API
  custom: (url: string, model: string, apiKey?: string): LLMConfig => ({
    apiUrl: url,
    apiKey: apiKey,
    model: model,
  }),
};

// Configuración por defecto (usar variables de entorno)
export const getDefaultConfig = (): LLMConfig => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  const model = process.env.LLM_MODEL || "gpt-3.5-turbo";

  if (process.env.ANTHROPIC_API_KEY) {
    return LLMConfigs.anthropic(process.env.ANTHROPIC_API_KEY);
  } else if (process.env.OPENAI_API_KEY) {
    return LLMConfigs.openai(process.env.OPENAI_API_KEY);
  } else if (process.env.OLLAMA_HOST) {
    return LLMConfigs.ollama(model);
  } else {
    throw new Error(`
      No se encontró configuración de LLM. 
      
      Opciones:
      1. Establece OPENAI_API_KEY para usar OpenAI
      2. Establece ANTHROPIC_API_KEY para usar Claude
      3. Establece OLLAMA_HOST para usar Ollama local
      4. Usa una configuración personalizada
      
      Ejemplo:
      export OPENAI_API_KEY="tu-api-key"
      npm run llm
    `);
  }
};
