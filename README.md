# Blissmo's MCP Server Experiment

Un servidor simple de Model Context Protocol (MCP) creado con TypeScript.

## Instalación

```bash
npm install
```

## Uso

### Ejecutar el servidor

```bash
npm start
```

O en modo desarrollo (con watch):

```bash
npm run dev
```

### Cliente Web

Para usar el cliente web interactivo:

```bash
npm run web
```

Luego abre tu navegador en: http://localhost:3001

El cliente web te permite:

- Conectar/desconectar del servidor MCP
- Leer recursos (como `file:///hello.txt`)
- Ejecutar herramientas (como `tool-pelusear`)

### Cliente LLM REST API

Para conectar tu LLM REST API con el servidor MCP:

```bash
# Configurar API key
export OPENAI_API_KEY="tu-api-key"
# o
export ANTHROPIC_API_KEY="tu-api-key"

# Ejecutar cliente LLM
npm run llm
```

#### Configuración para diferentes proveedores:

**OpenAI:**

```bash
export OPENAI_API_KEY="sk-..."
npm run llm
```

**Anthropic (Claude):**

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm run llm
```

**Ollama (local):**

```bash
export OLLAMA_HOST="http://localhost:11434"
npm run llm
```

**API personalizada:**

```typescript
import { LLMRestClient } from "./llm_rest_client.js";
import { LLMConfigs } from "./llm_config.js";

const config = LLMConfigs.custom(
  "https://tu-api.com/v1/chat",
  "tu-modelo",
  "tu-api-key"
);

const client = new LLMRestClient(config);
```

#### Flujo del LLM REST API:

1. **Usuario hace consulta** → "Lee el archivo y ejecuta la herramienta"
2. **LLM analiza** → Decide qué acciones necesita
3. **MCP ejecuta** → Lee recursos y ejecuta herramientas
4. **LLM responde** → Genera respuesta final con resultados

### Estructura del servidor

El servidor incluye:

1. **Recurso**: `file:///hello.txt` - Devuelve "Hello, World!"
2. **Herramienta**: `tool-pelusear` - Devuelve "¡Has sido peluseado! 🐶"

### Crear un cliente para probar

Crea un archivo `mcp_client.ts`:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
  name: "example-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "npm",
  args: ["start"],
});

async function main() {
  await client.connect(transport);

  // Leer recurso
  const resource = await client.readResource({
    uri: "file:///hello.txt",
  });
  console.log("Resource:", resource.contents[0].text);

  // Llamar herramienta
  const result = await client.callTool({
    name: "tool-pelusear",
  });
  console.log("Tool result:", result.content[0].text);
}

main().catch(console.error);
```

## Testing

Ejecutar los tests de integración:

```bash
npm test
```

Los tests verifican que:

- El servidor se inicia correctamente
- Los recursos se pueden leer
- Las herramientas se pueden ejecutar

## Características

- ✅ Servidor MCP básico
- ✅ Recurso de texto simple
- ✅ Herramienta simple
- ✅ Transporte stdio
- ✅ TypeScript completo
- ✅ Manejo de errores
- ✅ Cliente web interactivo
- ✅ Cliente LLM REST API
- ✅ Tests de integración
- ✅ WebSocket proxy
- ✅ Soporte para múltiples proveedores LLM

## Próximos pasos

- Agregar más recursos (archivos, APIs, etc.)
- Implementar herramientas más complejas
- Agregar autenticación
- Mejorar la interfaz web
- Agregar más tests
- Integrar con más proveedores LLM
