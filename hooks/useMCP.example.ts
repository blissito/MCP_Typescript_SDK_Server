/**
 * Ejemplo de uso del hook useMCP
 *
 * Para usar este hook en tu proyecto React:
 *
 * 1. Instalar dependencias:
 *    npm install react @types/react @modelcontextprotocol/sdk
 *
 * 2. Copiar el archivo useMCP.ts a tu proyecto
 *
 * 3. Usar el hook en tus componentes
 */

// Ejemplo de uso en un componente React
/*
import React, { useState } from 'react';
import { useMCP } from './hooks/useMCP';

export function MCPExample() {
  const { isConnected, loading, readResource, callTool } = useMCP();
  const [resourceContent, setResourceContent] = useState('');
  const [toolResult, setToolResult] = useState('');

  const handleReadResource = async () => {
    const result = await readResource('file:///hello.txt');
    if (!result.error) {
      setResourceContent(result.content);
    }
  };

  const handleCallTool = async () => {
    const result = await callTool('tool-pelusear');
    if (!result.error) {
      setToolResult(result.content);
    }
  };

  return (
    <div>
      <div>Estado: {isConnected ? '✅ Conectado' : '🔌 Desconectado'}</div>
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
*/

// Ejemplo de uso con TypeScript completo
interface MCPExampleProps {
  title?: string;
}

export function MCPExampleComponent({
  title = "MCP Interface",
}: MCPExampleProps) {
  // Este es solo un ejemplo - necesitas React instalado para que funcione
  console.log("Este es un ejemplo del componente MCP");

  return {
    title,
    description: "Componente de ejemplo para usar con useMCP hook",
    requirements: [
      "React instalado",
      "MCP SDK instalado",
      "Servidor MCP corriendo",
    ],
  };
}

// Ejemplo de configuración de package.json para React + MCP
export const packageJsonExample = {
  dependencies: {
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    "@modelcontextprotocol/sdk": "^0.4.0",
  },
  devDependencies: {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    typescript: "^5.0.0",
  },
};

// Ejemplo de tsconfig.json para React + MCP
export const tsconfigExample = {
  compilerOptions: {
    target: "ES2020",
    lib: ["DOM", "DOM.Iterable", "ES6"],
    allowJs: true,
    skipLibCheck: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noFallthroughCasesInSwitch: true,
    module: "ESNext",
    moduleResolution: "node",
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: "react-jsx",
  },
  include: ["src"],
};
