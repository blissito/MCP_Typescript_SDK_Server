# MCP Server Experiment

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

### 1. **Asistente con Acceso a Archivos**

```bash
Usuario: "Lee mi archivo de configuración y dime qué puertos están abiertos"
LLM: [Lee archivo] "Tu archivo muestra que tienes los puertos 3000, 8080 y 5432 abiertos"
```

### 2. **Herramientas de Sistema**

```bash
Usuario: "Ejecuta la herramienta de limpieza y luego lee el log"
LLM: [Ejecuta herramienta] [Lee log] "He limpiado el sistema y el log muestra que se eliminaron 15 archivos temporales"
```

### 3. **APIs Externas**

```bash
Usuario: "Consulta el clima y luego ejecuta la herramienta de notificación"
LLM: [Lee API clima] [Ejecuta notificación] "El clima está soleado a 25°C y he enviado la notificación"
```

### 4. **Análisis de Datos**

```bash
Usuario: "Lee el archivo CSV de ventas y ejecuta el análisis de tendencias"
LLM: [Lee CSV] [Ejecuta análisis] "Las ventas han aumentado un 23% este mes, con el producto A siendo el más vendido"
```

### 5. **Monitoreo de Servicios**

```bash
Usuario: "Verifica el estado de mis servicios y ejecuta la herramienta de backup"
LLM: [Lee estado servicios] [Ejecuta backup] "Todos los servicios están funcionando correctamente y he iniciado el backup programado"
```

### 6. **Gestión de Base de Datos**

```bash
Usuario: "Consulta la base de datos de usuarios y ejecuta la limpieza de registros duplicados"
LLM: [Lee DB] [Ejecuta limpieza] "Encontré 47 usuarios duplicados y los he consolidado correctamente"
```

### 7. **Análisis de Logs**

```bash
Usuario: "Lee los logs de error de hoy y ejecuta la herramienta de diagnóstico"
LLM: [Lee logs] [Ejecuta diagnóstico] "Detecté 3 errores críticos relacionados con la conexión de red, he ejecutado el diagnóstico y está todo resuelto"
```

### 8. **Gestión de Configuración**

```bash
Usuario: "Lee mi archivo de configuración de red y ejecuta la herramienta de optimización"
LLM: [Lee config] [Ejecuta optimización] "Tu configuración de red tiene algunos parámetros subóptimos, los he ajustado para mejorar el rendimiento en un 15%"
```

### 9. **Análisis de Seguridad**

```bash
Usuario: "Escanea mi sistema en busca de vulnerabilidades y ejecuta la herramienta de parcheo"
LLM: [Lee reporte] [Ejecuta parcheo] "Encontré 2 vulnerabilidades de seguridad de nivel medio, he aplicado los parches correspondientes"
```

### 10. **Gestión de Contenedores**

```bash
Usuario: "Lee el estado de mis contenedores Docker y ejecuta la herramienta de limpieza"
LLM: [Lee estado] [Ejecuta limpieza] "Tienes 5 contenedores ejecutándose y 3 detenidos, he limpiado los recursos no utilizados liberando 2GB de espacio"
```

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
