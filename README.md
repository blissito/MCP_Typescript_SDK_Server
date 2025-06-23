# React Hook MCP 🏗️

SDK para interactuar con el Model Context Protocol (MCP) tanto en el cliente como en el servidor.

**🚀 Ahora usando [fixtergeek-mcp-server](https://github.com/blissito/fixtergeek-mcp-server) como base del servidor MCP**

## 🎯 Casos de Uso Principales

### 🏥 **Sector Salud - Análisis de Datos Médicos**

```typescript
// Análisis de resultados de laboratorio
const analisis = await client.processQuery(
  "Analiza los valores de hemoglobina y glucosa del paciente ID-12345"
);

// Interpretación de radiografías
const diagnostico = await client.processQuery(
  "Revisa la radiografía de tórax del paciente y busca signos de neumonía"
);
```

### 🏦 **Sector Financiero - Gestión de Riesgos**

```typescript
// Evaluación de riesgo crediticio
const riesgo = await client.processQuery(
  "Evalúa el riesgo crediticio del cliente corporativo XYZ basado en su historial financiero"
);

// Análisis de mercado en tiempo real
const mercado = await client.processQuery(
  "Analiza las tendencias del mercado de valores y genera recomendaciones de inversión"
);
```

### 🏭 **Sector Industrial - Mantenimiento Predictivo**

```typescript
// Monitoreo de equipos industriales
const estado = await client.processQuery(
  "Analiza los datos de vibración de la turbina T-001 y predice el próximo mantenimiento"
);

// Optimización de procesos
const optimizacion = await client.processQuery(
  "Optimiza los parámetros de temperatura y presión en el reactor químico R-205"
);
```

### 🛡️ **Ciberseguridad - Detección de Amenazas**

```typescript
// Análisis de logs de seguridad
const amenazas = await client.processQuery(
  "Analiza los logs del firewall y detecta patrones de actividad sospechosa"
);

// Evaluación de vulnerabilidades
const vulnerabilidades = await client.processQuery(
  "Evalúa el reporte de escaneo de vulnerabilidades del sistema de pagos"
);
```

### 📊 **Analítica de Negocios - Insights Empresariales**

```typescript
// Análisis de ventas y tendencias
const ventas = await client.processQuery(
  "Analiza las ventas del Q4 por región y genera insights para la estrategia del próximo trimestre"
);

// Predicción de demanda
const demanda = await client.processQuery(
  "Predice la demanda de productos para el próximo mes basado en datos históricos"
);
```

### 🚀 **Desarrollo de Software - DevOps y CI/CD**

```typescript
// Análisis de rendimiento de aplicaciones
const rendimiento = await client.processQuery(
  "Analiza las métricas de rendimiento de la aplicación web y identifica cuellos de botella"
);

// Gestión de incidentes
const incidente = await client.processQuery(
  "Analiza el incidente de producción y genera un plan de acción para la resolución"
);
```

## Instalación

```bash
npm install react-hook-mcp
```

### 🤖 Integración con Servidores LLM

**Este agente MCP es parte de la integración incluida al comprar tu propio servidor LLM Phi-4**: [https://phi4.fly.dev/](https://phi4.fly.dev/)

Al adquirir tu servidor LLM personalizado, obtienes acceso completo a:

- **Phi-4**: Servidor LLM personalizado con integración MCP incluida
- **Ollama**: Para modelos locales
- **OpenAI**: Para modelos en la nube
- **Claude**: Para modelos de Anthropic

### Configuración con Phi-4

Para usar con tu servidor Phi-4 (incluido en tu compra):

```typescript
import { createMCPServer } from "fixtergeek-mcp-server";

const server = createMCPServer({
  port: 3001,
  logLevel: "info",
  llm: {
    provider: "custom",
    baseUrl: "https://phi4.fly.dev/",
    model: "phi-4",
    temperature: 0.7,
  },
});
```

## 🏗️ Arquitectura

Este proyecto utiliza el paquete `fixtergeek-mcp-server` como base para el servidor MCP, proporcionando:

- ✅ **Servidor MCP HTTP** con endpoints REST
- ✅ **Integración con LLMs** (OpenAI, Ollama, Claude)
- ✅ **Gestión de recursos y herramientas**
- ✅ **WebSocket proxy** para comunicación en tiempo real
- ✅ **Cliente web interactivo**

```
Usuario → Web Client → WebSocket Proxy → fixtergeek-mcp-server → LLM → Recursos/Herramientas
```

## 🚀 Inicio Rápido

### Ejecutar todo el stack completo:

```bash
# Modo desarrollo (con watch mode)
npm run dev

# Modo producción
npm run start
```

Esto iniciará:

- 🟢 **MCP Server**: `http://localhost:3001` (fixtergeek-mcp-server)
- 🟢 **Web Client**: `http://localhost:3000` (interfaz web)

### Acceder al cliente web:

1. Abre tu navegador en: `http://localhost:3000`
2. Haz clic en "Conectar al Servidor"
3. ¡Listo! Ya puedes usar todas las funcionalidades

## Guía de uso

### 1. Para el cliente (React/Node.js)

#### useMCP

Hook React para conectar con el servidor MCP:

```typescript
import { useMCP } from "react-hook-mcp";

function MyComponent() {
  const {
    isConnected,
    loading,
    readResource,
    callTool,
    processQuery,
    getStatus,
    disconnect,
  } = useMCP();

  // Ejemplo de uso completo
  const handleQuery = async () => {
    try {
      // Consultar al LLM
      const response = await processQuery("¿Qué hora es?");
      console.log("Respuesta LLM:", response.content);

      // Leer un recurso
      const resource = await readResource("/path/to/resource");
      console.log("Contenido recurso:", resource.content);

      // Llamar a una herramienta
      const toolResult = await callTool("tool-name");
      console.log("Resultado herramienta:", toolResult.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <p>Estado: {isConnected ? "Conectado" : "Desconectado"}</p>
      <p>Cargando: {loading ? "Sí" : "No"}</p>
      <button onClick={handleQuery}>Probar todas las funciones</button>
      <button onClick={disconnect}>Desconectar</button>
    </div>
  );
}
```

#### MCPHttpClient

Cliente HTTP para Node.js que permite comunicarse con el servidor MCP:

```typescript
import { MCPHttpClient } from "react-hook-mcp";

// Crear cliente
const client = new MCPHttpClient("http://localhost:3001");

// Ejemplos de uso
async function main() {
  try {
    // Leer recurso
    const resource = await client.readResource("/path/to/resource");
    console.log("Recurso:", resource.content);

    // Llamar herramienta
    const toolResult = await client.callTool("tool-name");
    console.log("Resultado herramienta:", toolResult.content);

    // Consultar LLM
    const queryResult = await client.processQuery("¿Qué hora es?");
    console.log("Respuesta LLM:", queryResult.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

### 2. Para el servidor

#### Servidor MCP con fixtergeek-mcp-server

El servidor utiliza `fixtergeek-mcp-server` que proporciona:

```typescript
import { createMCPServer } from "fixtergeek-mcp-server";

// Configuración del servidor MCP
const server = createMCPServer({
  port: 3001,
  logLevel: "info",
  llm: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b",
    temperature: 0.7,
  },
});

// Registrar recursos personalizados
server.registerResource(
  "hello-resource",
  "file:///hello.txt",
  {
    title: "Hello Resource",
    description: "A simple hello world resource",
  },
  async () => ({
    success: true,
    data: {
      content: "Hello, World! This is a custom resource!",
      mimeType: "text/plain",
    },
    timestamp: Date.now(),
  })
);

// Registrar herramientas personalizadas
server.registerTool(
  "tool-pelusear",
  {
    title: "Pelusear Tool",
    description: "A simple tool that pelusea (pets) you",
  },
  async (params) => ({
    success: true,
    data: {
      result: {
        message: "¡Has sido peluseado! 🐶",
        params,
        timestamp: new Date().toISOString(),
      },
    },
    timestamp: Date.now(),
  })
);

// Iniciar el servidor
await server.start();
```

#### MCPWebServer

Servidor web que expone MCP via HTTP/WS y maneja conexiones con LLMs:

```typescript
import { MCPWebServer } from "react-hook-mcp";

// Opción 1: Servidor simple
const server = MCPWebServer.start();
// Servidor iniciará en http://localhost:3000

// Opción 2: Servidor con configuración personalizada
const server = new MCPWebServer();
server.start();

// Ejemplo de manejo de eventos
server.wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Procesar mensaje
    } catch (error) {
      console.error("Error procesando mensaje:", error);
    }
  });
});
```

#### LLMClient

Cliente base para LLMs que puede usarse directamente o como base para otros clientes:

```typescript
import { LLMClient } from "react-hook-mcp";

