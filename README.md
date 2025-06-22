# MCP Server Experiment

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

### Estructura del servidor

El servidor incluye:

1. **Recurso**: `file:///hello.txt` - Devuelve "Hello, World!"
2. **Herramienta**: `hello` - Devuelve "Hello from MCP server!"

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
    name: "hello",
  });
  console.log("Tool result:", result.content[0].text);
}

main().catch(console.error);
```

## Características

- ✅ Servidor MCP básico
- ✅ Recurso de texto simple
- ✅ Herramienta simple
- ✅ Transporte stdio
- ✅ TypeScript completo
- ✅ Manejo de errores

## Próximos pasos

- Agregar más recursos (archivos, APIs, etc.)
- Implementar herramientas más complejas
- Agregar autenticación
- Crear un cliente web
