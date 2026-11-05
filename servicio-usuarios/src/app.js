const fs = require('fs');
const path = require('path');
const express = require('express');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// 1. Cargar la vista de tu Sistema de Gestión Escolar
const pagina = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Servir archivos estáticos por si tienes CSS o JS en src
app.use(express.static(__dirname));

// Ruta principal (Muestra tu página HTML)
app.get('/', (req, res) => {
  res.type('html').send(pagina);
});

// Endpoint de salud requerido por la práctica
app.get('/health', (req, res) => {
  res.json({ status: 'activo' });
});

// Endpoint de visitas con Redis
app.get('/api/visitas', async (req, res) => {
  try {
    const client = createClient({ url: REDIS_URL });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
    
    const visitas = await client.incr('contador_visitas');
    await client.disconnect();
    
    res.json({ visitas });
  } catch (error) {
    res.status(500).json({ error: 'Error de conexión con Redis' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de Gestión Escolar corriendo en el puerto ${PORT}`);
});