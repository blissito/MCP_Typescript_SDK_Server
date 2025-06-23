import { TestMCPClient, LLMConfig } from './TestMCPClient';

// Configuración del cliente
const config: LLMConfig = {
  apiUrl: "http://localhost:11434/api/chat",
  model: "llama3.2:3b"
};

async function testClient() {
  try {
    // Crear una instancia del cliente de prueba
    const client = new TestMCPClient(config);

    // 1. Probar conexión
    console.log(' TESTING CONNECTION...');
    await client.connect();
    console.log('✅ Conexión exitosa');

    // 2. Probar consulta al LLM
    console.log('\n TESTING LLM QUERY...');
    const llmResponse = await client.processUserQuery("¿Qué es la MCP?");
    console.log('✅ Respuesta recibida:', llmResponse);

    // 3. Probar lectura de recurso
    console.log('\n TESTING RESOURCE READ...');
    const resourceResponse = await client.readResource("file:///hello.txt");
    console.log('✅ Recurso leído:', resourceResponse);

    // 4. Probar ejecución de herramienta
    console.log('\n TESTING TOOL EXECUTION...');
    const toolResponse = await client.callTool("tool-pelusear");
    console.log('✅ Herramienta ejecutada:', toolResponse);

    // 5. Desconectar
    console.log('\n TESTING DISCONNECTION...');
    await client.disconnect();
    console.log('✅ Desconexión exitosa');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar las pruebas
console.log('Starting tests...');
testClient();
