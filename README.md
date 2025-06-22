# MCP Server & useMCP hook by Blissmo 👽

1. Levanta tu ollama server
2. Crea un action en el ervidor para user `LLMRestClient`
3. `useMCP` en tus componentes.
4. ¡Habla con tu LLM todo lo que quieras!

## 🚀 Instalación

```bash
npm install react-hook-mcp
```

## 🚀 Quick Start

```typescript
// 1. Importar el cliente
import { LLMRestClient } from 'react-hook-mcp';

// 2. Configurar y usar con Ollama
const client = new LLMRestClient({
  apiUrl: "http://localhost:11434/api/chat",
  model: "llama3.2:3b"
});

// 3. Consultar
const respuesta = await client.processUserQuery("¿Qué hay en el archivo hello.txt?");
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

## 🎯 ¿Cómo se usa en React?

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
- 🐙 **[Repositorio en GitHub](https://github.com/yourusername/mcp-sdk-experiment)**
- 📚 **[Documentación completa](https://github.com/yourusername/mcp-sdk-experiment#readme)**

### ⭐ ¡Dale una estrella!

Si este proyecto te ayudó, ¡considera darle una estrella en GitHub! Esto nos motiva a seguir mejorando y agregando nuevas funcionalidades.

---

_Desarrollado con 🤖 por [Héctorbliss](https://github.com/yourusername)_
