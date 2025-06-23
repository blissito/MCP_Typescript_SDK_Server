# React Hook MCP

SDK para interactuar con el Model Context Protocol (MCP) tanto en el cliente como en el servidor.

## Instalación

```bash
npm install react-hook-mcp
```

## Guía de uso

### 1. Para el cliente (React/Node.js)

#### useMCP
Hook React para conectar con el servidor MCP:

```typescript
import { useMCP } from 'react-hook-mcp';

function MyComponent() {
  const { 
    isConnected,
    loading,
    readResource,
    callTool,
    processQuery,
    getStatus,
    disconnect
  } = useMCP();

  // Ejemplo de uso completo
  const handleQuery = async () => {
    try {
      // Consultar al LLM
      const response = await processQuery('¿Qué hora es?');
      console.log('Respuesta LLM:', response.content);

      // Leer un recurso
      const resource = await readResource('/path/to/resource');
      console.log('Contenido recurso:', resource.content);

      // Llamar a una herramienta
      const toolResult = await callTool('tool-name');
      console.log('Resultado herramienta:', toolResult.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <p>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <p>Cargando: {loading ? 'Sí' : 'No'}</p>
      <button onClick={handleQuery}>Probar todas las funciones</button>
      <button onClick={disconnect}>Desconectar</button>
    </div>
  );
}
```

#### MCPHttpClient
Cliente HTTP para Node.js que permite comunicarse con el servidor MCP:

```typescript
import { MCPHttpClient } from 'react-hook-mcp';

// Crear cliente
const client = new MCPHttpClient('http://localhost:3001');

// Ejemplos de uso
async function main() {
  try {
    // Leer recurso
    const resource = await client.readResource('/path/to/resource');
    console.log('Recurso:', resource.content);

    // Llamar herramienta
    const toolResult = await client.callTool('tool-name');
    console.log('Resultado herramienta:', toolResult.content);

    // Consultar LLM
    const queryResult = await client.processQuery('¿Qué hora es?');
    console.log('Respuesta LLM:', queryResult.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### 2. Para el servidor

#### MCPWebServer
Servidor web que expone MCP via HTTP/WS y maneja conexiones con LLMs:

```typescript
import { MCPWebServer } from 'react-hook-mcp';

// Opción 1: Servidor simple
const server = MCPWebServer.start();
// Servidor iniciará en http://localhost:3001

// Opción 2: Servidor con configuración personalizada
const server = new MCPWebServer();
server.start();

// Ejemplo de manejo de eventos
server.wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Procesar mensaje
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });
});
```

#### LLMClient
Cliente base para LLMs que puede usarse directamente o como base para otros clientes:

```typescript
import { LLMClient } from 'react-hook-mcp';

// Crear cliente personalizado
const client = new LLMClient({
  apiUrl: 'http://localhost:11434/api/chat',
  model: 'llama3.2:3b',
  headers: {
    'Authorization': 'Bearer tu-token'
  }
});

