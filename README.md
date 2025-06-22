# MCP Server Blissmo experiment 👽

Un servidor simple de Model Context Protocol (MCP) creado con TypeScript con soporte para LLMs REST API.

## 🎯 ¿Qué es esto?

Este proyecto demuestra cómo conectar un **LLM REST API** (como OpenAI, Claude, Ollama, etc.) con un **servidor MCP** para darle "superpoderes" al LLM, permitiéndole acceder a recursos y ejecutar herramientas en tu sistema.

## 🏗️ Arquitectura

```
Usuario → LLM REST API → LLMRestClient → MCP Server → Recursos/Herramientas
```

### Flujo de trabajo:

1. **Usuario** hace una consulta al LLM
2. **LLM** analiza qué necesita hacer
3. **LLMRestClient** ejecuta las acciones en el servidor MCP
4. **MCP Server** lee recursos o ejecuta herramientas
5. **LLM** genera una respuesta final con los resultados

## 🎯 Casos de Uso

### 1. **Gestión de Infraestructura IT**

```bash
Usuario: "Verifica el estado de los servidores de producción y ejecuta el backup automático"
LLM: [Lee métricas] [Ejecuta backup] "Los 12 servidores están operativos al 99.2% de rendimiento. He iniciado el backup incremental que completará en 15 minutos, liberando 2.3GB de espacio."
```

### 2. **Análisis Financiero y Reportes**

```bash
Usuario: "Lee el reporte de ventas del Q4 y ejecuta el análisis de rentabilidad por región"
LLM: [Lee datos] [Ejecuta análisis] "Las ventas del Q4 alcanzaron $2.4M, un incremento del 18% vs Q3. La región Norte muestra la mayor rentabilidad (34%), mientras que el Sur requiere atención con un margen del 12%."
```

### 3. **Monitoreo de Aplicaciones Web**

```bash
Usuario: "Revisa los logs de error de la aplicación e-commerce y ejecuta el diagnóstico de rendimiento"
LLM: [Lee logs] [Ejecuta diagnóstico] "Detecté 47 errores 500 en las últimas 24h, principalmente en el checkout. El diagnóstico revela latencia de base de datos. He optimizado las consultas críticas, reduciendo el tiempo de respuesta en un 40%."
```

### 4. **Gestión de Base de Datos Empresarial**

```bash
Usuario: "Analiza la base de datos de clientes y ejecuta la limpieza de datos duplicados"
LLM: [Lee DB] [Ejecuta limpieza] "Identifiqué 1,247 registros duplicados (8.3% del total). He consolidado los datos manteniendo la información más reciente. La limpieza liberó 156MB de espacio y mejoró la integridad referencial."
```

### 5. **Seguridad y Compliance**

```bash
Usuario: "Escanea el sistema en busca de vulnerabilidades y ejecuta la actualización de parches críticos"
LLM: [Lee reporte] [Ejecuta parches] "Encontré 3 vulnerabilidades críticas (CVE-2024-1234, CVE-2024-5678) y 7 de nivel medio. He aplicado los parches críticos y programado las actualizaciones de seguridad para las 2:00 AM."
```

### 6. **Análisis de Datos de Marketing**

```bash
Usuario: "Lee los datos de campañas digitales y ejecuta el análisis de ROI por canal"
LLM: [Lee métricas] [Ejecuta análisis] "La campaña Q4 generó $890K en ventas con un ROI del 320%. Google Ads lidera con 45% de conversiones, mientras que Facebook muestra un costo por adquisición 23% menor. Recomiendo reasignar 15% del presupuesto a Facebook."
```

### 7. **Gestión de Contenedores y Microservicios**

```bash
Usuario: "Monitorea el estado de los contenedores en Kubernetes y ejecuta la limpieza de recursos"
LLM: [Lee estado] [Ejecuta limpieza] "Tienes 47 pods ejecutándose en 8 namespaces. He identificado 12 pods huérfanos y 3 deployments con 0 réplicas. La limpieza liberó 4.2GB de almacenamiento y optimizó el uso de CPU en un 18%."
```

### 8. **Análisis de Logs y Troubleshooting**

