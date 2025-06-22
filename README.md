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
