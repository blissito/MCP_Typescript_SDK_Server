/*
 * Model Context Protocol (MCP) SDK
 * 
 * Este paquete ofrece herramientas tanto para el cliente como para el servidor MCP.
 * Las herramientas principales son:
 * 
 * 1. Para el cliente (React/Node.js):
 * - useMCP: Hook React para conectar con el servidor MCP
 * - LLMRestClient: Cliente para interactuar con LLMs
 * - MCPHttpClient: Cliente HTTP para comunicarse con el servidor MCP
 * 
 * 2. Para el servidor:
 * - MCPWebServer: Servidor web que expone MCP via HTTP/WS
 * - LLMClient: Cliente base para LLMs
 * - createOllamaClient: Cliente pre-configurado para Ollama
 * - createOpenAIClient: Cliente pre-configurado para OpenAI
 */

// Client-side tools
// Exportar componentes principales
export { useMCP } from './hooks/useMCP';
export { MCPHttpClient } from './hooks/http_client';
export { MCPWebServer } from '../web_server';
export { LLMClient, createOllamaClient, createOpenAIClient } from './client';

// Exportar tipos
export type { MCPResponse, MCPStatus, MCPHookResult } from './types';
export type { LLMConfig, LLMResponse } from './llm_rest_client';
export type { MCPConfig } from './types';
