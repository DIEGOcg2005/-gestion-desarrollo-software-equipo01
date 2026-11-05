const fs = require('fs');
const path = require('path');
const express = require('express');
const { createClient } = require('redis');

const pagina = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function createApp(redisClient) {
  const app = express();

  app.get('/', (req, res) => {
    res.type('html').send(pagina);
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'activo' });
  });

  app.get('/api/visitas', async (req, res) => {
    try {
      const visitas = await redisClient.incr('visitas');
      res.json({ visitas });
    } catch (err) {
      res.status(503).json({ error: 'Redis no disponible', detalle: 'No se pudo actualizar el contador' });
    }
  });

  return app;
}

async function main() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const port = process.env.PORT || 3000;
  const client = createClient({ url, disableOfflineQueue: true });
  client.on('error', (e) => console.error('Redis error:', e.message));
  client.connect().catch((e) => console.error('No se pudo conectar a Redis:', e.message));
  createApp(client).listen(port, '0.0.0.0', () => console.log(`Servidor escuchando en 0.0.0.0:${port}`));
}

if (require.main === module) main();

module.exports = { createApp };
