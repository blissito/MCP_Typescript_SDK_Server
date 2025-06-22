# useMCP Hook

Hook personalizado de React para conectar con el servidor MCP (Model Context Protocol).

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install react @types/react @modelcontextprotocol/sdk
```

### 2. Copiar el hook

Copia el archivo `useMCP.ts` a tu proyecto React:

```bash
mkdir hooks
cp useMCP.ts hooks/
```

### 3. Configurar TypeScript

Asegúrate de que tu `tsconfig.json` incluya:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 🚀 Uso Básico

```tsx
import React, { useState } from "react";
import { useMCP } from "./hooks/useMCP";

export function MCPExample() {
  const { isConnected, loading, readResource, callTool } = useMCP();
  const [resourceContent, setResourceContent] = useState("");
  const [toolResult, setToolResult] = useState("");

  const handleReadResource = async () => {
    const result = await readResource("file:///hello.txt");
    if (!result.error) {
      setResourceContent(result.content);
    }
  };

  const handleCallTool = async () => {
    const result = await callTool("tool-pelusear");
    if (!result.error) {
      setToolResult(result.content);
    }
  };

  return (
    <div>
      <div>Estado: {isConnected ? "✅ Conectado" : "🔌 Desconectado"}</div>
      <button onClick={handleReadResource} disabled={loading}>
        Leer Recurso
      </button>
      <button onClick={handleCallTool} disabled={loading}>
        Ejecutar Herramienta
      </button>

      {resourceContent && (
        <div>
          <h3>Contenido del recurso:</h3>
          <pre>{resourceContent}</pre>
        </div>
      )}

      {toolResult && (
        <div>
          <h3>Resultado de la herramienta:</h3>
          <pre>{toolResult}</pre>
        </div>
      )}
    </div>
  );
}
```

## 🔧 API del Hook

### Estados

- `isConnected: boolean` - Indica si está conectado al servidor MCP
- `loading: boolean` - Indica si hay una operación en curso

### Funciones

- `readResource(uri: string): Promise<MCPResponse>` - Lee un recurso
- `callTool(name: string): Promise<MCPResponse>` - Ejecuta una herramienta
- `getStatus(): MCPStatus` - Obtiene el estado actual
- `disconnect(): Promise<void>` - Desconecta del servidor

### Tipos

```typescript
interface MCPResponse {
  type: "resource" | "tool";
  content: string;
  error?: string;
}

interface MCPStatus {
  isConnected: boolean;
  loading: boolean;
  client: "connected" | "disconnected";
}
```

## 🎯 Ejemplos de Uso

### Leer un archivo

```tsx
const { readResource } = useMCP();

const handleReadFile = async () => {
  const result = await readResource("file:///hello.txt");
  if (result.error) {
    console.error("Error:", result.error);
  } else {
    console.log("Contenido:", result.content);
  }
};
```

### Ejecutar una herramienta

```tsx
const { callTool } = useMCP();

const handleExecuteTool = async () => {
  const result = await callTool("tool-pelusear");
  if (result.error) {
    console.error("Error:", result.error);
  } else {
    console.log("Resultado:", result.content);
  }
};
```

### Manejar estados de carga

```tsx
const { loading, isConnected } = useMCP();

if (!isConnected) {
  return <div>Conectando al servidor MCP...</div>;
}

if (loading) {
  return <div>Procesando...</div>;
}
```

## ⚠️ Requisitos

1. **Servidor MCP corriendo**: Asegúrate de que el servidor MCP esté ejecutándose
2. **React 18+**: El hook usa características modernas de React
3. **TypeScript**: Recomendado para mejor experiencia de desarrollo

## 🔍 Solución de Problemas

### Error: "MCP client not connected"

- Verifica que el servidor MCP esté corriendo (`npm start`)
- Revisa la consola del navegador para errores de conexión

### Error: "Cannot find module 'react'"

- Instala React: `npm install react @types/react`
- Verifica que estés en un proyecto React

### Error: "Cannot find module '@modelcontextprotocol/sdk'"

- Instala el SDK: `npm install @modelcontextprotocol/sdk`
- Verifica que la versión sea compatible

## 📚 Más Información

- [Documentación del MCP Server](../README.md)
- [Ejemplos de uso](../llm_client_example.ts)
- [Model Context Protocol](https://modelcontextprotocol.io/)