// Usar el cliente
async function main() {
  try {
    const response = await client.chat([
      { role: 'user', content: '¿Qué hora es?' }
    ]);
    console.log('Respuesta:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

#### Clientes pre-configurados

##### createOllamaClient
Cliente pre-configurado para Ollama:

```typescript
import { createOllamaClient } from 'react-hook-mcp';

// Crear cliente de Ollama
const client = createOllamaClient('llama3.2:3b');

async function main() {
  try {
    const response = await client.chat([
      { role: 'user', content: '¿Qué hora es?' }
    ]);
    console.log('Respuesta Ollama:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

##### createOpenAIClient
Cliente pre-configurado para OpenAI:

```typescript
import { createOpenAIClient } from 'react-hook-mcp';

// Crear cliente de OpenAI
const client = createOpenAIClient('tu-api-key', 'gpt-3.5-turbo');

async function main() {
  try {
    const response = await client.chat([
      { role: 'user', content: '¿Qué hora es?' }
    ]);
    console.log('Respuesta OpenAI:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Características principales

### Cliente
- Hook React (`useMCP`) para fácil integración en aplicaciones React
- Cliente HTTP (`MCPHttpClient`) para uso en Node.js
- Manejo automático de estados de conexión
- Soporte para lectura de recursos
- Llamadas a herramientas MCP
- Consultas al LLM
- Manejo de errores integrado

### Servidor
- Servidor web con soporte para HTTP y WebSocket
- Integración con LLMs (Ollama, OpenAI)
- Manejo de conexiones múltiples
- Soporte para recursos y herramientas
- Configuración personalizable
- Eventos y manejo de mensajes

### Tipos y Configuración
- Tipos TypeScript completos
- Configuración flexible
- Manejo de estados
- Personalización de URLs y modelos
- Soporte para diferentes proveedores de LLMs

## Ejemplos de uso

### Consultar al LLM

```typescript
// Consultar al LLM
const respuesta = await client.processUserQuery("¿Qué hay en el archivo hello.txt?");

// Manejar la respuesta
if (respuesta) {
  console.log(respuesta);
} else {
  console.error("No se recibió respuesta");
}
```

## 👥 Casos de Uso

```typescript
// Monitoreo de Servidores
const respuesta = await client.processUserQuery("Verifica el estado de los servidores");

// Análisis Financiero
const respuesta = await client.processUserQuery("Analiza el reporte de ventas del Q4");

// Seguridad
const respuesta = await client.processUserQuery("Escanea el sistema en busca de vulnerabilidades");
```

## 🏗️ Arquitectura

```
Usuario → LLM REST API → LLMRestClient → MCP Server → Recursos/Herramientas
```

## 🎯 Características Principales

- 🤖 **Integración con LLMs**
  - OpenAI
  - Claude
  - Ollama
  - APIs personalizadas
- 📊 **Análisis en tiempo real**
- 🛠️ **Ejecución de herramientas**
- 📦 **Integración con React**
  - Hook reutilizable
  - Conexión automática
  - Manejo de estados
- ✅ **TypeScript completo**
- ✅ **Manejo de errores robusto**
- ✅ **Documentación detallada**
- ✅ **Tests de integración** completos

## 🎯 Ejemplo de uso en React

```typescript
// 1. Instalar
npm install react-hook-mcp

// 2. Usar el hook useMCP
import { useMCP } from "react-hook-mcp";

export default function Page() {
  const { isConnected, loading, readResource, callTool } = useMCP();

  const handleReadResource = async () => {
    const result = await readResource("file:///hello.txt");
    console.log(result.content);
  };

  const handleCallTool = async () => {
    const result = await callTool("tool-pelusear");
    console.log(result.content);
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
    </div>
  );
}
```

## 🚀 ¿Qué se incluye en este repo?

### 1. Servidor MCP Básico

```bash
npm start
```

O en modo desarrollo (con watch):

```bash
npm run dev
```

### 2. Cliente Web Interactivo

Para usar el cliente web interactivo:

```bash
npm run web
```

Luego abre tu navegador en: http://localhost:3001

El cliente web te permite:

- Conectar/desconectar del servidor MCP
- Leer recursos (como `file:///hello.txt`)
- Ejecutar herramientas (como `tool-pelusear`)

## 🧩 Estructura del Servidor MCP

El servidor incluye:

1. **Recurso**: `file:///hello.txt` - Devuelve "Hello, World!"
2. **Herramienta**: `tool-pelusear` - Devuelve "¡Has sido peluseado! 🐶"

### Agregar nuevos recursos:

```typescript
server.registerResource(
  "mi-recurso",
  "file:///mi-archivo.txt",
  { title: "Mi Recurso" },
  async () => ({
    contents: [
      {
        uri: "file:///mi-archivo.txt",
        text: "Contenido del archivo",
        mimeType: "text/plain",
      },
    ],
  })
);
```

### Agregar nuevas herramientas:

```typescript
server.registerTool(
  "mi-herramienta",
  {
    title: "Mi Herramienta",
    description: "Descripción de mi herramienta",
  },
  async () => ({
    content: [
      {
        type: "text",
        text: "Resultado de mi herramienta",
      },
    ],
  })
);
```

## 🧪 Testing

Ejecutar los tests de integración:

```bash
npm test
```

Los tests verifican que:

- El servidor se inicia correctamente
- Los recursos se pueden leer
- Las herramientas se pueden ejecutar
- El cliente web funciona correctamente

## 🚀 Próximos Pasos

- [ ] Agregar más recursos (APIs, bases de datos, etc.)
- [ ] Implementar herramientas más complejas
- [ ] Agregar autenticación y seguridad
- [ ] Mejorar la interfaz web
- [ ] Agregar más tests
- [ ] Integrar con más proveedores LLM
- [ ] Crear dashboard de monitoreo
- [ ] Agregar persistencia de datos
- [ ] ⚡ Implementar streaming de respuestas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Model Context Protocol](https://modelcontextprotocol.io/) por el estándar
- [Anthropic](https://www.anthropic.com/) por Claude
- [OpenAI](https://openai.com/) por GPT
- [Ollama](https://ollama.ai/) por el modelo local


npm run example    # Ejecuta todos los ejemplos del cliente LLM
npm test           # Corre los tests de integración
```

## 📦 ¡Instala el paquete en npm!

¿Te gustó este proyecto? ¡Instálalo directamente desde npm!

```bash
npm install react-hook-mcp
```

### 🔗 Enlaces útiles

- 📦 **[react-hook-mcp en npm](https://www.npmjs.com/package/react-hook-mcp)**
- 🐙 **[Repositorio en GitHub](https://github.com/blissito/mcp-sdk-experiment)**
- 📚 **[Documentación completa](https://github.com/blissito/mcp-sdk-experiment#readme)**

### ⭐ ¡Dale una estrella!

Si este proyecto te ayudó, ¡considera darle una estrella en GitHub! Esto nos motiva a seguir mejorando y agregando nuevas funcionalidades.

---

_Desarrollado con 🤖 por [Héctorbliss](https://github.com/blissito)_
