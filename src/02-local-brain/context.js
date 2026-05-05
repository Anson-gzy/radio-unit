import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, normalize, resolve } from 'node:path';

const moduleDir = fileURLToPath(new URL('.', import.meta.url));

export const projectRoot = resolve(moduleDir, '../..');
export const publicDir = join(projectRoot, 'src', '04-surface', 'pwa');
export const runtimeDir = join(projectRoot, 'src', '03-runtime-aggregation');
export const userDir = join(projectRoot, 'src', '01-external-context', 'user');
export const appName = 'Sonic Particles';
export const appBuild = '0.1.0';

export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function loadEnvFile() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = stripWrappingQuotes(rawValue).replaceAll('\\n', '\n');
  }
}

export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  });
  response.end(JSON.stringify(payload));
}

export function sendText(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'text/plain; charset=utf-8',
  });
  response.end(payload);
}

export function clampText(value, max = 120) {
  return String(value || '').trim().slice(0, max);
}

export function readCommaList(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function readNumber(value, fallback, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = {}) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return fallback;
  }

  return Math.min(Math.max(numeric, min), max);
}

export function getRequestUserToken(request, url) {
  const headerToken = request.headers['music-user-token'] || request.headers['x-music-user-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return clampText(headerToken, 4096);
  }

  const queryToken = url.searchParams.get('musicUserToken');
  if (queryToken) {
    return clampText(queryToken, 4096);
  }

  return '';
}

export function formatDuration(durationMs) {
  if (!durationMs || Number.isNaN(Number(durationMs))) {
    return '未知时长';
  }

  const totalSeconds = Math.max(0, Math.round(Number(durationMs) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function serveStatic(pathname, response, method = 'GET') {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    const contentType = MIME_TYPES[extname(filePath)] || 'application/octet-stream';
    response.writeHead(200, { 'content-type': contentType });
    response.end(method === 'HEAD' ? undefined : file);
  } catch {
    sendText(response, 404, 'Not found');
  }
}
