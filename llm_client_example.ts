import { LLMRestClient, LLMProviders } from "./llm_rest_client.js";

// Ejemplo básico de uso
async function ejemploBasico() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 EJEMPLO BÁSICO (Ollama)");
  console.log("=".repeat(60));

  const client = new LLMRestClient({
    apiUrl: "http://localhost:11434/api/chat",
    model: "llama3.2:3b",
  });

  try {
    await client.connect();
    const consulta = "¿Qué hay en el archivo hello.txt?";
    console.log(`\n👤 USUARIO:`);
    console.log(`"${consulta}"`);
    console.log("-".repeat(40));
    const respuesta = await client.processUserQuery(consulta);
    console.log("🤖 LLM (RESPUESTA FINAL):");
    console.log("-".repeat(40));
    console.log(respuesta);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.disconnect();
  }
}

// Ejemplo con OpenAI
async function ejemploOpenAI() {
  console.log("\n" + "=".repeat(60));
  console.log("🤖 EJEMPLO CON OPENAI");
  console.log("=".repeat(60));

  if (!process.env.OPENAI_API_KEY) {
    console.log(
      "⚠️ Saltando ejemplo de OpenAI - No hay OPENAI_API_KEY configurada"
    );
    return;
  }

  const client = new LLMRestClient({
    apiUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
  });

  try {
    await client.connect();
    const consulta = "Ejecuta la herramienta de pelusear";
    console.log(`\n👤 USUARIO:`);
    console.log(`"${consulta}"`);
    console.log("-".repeat(40));
    const respuesta = await client.processUserQuery(consulta);
    console.log("🤖 LLM (RESPUESTA FINAL):");
    console.log("-".repeat(40));
    console.log(respuesta);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.disconnect();
  }
}

// Ejemplo con múltiples consultas
async function ejemploMultiplesConsultas() {
  console.log("\n" + "=".repeat(60));
  console.log("🔄 EJEMPLO MÚLTIPLES CONSULTAS");
  console.log("=".repeat(60));

  const client = new LLMRestClient({
    apiUrl: "http://localhost:11434/api/chat",
    model: "llama3.2:3b",
  });

  try {
    await client.connect();
    const consultas = [
      "¿Qué hay en el archivo hello.txt?",
      "Ejecuta la herramienta de pelusear",
      "Lee el archivo y luego ejecuta la herramienta",
    ];

    for (let i = 0; i < consultas.length; i++) {
      const consulta = consultas[i];
      console.log(`\n📋 CONSULTA ${i + 1}/${consultas.length}`);
      console.log("─".repeat(50));
      console.log(`👤 USUARIO:`);
      console.log(`"${consulta}"`);
      console.log("-".repeat(40));
      const respuesta = await client.processUserQuery(consulta);
      console.log("🤖 LLM (RESPUESTA FINAL):");
      console.log("-".repeat(40));
      console.log(respuesta);
      console.log("─".repeat(50));
    }
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.disconnect();
  }
}

// Ejemplo con manejo de errores
async function ejemploManejoErrores() {
  console.log("\n" + "=".repeat(60));
  console.log("⚠️ EJEMPLO MANEJO DE ERRORES");
  console.log("=".repeat(60));

  const client = new LLMRestClient({
    apiUrl: "http://localhost:11434/api/chat",
    model: "modelo-inexistente", // Esto causará un error
  });

  try {
    await client.connect();
    const consulta = "Hola";
    console.log(`\n👤 USUARIO:`);
    console.log(`"${consulta}"`);
    console.log("-".repeat(40));
    const respuesta = await client.processUserQuery(consulta);
    console.log("🤖 LLM (RESPUESTA FINAL):");
    console.log("-".repeat(40));
    console.log(respuesta);
    console.log("=".repeat(60));
  } catch (error) {
    console.log("❌ ERROR CAPTURADO:");
    console.log("-".repeat(40));
    console.error(error instanceof Error ? error.message : String(error));
    console.log("=".repeat(60));
  } finally {
    await client.disconnect();
  }
}

// Ejemplo con configuración personalizada
async function ejemploConfiguracionPersonalizada() {
  console.log("\n" + "=".repeat(60));
  console.log("⚙️ EJEMPLO CONFIGURACIÓN PERSONALIZADA");
  console.log("=".repeat(60));

  const client = new LLMRestClient({
    apiUrl: "http://localhost:11434/api/chat",
    model: "gemma3:4b",
  });

  try {
    await client.connect();
    const consulta = "Di hola y ejecuta la herramienta de pelusear";
    console.log(`\n👤 USUARIO:`);
    console.log(`"${consulta}"`);
    console.log("-".repeat(40));
    const respuesta = await client.processUserQuery(consulta);
    console.log("🤖 LLM (RESPUESTA FINAL):");
    console.log("-".repeat(40));
    console.log(respuesta);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.disconnect();
  }
}

// Función principal que ejecuta todos los ejemplos
async function main() {
  console.log("🎯 Ejemplos de Uso del LLM REST Client\n");

  // Verificar que Ollama esté corriendo
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) {
      throw new Error("Ollama no está corriendo");
    }
    console.log("✅ Ollama está corriendo en http://localhost:11434");
  } catch (error) {
    console.error(
      "❌ Error: Ollama no está corriendo. Inicia Ollama con: ollama serve"
    );
    console.log("💡 Para instalar un modelo: ollama pull llama3.2:3b");
    return;
  }

  // Ejecutar ejemplos uno por uno
  await ejemploBasico();
  await ejemploOpenAI();
  await ejemploMultiplesConsultas();
  await ejemploManejoErrores();
  await ejemploConfiguracionPersonalizada();

  console.log("\n✅ Todos los ejemplos completados");
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  ejemploBasico,
  ejemploOpenAI,
  ejemploMultiplesConsultas,
  ejemploManejoErrores,
  ejemploConfiguracionPersonalizada,
};
