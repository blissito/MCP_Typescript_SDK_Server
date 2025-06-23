import { useMCP } from 'react-hook-mcp';
import { useState } from 'react';

export default function MCPTest() {
  const { isConnected, loading, readResource, callTool, processQuery } = useMCP();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [resourceContent, setResourceContent] = useState('');

  const handleQuery = async () => {
    if (!query.trim()) return;
    try {
      const result = await processQuery(query);
      setResponse(result.content);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReadResource = async () => {
    try {
      const result = await readResource('file:///hello.txt');
      setResourceContent(result.content);
    } catch (error) {
      setResourceContent(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCallTool = async () => {
    try {
      const result = await callTool('tool-pelusear');
      setResponse(result.content);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Model Context Protocol Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <span>Estado de conexión: </span>
        <span style={{ color: isConnected ? 'green' : 'red', fontWeight: 'bold' }}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </div>

      <textarea
        placeholder="Escribe tu consulta aquí..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ 
          width: '100%', 
          height: 100, 
          marginBottom: '20px', 
          padding: '10px', 
          borderRadius: '4px', 
          border: '1px solid #ddd'
        }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleQuery}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            background: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Consulta'}
        </button>
        <button 
          onClick={handleCallTool}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            background: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Procesando...' : 'Llamar Herramienta'}
        </button>
        <button 
          onClick={handleReadResource}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            background: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Leyendo...' : 'Leer Recurso'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Respuesta</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
      </div>

      <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h3>Contenido del Recurso</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{resourceContent}</pre>
      </div>
    </div>
  );
}