// Crear cliente personalizado
const client = new LLMClient({
  apiUrl: "http://localhost:11434/api/chat",
  model: "llama3.2:3b",
  headers: {
    Authorization: "Bearer tu-token",
  },
});

// Usar el cliente
async function main() {
  try {
    const response = await client.chat([
      { role: "user", content: "¿Qué hora es?" },
    ]);
    console.log("Respuesta:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

#### Clientes pre-configurados

##### createOllamaClient

Cliente pre-configurado para Ollama:

```typescript
import { createOllamaClient } from "react-hook-mcp";

// Crear cliente de Ollama
const client = createOllamaClient("llama3.2:3b");

async function main() {
  try {
    const response = await client.chat([
      { role: "user", content: "¿Qué hora es?" },
    ]);
    console.log("Respuesta Ollama:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

##### createOpenAIClient

Cliente pre-configurado para OpenAI:

```typescript
import { createOpenAIClient } from "react-hook-mcp";

// Crear cliente de OpenAI
const client = createOpenAIClient("tu-api-key", "gpt-3.5-turbo");

async function main() {
  try {
    const response = await client.chat([
      { role: "user", content: "¿Qué hora es?" },
    ]);
    console.log("Respuesta OpenAI:", response);
  } catch (error) {
    console.error("Error:", error);
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

- **Servidor MCP HTTP** basado en `fixtergeek-mcp-server`
- **Integración con LLMs** (Ollama, OpenAI, Claude)
- **WebSocket proxy** para comunicación en tiempo real
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
- 🚀 **Basado en fixtergeek-mcp-server**

## 🚀 ¿Qué se incluye en este repo?

### 1. Servidor MCP con fixtergeek-mcp-server

```bash
# Para desarrollo (con watch mode)
npm run dev

# Para producción
npm run start

# Solo servidor MCP
npm run start:mcp
```

El servidor MCP se ejecuta en el puerto 3001 y proporciona:

- **GET /** - Endpoint de prueba
- **GET /resource?uri=<uri>** - Leer recursos
- **POST /tool** - Ejecutar herramientas
- **POST /query** - Procesar consultas del LLM

### 2. Cliente Web Interactivo

Para usar el cliente web interactivo:

```bash
# Ejecutar solo el cliente web
npm run web

# O ejecutar ambos servidores juntos
npm run dev    # Modo desarrollo
npm run start  # Modo producción
```

Luego abre tu navegador en: http://localhost:3000

El cliente web te permite:

- Conectar/desconectar del servidor MCP
- Leer recursos (como `file:///hello.txt`)
- Ejecutar herramientas (como `tool-pelusear`)
- **Procesar consultas del LLM** (nueva funcionalidad)

## 🧩 Estructura del Servidor MCP

El servidor incluye:

1. **Recurso**: `file:///hello.txt` - Devuelve "Hello, World! This is a custom resource from fixtergeek-mcp-server!"
2. **Herramienta**: `tool-pelusear` - Devuelve "¡Has sido peluseado! 🐶"

### Agregar nuevos recursos:

```typescript
server.registerResource(
  "mi-recurso",
  "file:///mi-archivo.txt",
  {
    title: "Mi Recurso",
    description: "Descripción de mi recurso",
  },
  async () => ({
    success: true,
    data: {
      content: "Contenido del archivo",
      mimeType: "text/plain",
    },
    timestamp: Date.now(),
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
  async (params) => ({
    success: true,
    data: {
      result: {
        message: "Resultado de mi herramienta",
        params,
        timestamp: new Date().toISOString(),
      },
    },
    timestamp: Date.now(),
  })
);
```

## 🧪 Testing

El proyecto incluye una suite completa de tests que cubren las funcionalidades principales:

### Ejecutar todos los tests:

```bash
npm test
```

### Ejecutar tests específicos:

```bash
# Tests unitarios
npm test -- test/unit.test.ts

# Tests de integración
npm test -- test/integration.test.ts

# Tests simples (verificación básica)
npm test -- test/simple.test.ts
```

### Tipos de Tests

#### 1. **Tests Unitarios** (`test/unit.test.ts`)

Verifican componentes individuales:

- ✅ Configuración del servidor MCP
- ✅ Registro de recursos y herramientas
- ✅ Cliente HTTP y utilidades
- ✅ Comunicación WebSocket
- ✅ Manejo de errores
- ✅ Validación de datos
- ✅ Configuración de LLM

#### 2. **Tests de Integración** (`test/integration.test.ts`)

Verifican el funcionamiento completo del sistema:

- ✅ Inicio y parada de servidores
- ✅ Endpoints HTTP del servidor MCP (puerto 3001)
- ✅ Servidor web (puerto 3000)
- ✅ Comunicación WebSocket
- ✅ Flujo completo: conectar → leer recurso → llamar herramienta → consultar LLM
- ✅ Manejo de errores y casos edge

#### 3. **Tests Simples** (`test/simple.test.ts`)

Verificación básica del entorno:

- ✅ Operaciones básicas
- ✅ Estructura del proyecto
- ✅ Archivos necesarios

### Cobertura de Tests

Los tests cubren:

#### **Servidor MCP (fixtergeek-mcp-server)**

- ✅ Inicio y configuración
- ✅ Endpoints HTTP (`/`, `/resource`, `/tool`, `/query`)
- ✅ Registro de recursos y herramientas
- ✅ Integración con LLM
- ✅ Manejo de errores

#### **Servidor Web**

- ✅ Servir HTML del cliente
- ✅ Comunicación WebSocket
- ✅ Proxy a servidor MCP
- ✅ Manejo de conexiones múltiples

#### **Scripts y Configuración**

- ✅ Package.json
- ✅ Scripts npm
- ✅ Configuración de Vitest
- ✅ Build del proyecto

### Configuración de Tests

El proyecto usa **Vitest** como framework de testing:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
```

### Ejecutar Tests en Modo Watch

```bash
# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests específicos en modo watch
npm test -- test/unit.test.ts --watch
```

### Tests de Integración Completa

Los tests de integración verifican el flujo completo:

1. **Inicio de servidores**

   - MCP Server en puerto 3001
   - Web Server en puerto 3000

2. **Pruebas de endpoints**

   - Health check del servidor MCP
   - Lectura de recursos
   - Ejecución de herramientas
   - Consultas al LLM

3. **Comunicación WebSocket**

   - Conexión establecida
   - Envío de mensajes
   - Recepción de respuestas

4. **Flujo end-to-end**
   - Conectar al servidor
   - Leer recurso `file:///hello.txt`
   - Llamar herramienta `tool-pelusear`
   - Procesar consulta LLM

### Resultados de Tests

Los tests verifican que:

- ✅ El servidor MCP se inicia correctamente
- ✅ Los recursos se pueden leer (`file:///hello.txt`)
- ✅ Las herramientas se pueden ejecutar (`tool-pelusear`)
- ✅ La comunicación WebSocket es estable
- ✅ El build del proyecto es exitoso
- ✅ La integración con LLM funciona
- ✅ El manejo de errores es robusto

### Debugging de Tests

Para debuggear tests específicos:

```bash
# Ejecutar un test específico con más información
npm test -- test/integration.test.ts --reporter=verbose

# Ejecutar tests con logs detallados
DEBUG=* npm test

# Ejecutar tests en modo debug
npm test -- --inspect-brk
```

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
- [fixtergeek-mcp-server](https://github.com/blissito/fixtergeek-mcp-server) por el servidor MCP base
- [Anthropic](https://www.anthropic.com/) por Claude
- [OpenAI](https://openai.com/) por GPT
- [Ollama](https://ollama.ai/) por el modelo local

## 📦 Scripts Disponibles

```bash
npm run build        # Build del proyecto
npm run dev          # Ambos servidores en modo desarrollo (MCP + Web)
npm run start        # Ambos servidores (MCP + Web)
npm run start:mcp    # Solo servidor MCP
npm run web          # Solo cliente web interactivo
npm run example      # Ejecuta todos los ejemplos del cliente LLM
npm test             # Corre los tests de integración
```

## 📦 ¡Instala el paquete en npm!

¿Te gustó este proyecto? ¡Instálalo directamente desde npm!

```bash
npm install react-hook-mcp
```

### Enlaces útiles

- 📦 **[react-hook-mcp en npm](https://www.npmjs.com/package/react-hook-mcp)**
- 🐙 **[Repositorio en GitHub](https://github.com/blissito/mcp-sdk-experiment)**
- 📚 **[Documentación completa](https://github.com/blissito/mcp-sdk-experiment#readme)**
- 🚀 **[fixtergeek-mcp-server](https://github.com/blissito/fixtergeek-mcp-server)**

### ⭐ ¡Dale una estrella!

Si este proyecto te ha sido útil, ¡dale una estrella en GitHub!

---

_Desarrollado con 🤖 por [Héctorbliss](https://github.com/blissito)_
