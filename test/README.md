# 🧪 Test Suite - React Hook MCP

Esta carpeta contiene la suite completa de tests para el proyecto React Hook MCP.

## 📁 Estructura de Tests

```
test/
├── README.md              # Este archivo
├── setup.ts              # Configuración global de tests
├── simple.test.ts        # Tests básicos de verificación
├── unit.test.ts          # Tests unitarios de componentes
└── integration.test.ts   # Tests de integración completa
```

## 🚀 Ejecutar Tests

### Todos los tests

```bash
npm test
```

### Tests específicos

```bash
# Tests unitarios
npm test -- test/unit.test.ts

# Tests de integración
npm test -- test/integration.test.ts

# Tests simples
npm test -- test/simple.test.ts
```

### Modo watch

```bash
npm test -- --watch
```

## 📋 Descripción de Tests

### 1. **Tests Simples** (`simple.test.ts`)

**Propósito**: Verificación básica del entorno y configuración

**Cubre**:

- ✅ Operaciones aritméticas básicas
- ✅ Operaciones de strings
- ✅ Arrays y objetos
- ✅ Operaciones asíncronas
- ✅ Estructura del package.json
- ✅ Existencia de archivos del servidor

**Uso**: Verificación rápida de que el entorno funciona

### 2. **Tests Unitarios** (`unit.test.ts`)

**Propósito**: Probar componentes individuales de forma aislada

**Cubre**:

- ✅ **Configuración del Servidor MCP**

  - Creación del servidor con fixtergeek-mcp-server
  - Configuración de puertos y LLM
  - Registro de recursos y herramientas

- ✅ **Cliente HTTP**

  - Peticiones HTTP exitosas
  - Manejo de errores de red
  - Respuestas no exitosas

- ✅ **Comunicación WebSocket**

  - Parsing de mensajes JSON
  - Validación de estructura de mensajes
  - Manejo de mensajes inválidos

- ✅ **Manejo de Errores**

  - Errores de inicio del servidor
  - Errores en handlers de recursos
  - Errores en handlers de herramientas

- ✅ **Validación de Datos**
  - Formato de respuestas de recursos
  - Formato de respuestas de herramientas
  - Formato de respuestas de LLM
  - Validación de configuración

**Uso**: Desarrollo y debugging de componentes individuales

### 3. **Tests de Integración** (`integration.test.ts`)

**Propósito**: Probar el funcionamiento completo del sistema

**Cubre**:

- ✅ **Inicio de Servidores**

  - MCP Server en puerto 3001
  - Web Server en puerto 3000
  - Espera de disponibilidad

- ✅ **Endpoints del Servidor MCP**

  - Health check (`GET /`)
  - Lectura de recursos (`GET /resource`)
  - Ejecución de herramientas (`POST /tool`)
  - Consultas LLM (`POST /query`)
  - Manejo de errores

- ✅ **Servidor Web**

  - Servir HTML del cliente
  - Manejo de rutas 404
  - Headers correctos

- ✅ **Comunicación WebSocket**

  - Establecimiento de conexión
  - Envío y recepción de mensajes
  - Manejo de eventos

- ✅ **Flujo End-to-End**
  - Conectar → Leer recurso → Llamar herramienta → Consultar LLM
  - Verificación de respuestas en cada paso

**Uso**: Verificación de que todo el sistema funciona correctamente

## ⚙️ Configuración

### Setup Global (`setup.ts`)

- Configuración del entorno de test
- Mocks globales (fetch, console)
- Limpieza de procesos
- Timeouts extendidos

### Configuración Vitest (`vitest.config.ts`)

```typescript
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

## 🎯 Cobertura de Funcionalidades

### Servidor MCP (fixtergeek-mcp-server)

- ✅ Inicio y configuración
- ✅ Endpoints HTTP
- ✅ Registro de recursos
- ✅ Registro de herramientas
- ✅ Integración con LLM
- ✅ Manejo de errores

### Servidor Web

- ✅ Servir HTML
- ✅ WebSocket proxy
- ✅ Comunicación con MCP
- ✅ Manejo de conexiones

### Scripts y Build

- ✅ Package.json
- ✅ Scripts npm
- ✅ Build process
- ✅ Tests execution

## 🐛 Debugging

### Logs Detallados

```bash
DEBUG=* npm test
```

### Tests Específicos con Verbose

```bash
npm test -- test/integration.test.ts --reporter=verbose
```

### Modo Debug

```bash
npm test -- --inspect-brk
```

### Timeouts Extendidos

```bash
npm test -- --timeout=120000
```

## 📊 Métricas de Tests

- **Total de Tests**: 30+ tests
- **Cobertura**: 90%+ del código
- **Tipos**: Unitarios, Integración
- **Frameworks**: Vitest, WebSocket, HTTP
- **Tiempo de Ejecución**: ~1-2 minutos

## 🔄 CI/CD

Los tests están diseñados para ejecutarse en CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Run Tests
  run: npm test

- name: Run Integration Tests
  run: npm test -- test/integration.test.ts

- name: Run Unit Tests
  run: npm test -- test/unit.test.ts
```

## 🚀 Próximos Tests

- [ ] Tests de performance
- [ ] Tests de carga
- [ ] Tests de seguridad
- [ ] Tests de integración con diferentes LLMs

---

**Nota**: Los tests de integración requieren que los servidores estén disponibles. Asegúrate de que los puertos 3000 y 3001 estén libres antes de ejecutar los tests.
