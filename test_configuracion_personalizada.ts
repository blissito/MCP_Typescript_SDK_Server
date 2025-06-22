import { ejemploConfiguracionPersonalizada } from "./llm_client_example.js";

console.log("🔍 Test de Configuración Personalizada");
console.log("=====================================");

ejemploConfiguracionPersonalizada()
  .then(() => {
    console.log("✅ Test completado");
  })
  .catch((error) => {
    console.error("❌ Test falló:", error);
  });
