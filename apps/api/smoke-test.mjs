import { spawn } from 'node:child_process';
import { once } from 'node:events';
import assert from 'node:assert/strict';

const port = 8877;
const server = spawn(process.execPath, ['server.mjs'], {
  cwd: new URL('.', import.meta.url),
  env: { ...process.env, PORT: String(port), TEM_DATA_FILE: 'data/smoke-test-requests.json' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  await waitForHealth(port);

  const marketBefore = await fetch(`http://localhost:${port}/market/slots`);
  assert.equal(marketBefore.status, 200);
  assert.ok((await marketBefore.json()).some((slot) => slot.id === 'sun-1630'));

  const bad = await fetch(`http://localhost:${port}/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ guestName: '' }),
  });
  assert.equal(bad.status, 400);

  const createdResponse = await fetch(`http://localhost:${port}/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      slotId: 'sun-1630',
      typeId: 'talk',
      guestName: 'Smoke Tester',
      guestEmail: 'smoke@example.com',
      note: 'API smoke test',
      amount: 500,
      currency: 'sats',
    }),
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.status, 'host_review');

  const acceptedResponse = await fetch(`http://localhost:${port}/requests/${created.id}/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'accepted' }),
  });
  assert.equal(acceptedResponse.status, 200);
  const requests = await acceptedResponse.json();
  assert.equal(requests.find((request) => request.id === created.id).status, 'accepted');

  const marketAfter = await fetch(`http://localhost:${port}/market/slots`);
  const slots = await marketAfter.json();
  assert.equal(slots.find((slot) => slot.id === 'sun-1630').marketStatus, 'busy');
} finally {
  server.kill('SIGTERM');
}

async function waitForHealth(port) {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  const [code] = await Promise.race([
    once(server, 'exit'),
    new Promise((resolve) => setTimeout(() => resolve(['timeout']), 10)),
  ]);
  throw new Error(`API did not start: ${code}`);
}