```bash
Usuario: "Analiza los logs de la aplicación de pagos y ejecuta el diagnóstico de transacciones fallidas"
LLM: [Lee logs] [Ejecuta diagnóstico] "En las últimas 6 horas, 23 transacciones fallaron (0.12% del total). El patrón indica timeouts en la integración con el procesador de pagos. He ajustado los timeouts y implementado retry automático, reduciendo fallas en un 85%."
```

### 9. **Gestión de Configuración de Red**

```bash
Usuario: "Lee la configuración de red y ejecuta la optimización de ancho de banda"
LLM: [Lee config] [Ejecuta optimización] "La configuración actual tiene 30% de ancho de banda subutilizado. He optimizado el QoS, priorizado tráfico crítico y ajustado el rate limiting. Esto mejorará la latencia en un 25% y reducirá el uso de ancho de banda en un 15%."
```

### 10. **Análisis de Datos de Recursos Humanos**

```bash
Usuario: "Lee los datos de rendimiento de empleados y ejecuta el análisis de productividad por departamento"
LLM: [Lee datos] [Ejecuta análisis] "El análisis muestra que el departamento de Desarrollo tiene la mayor productividad (94%), mientras que Ventas requiere atención con un 78%. He identificado 3 equipos que podrían beneficiarse de capacitación adicional, proyectando un incremento del 12% en productividad."
```

## ⚛️ ¿Cómo se usa en React?

Aquí te muestro cómo integrar el servidor MCP con una aplicación React usando nuestro hook personalizado:

### **1. Instalar dependencias**

```bash
npm install react @types/react @modelcontextprotocol/sdk
```

### **2. Usar el hook useMCP**

