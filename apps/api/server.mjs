import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCreateRequest, validateStatus } from './validation.mjs';
import { getMarketSlots } from './fixtures.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const dataFile = process.env.TEM_DATA_FILE ? resolve(root, process.env.TEM_DATA_FILE) : resolve(root, 'data/requests.json');
const port = Number(process.env.PORT ?? 8787);

const seedRequests = [
  {
    id: 'req-seed-1',
    slotId: 'tue-1500',
    typeId: 'urgent',
    guestName: 'Tal',
    guestEmail: 'tal@example.com',
    note: 'Need you for something time-sensitive. Worth interrupting the day.',
    amount: 3250,
    currency: 'sats',
    status: 'host_review',
    createdAt: '2026-05-03T12:00:00Z'
  }
];

async function ensureStore() {
  await mkdir(dirname(dataFile), { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch {
    await writeRequests(seedRequests);
  }
}

async function readRequests() {
  await ensureStore();
  return JSON.parse(await readFile(dataFile, 'utf8'));
}

async function writeRequests(requests) {
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(requests, null, 2));
}

function acceptBookingRequest(requests, acceptedId) {
  const accepted = requests.find((request) => request.id === acceptedId);
  if (!accepted) return requests;

  return requests.map((request) => {
    if (request.id === acceptedId) return { ...request, status: 'accepted' };
    if (request.slotId === accepted.slotId && request.status === 'host_review') {
      return { ...request, status: 'rejected' };
    }
    return request;
  });
}

function rejectBookingRequest(requests, rejectedId) {
  return requests.map((request) => request.id === rejectedId ? { ...request, status: 'rejected' } : request);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(res, status, body) {
  res.writeHead(status, {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-type': 'application/json',
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});

    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { ok: true });
    }

    if (req.method === 'GET' && url.pathname === '/requests') {
      return send(res, 200, await readRequests());
    }

    if (req.method === 'GET' && url.pathname === '/market/slots') {
      return send(res, 200, getMarketSlots(await readRequests()));
    }

    if (req.method === 'POST' && url.pathname === '/requests') {
      const input = await readBody(req);
      const validation = validateCreateRequest(input);
      if (!validation.ok) return send(res, 400, { error: 'validation_failed', details: validation.errors });
      const request = {
        ...validation.value,
        id: `req-${Date.now()}`,
        status: 'host_review',
        createdAt: new Date().toISOString(),
      };
      const requests = [request, ...(await readRequests())];
      await writeRequests(requests);
      return send(res, 201, request);
    }

    const statusMatch = url.pathname.match(/^\/requests\/([^/]+)\/status$/);
    if (req.method === 'PATCH' && statusMatch) {
      const body = await readBody(req);
      const validation = validateStatus(body);
      if (!validation.ok) return send(res, 400, { error: 'validation_failed', details: validation.errors });
      const requests = await readRequests();
      if (!requests.some((request) => request.id === statusMatch[1])) return send(res, 404, { error: 'request_not_found' });
      const updated = validation.value === 'accepted'
        ? acceptBookingRequest(requests, statusMatch[1])
        : validation.value === 'rejected'
          ? rejectBookingRequest(requests, statusMatch[1])
          : requests;
      await writeRequests(updated);
      return send(res, 200, updated);
    }

    send(res, 404, { error: 'not_found' });
  } catch (error) {
    send(res, 500, { error: error instanceof Error ? error.message : 'unknown_error' });
  }
});

server.listen(port, () => {
  console.log(`tem api listening on http://localhost:${port}`);
});
