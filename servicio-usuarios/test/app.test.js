const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

function levantar(redisFalso) {
  return new Promise((resolve) => {
    const server = createApp(redisFalso).listen(0, () => resolve(server));
  });
}

test('GET / muestra el titulo Control de visitas', async () => {
  const server = await levantar({});
  const res = await fetch(`http://localhost:${server.address().port}/`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /Control de visitas/);
  server.close();
});

test('GET /health responde estado activo', async () => {
  const server = await levantar({});
  const res = await fetch(`http://localhost:${server.address().port}/health`);
  assert.deepStrictEqual(await res.json(), { status: 'activo' });
  server.close();
});

test('GET /api/visitas incrementa el contador', async () => {
  let n = 0;
  const server = await levantar({ incr: async () => ++n });
  const base = `http://localhost:${server.address().port}`;
  assert.strictEqual((await (await fetch(`${base}/api/visitas`)).json()).visitas, 1);
  assert.strictEqual((await (await fetch(`${base}/api/visitas`)).json()).visitas, 2);
  server.close();
});

test('GET /api/visitas devuelve 503 controlado si Redis falla', async () => {
  const server = await levantar({ incr: async () => { throw new Error('caido'); } });
  const res = await fetch(`http://localhost:${server.address().port}/api/visitas`);
  assert.strictEqual(res.status, 503);
  assert.strictEqual((await res.json()).error, 'Redis no disponible');
  server.close();
});