```tsx
import React, { useState } from "react";
import { useMCP } from "./hooks/useMCP";

export function MCPInterface() {
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

### **3. Integrar con LLM Directamente (Ollama)**

```tsx
export function LLMInterface() {
  const { isConnected, readResource, callTool } = useMCP();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callOllama = async (prompt: string) => {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [
          {
            role: "system",
            content:
              'Eres un asistente que puede acceder a recursos y ejecutar herramientas. Responde solo con "leer" si quieres leer un archivo, "herramienta" si quieres ejecutar una herramienta, o "ambos" si quieres hacer las dos cosas.',
          },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    return data.message.content.toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Enviar consulta a Ollama
      const llmResponse = await callOllama(query);

      // 2. Ejecutar acciones en MCP basadas en la respuesta del LLM
      const results = [];

      if (llmResponse.includes("leer") || llmResponse.includes("ambos")) {
        const result = await readResource("file:///hello.txt");
        results.push({ action: "Leer archivo", result: result.content });
      }

      if (
        llmResponse.includes("herramienta") ||
        llmResponse.includes("ambos")
      ) {
        const result = await callTool("tool-pelusear");
        results.push({
          action: "Ejecutar herramienta",
          result: result.content,
        });
      }

      // 3. Generar respuesta final
      setResponse(
        `LLM dijo: "${llmResponse}". Acciones ejecutadas: ${results
          .map((r) => r.result)
          .join(", ")}`
      );
    } catch (error) {
      setResponse(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué quieres que haga?"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Enviar"}
        </button>
      </form>

      {response && (
        <div>
          <h3>Respuesta:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

### **4. Archivos disponibles**

- **`hooks/useMCP.ts`** - Hook principal para conectar con MCP
- **`hooks/useMCP.example.ts`** - Ejemplos de uso
- **`hooks/README.md`** - Documentación completa del hook

### **5. API Routes (Next.js)**

<details>
<summary>Ver ejemplo de Next.js API Route</summary>

```typescript
// pages/api/llm.ts
export default async function handler(req, res) {
  const { query } = req.body;

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que puede acceder a recursos y ejecutar herramientas.",
        },
        { role: "user", content: query },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  res.status(200).json({ content: data.message.content });
}
```

</details>

### **6. React Router v7 (Loader/Action)**

<details>
<summary>Ver ejemplo de React Router v7</summary>

```typescript
// routes/api.llm.tsx
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get("query") as string;

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que puede acceder a recursos y ejecutar herramientas.",
        },
        { role: "user", content: query },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify({ content: data.message.content }), {
    headers: { "Content-Type": "application/json" },
  });
}

// routes/_index.tsx
import { Form } from "react-router";
import { useMCP } from "~/hooks/useMCP";

export default function Index() {
  const { readResource, callTool } = useMCP();

  return (
    <div>
      <Form method="post">
        <input type="text" name="query" placeholder="¿Qué quieres que haga?" />
        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}
```

</details>

### **7. Hono (API Route)**

<details>
<summary>Ver ejemplo de Hono</summary>

```typescript
// api/llm.ts
import { Hono } from "hono";

const app = new Hono();

app.post("/api/llm", async (c) => {
  const { query } = await c.req.json();

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:3b",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que puede acceder a recursos y ejecutar herramientas.",
        },
        { role: "user", content: query },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  return c.json({ content: data.message.content });
});

export default app;
```

</details>

**Beneficios:**

- ✅ **Hook reutilizable** para cualquier componente React
- ✅ **Conexión automática** al servidor MCP
- ✅ **Manejo de estados** y errores incluido
- ✅ **Integración fácil** con LLMs
- ✅ **TypeScript** completo

## 📦 Instalación

```bash
npm install
```

## 🚀 Uso

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

### 3. Cliente LLM REST API

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

**OpenAI (GPT):**

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

#### Ejemplo de uso con LLM:

```
Usuario: "Lee el archivo y ejecuta la herramienta"

LLM: "Voy a leer el archivo hello.txt y luego ejecutar la herramienta de pelusear"

MCP: Lee "Hello, World!" y ejecuta herramienta que responde "¡Has sido peluseado! 🐶"

LLM: "Perfecto! He leído el archivo que contiene 'Hello, World!' y ejecuté la herramienta que respondió '¡Has sido peluseado! 🐶'. ¡Ha sido una experiencia completa!"
```

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

## 📁 Estructura del Proyecto

```
mcp_sdk_experiment/
├── mcp_server.ts              # Servidor MCP principal
├── web_server.ts              # Servidor web + WebSocket proxy
├── web_client.html            # Cliente web interactivo
├── llm_rest_client.ts         # Cliente LLM REST API
├── llm_config.ts              # Configuraciones de LLM
├── mcp_server.integration.test.ts  # Tests de integración
├── web_server.test.ts         # Tests del servidor web
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Características

- ✅ **Servidor MCP básico** con recursos y herramientas
- ✅ **Cliente web interactivo** con WebSocket
- ✅ **Cliente LLM REST API** para múltiples proveedores
- ✅ **Soporte para OpenAI, Claude, Ollama** y APIs personalizadas
- ✅ **Tests de integración** completos
- ✅ **TypeScript** completo con tipos
- ✅ **Manejo de errores** robusto
- ✅ **Documentación** detallada

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

## 🧪 Ejecución de Ejemplos

Para correr todos los ejemplos del cliente LLM (incluyendo integración con MCP y diferentes modelos):

```bash
npm run example
```

Esto ejecutará el archivo `llm_client_example.ts` y mostrará en consola los resultados de cada ejemplo:

- Ejemplo básico con Ollama
- Ejemplo con OpenAI (si tienes API key)
- Ejemplo de múltiples consultas
- Ejemplo de manejo de errores
- Ejemplo de configuración personalizada (usa un modelo ligero por defecto)

**Recomendación:** Para pruebas rápidas, usa modelos ligeros de Ollama como `llama3.2:3b` o `gemma3:4b`. Los modelos grandes como `phi4:14b` pueden ser lentos.

## 🛠️ Solución de Problemas

- **Error 404 o 401:** Verifica que la URL y el modelo existan y que tu API key sea válida.
- **Error de JSON o streaming:** El cliente fuerza `stream: false` para compatibilidad con Ollama. Si usas otro LLM, revisa el formato de respuesta.
- **Lentitud:** Usa modelos más pequeños para desarrollo. Los modelos grandes pueden tardar varios minutos.
- **Ollama no responde:** Asegúrate de que Ollama esté corriendo (`ollama serve`) y que el modelo esté descargado (`ollama pull llama3.2:3b`).

## 📝 Scripts útiles

```bash
npm run start      # Inicia el servidor MCP
npm run dev        # Modo desarrollo (watch)
npm run web        # Cliente web interactivo
npm run llm        # Cliente LLM REST API
npm run example    # Ejecuta todos los ejemplos del cliente LLM
npm test           # Corre los tests de integración
```
