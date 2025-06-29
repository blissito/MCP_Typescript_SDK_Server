import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { LLMConfig, LLMResponse, MCPResponse } from "./types";

// Cliente que conecta LLM REST API con MCP Server
class LLMRestClient {
  private mcpClient: Client;
  private transport: StdioClientTransport;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;

    this.mcpClient = new Client({
      name: "llm-rest-client",
      version: "1.0.0",
    });

    this.transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "mcp_server.ts"],
    });
  }

  async connect() {
    await this.mcpClient.connect(this.transport);
    console.log("🤖 LLM REST Client conectado al servidor MCP");
  }

  async disconnect() {
    await this.mcpClient.close();
    console.log("🔌 LLM REST Client desconectado del servidor MCP");
  }

  // Enviar prompt al LLM REST API
  private async callLLM(prompt: string): Promise<LLMResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const body = {
      model: this.config.model || "phi4:14b",
      messages: [
        {
          role: "system",
          content: `Eres un asistente que puede acceder a recursos y ejecutar herramientas a través de un servidor MCP. 
          
          Cuando el usuario te pida algo, analiza si necesitas:
          1. Leer un recurso (archivo, API, etc.)
          2. Ejecutar una herramienta
          3. Ambas cosas
          
          Responde de forma natural y amigable, explicando qué vas a hacer antes de hacerlo.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false, // Forzar no-streaming para compatibilidad
    };

    try {
      const url = this.config.apiUrl || this.config.url;
    if (!url) {
      throw new Error("URL de la API no especificada");
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw LLM Response:", data); // Debug log

      // Manejar diferentes formatos de respuesta
      if (data.choices && Array.isArray(data.choices) && data.choices[0] && data.choices[0].message) {
        // Formato OpenAI/Anthropic
        const content = data.choices[0].message.content || "";
        return {
          content: typeof content === 'string' ? content : JSON.stringify(content),
          usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 },
        };
      } else if (data.message && typeof data.message === 'object' && data.message.content !== undefined) {
        // Formato Ollama no-streaming
        const content = data.message.content;
        return {
          content: typeof content === 'string' ? content : JSON.stringify(content),
          usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 },
        };
      } else if (typeof data === 'string') {
        // Respuesta directa como string
        return {
          content: data,
          usage: { prompt_tokens: 0, completion_tokens: 0 },
        };
      } else {
        // Si no reconocemos el formato, intentamos convertir a string
        try {
          return {
            content: JSON.stringify(data),
            usage: { prompt_tokens: 0, completion_tokens: 0 },
          };
        } catch {
          throw new Error("Error al procesar la respuesta del LLM");
        }
      }
    } catch (error) {
      console.error("Error calling LLM API:", error);
      throw error;
    }
  }

  // Procesar consulta del usuario con LLM + MCP
  async processUserQuery(userQuery: string) {
    console.log(`\n👤 Usuario: "${userQuery}"`);

    try {
      // 1. Enviar consulta al LLM para que analice qué necesita hacer
      const llmResponse = await this.callLLM(userQuery);
      console.log(`🤖 LLM: "${llmResponse.content}"`);

      // 2. Analizar la respuesta del LLM para determinar acciones
      const actions = this.analyzeLLMResponse(llmResponse.content);

      // 3. Ejecutar las acciones necesarias
      const results = await this.executeActions(actions);

      // 4. Enviar resultados de vuelta al LLM para que genere respuesta final
      const finalPrompt = `
        El usuario preguntó: "${userQuery}"
        
        Tu respuesta inicial fue: "${llmResponse.content}"
        
        He ejecutado las siguientes acciones:
        ${results.map((r) => `- ${r.action}: ${r.result}`).join("\n")}
        
        Ahora genera una respuesta final para el usuario basada en estos resultados.
      `;

      const finalResponse = await this.callLLM(finalPrompt);
      console.log(`🤖 LLM (respuesta final): "${finalResponse.content}"`);

      return finalResponse.content;
    } catch (error) {
      console.error("Error procesando consulta:", error);
      return `Lo siento, hubo un error procesando tu consulta: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`;
    }
  }

  // Analizar respuesta del LLM para determinar acciones
  private analyzeLLMResponse(llmResponse: string): string[] {
    const actions: string[] = [];
    const response = llmResponse.toLowerCase();

    if (
      response.includes("leer") ||
      response.includes("archivo") ||
      response.includes("contenido")
    ) {
      actions.push("read_resource");
    }

    if (
      response.includes("pelusear") ||
      response.includes("herramienta") ||
      response.includes("ejecutar")
    ) {
      actions.push("call_tool");
    }

    // Si no detecta acciones específicas, intentar ambas
    if (actions.length === 0) {
      actions.push("read_resource", "call_tool");
    }

    return actions;
  }

  // Ejecutar las acciones determinadas
  public async executeActions(
    actions: string[]
  ): Promise<Array<{ action: string; result: string }>> {
    const results: Array<{ action: string; result: string }> = [];

    for (const action of actions) {
      try {
        switch (action) {
          case "read_resource":
            const resource = await this.readResource("file:///hello.txt");
            results.push({
              action: "Leer archivo hello.txt",
              result: resource.content as any,
            });
            break;

          case "call_tool":
            const toolResult = await this.callTool("tool-pelusear");
            results.push({
              action: "Ejecutar herramienta tool-pelusear",
              result: toolResult.content.trim(),
            });
            break;
        }
      } catch (error) {
        results.push({
          action: action,
          result: `Error: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        });
      }
    }

    return results;
  }

  // Leer un recurso MCP
  public async readResource(uri: string): Promise<MCPResponse> {
    const resource = await this.mcpClient.readResource({ uri });
    const contents = resource.contents || [];
    const content = contents[0]?.text || "";
    return {
      type: "resource",
      content: String(content) // Convertir explícitamente a string
    };
  }

  // Ejecutar una herramienta MCP
  public async callTool(name: string): Promise<MCPResponse> {
    const toolResult = await this.mcpClient.callTool({ name });
    const toolContent = (toolResult.content as Array<{
      type: string;
      text: any;
    }> || []).map(item => ({
      type: item.type,
      text: String(item.text || "")
    }));
    const toolText = toolContent[0]?.text || "";
    return {
      type: "tool",
      content: String(toolText.trim()) // Convertir explícitamente a string
    };
  }
}

// Configuración para diferentes proveedores de LLM
export const LLMProviders = {
  // OpenAI
  openai: {
    apiUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
  },

  // Anthropic (Claude)
  anthropic: {
    apiUrl: "https://api.anthropic.com/v1/messages",
    model: "claude-3-sonnet-20240229",
  },

  // Ollama (local)
  ollama: {
    apiUrl: "http://localhost:11434/api/chat",
    model: "llama2",
  },

  // Custom API
  custom: (url: string, model: string) => ({
    apiUrl: url,
    model: model,
  }),
};

export { LLMRestClient };
export type { LLMConfig, LLMResponse };

// Tipos para el contenido de herramientas
interface ToolContent {
  type: string;
  text: string;
}
