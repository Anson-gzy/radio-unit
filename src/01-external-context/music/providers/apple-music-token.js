import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const APPLE_MUSIC_MAX_TOKEN_TTL_SECONDS = 15_777_000;

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '');
}

function base64urlJson(value) {
  return base64url(JSON.stringify(value));
}

function readDerLength(buffer, offset) {
  const first = buffer[offset];
  if (first < 0x80) {
    return { length: first, nextOffset: offset + 1 };
  }

  const lengthBytes = first & 0x7f;
  let length = 0;
  for (let index = 0; index < lengthBytes; index += 1) {
    length = (length << 8) + buffer[offset + 1 + index];
  }
  return { length, nextOffset: offset + 1 + lengthBytes };
}

function normalizeSignatureInteger(bytes, size) {
  let value = bytes;
  while (value.length > 0 && value[0] === 0) {
    value = value.subarray(1);
  }
  if (value.length > size) {
    throw new Error('Invalid ES256 signature integer length.');
  }
  return Buffer.concat([Buffer.alloc(size - value.length), value]);
}

export function derToJoseSignature(derSignature, signatureSize = 64) {
  const der = Buffer.from(derSignature);
  let offset = 0;

  if (der[offset] !== 0x30) {
    throw new Error('Invalid DER signature: expected sequence.');
  }
  offset += 1;

  const sequence = readDerLength(der, offset);
  offset = sequence.nextOffset;

  if (der[offset] !== 0x02) {
    throw new Error('Invalid DER signature: expected r integer.');
  }
  offset += 1;

  const rLength = readDerLength(der, offset);
  offset = rLength.nextOffset;
  const r = der.subarray(offset, offset + rLength.length);
  offset += rLength.length;

  if (der[offset] !== 0x02) {
    throw new Error('Invalid DER signature: expected s integer.');
  }
  offset += 1;

  const sLength = readDerLength(der, offset);
  offset = sLength.nextOffset;
  const s = der.subarray(offset, offset + sLength.length);

  const partSize = signatureSize / 2;
  return Buffer.concat([
    normalizeSignatureInteger(r, partSize),
    normalizeSignatureInteger(s, partSize),
  ]);
}

function resolvePrivateKey({ privateKey, privateKeyPath }) {
  const key = privateKey || (privateKeyPath ? readFileSync(privateKeyPath, 'utf8') : '');
  return key.replaceAll('\\n', '\n').trim();
}

export function createAppleMusicDeveloperToken({
  teamId,
  keyId,
  privateKey,
  privateKeyPath,
  expiresInSeconds = 86_400,
  origin,
  now = Math.floor(Date.now() / 1000),
} = {}) {
  if (!teamId) {
    throw new Error('APPLE_MUSIC_TEAM_ID is required to generate an Apple Music developer token.');
  }
  if (!keyId) {
    throw new Error('APPLE_MUSIC_KEY_ID is required to generate an Apple Music developer token.');
  }

  const resolvedPrivateKey = resolvePrivateKey({ privateKey, privateKeyPath });
  if (!resolvedPrivateKey) {
    throw new Error('APPLE_MUSIC_PRIVATE_KEY or APPLE_MUSIC_PRIVATE_KEY_PATH is required to generate an Apple Music developer token.');
  }

  const ttl = Math.min(
    Math.max(Number(expiresInSeconds) || 86_400, 60),
    APPLE_MUSIC_MAX_TOKEN_TTL_SECONDS,
  );
  const header = { alg: 'ES256', kid: keyId };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + ttl,
  };

  if (origin) {
    payload.origin = Array.isArray(origin) ? origin : [origin];
  }

  const signingInput = `${base64urlJson(header)}.${base64urlJson(payload)}`;
  const derSignature = createSign('SHA256')
    .update(signingInput)
    .end()
    .sign(resolvedPrivateKey);
  const joseSignature = derToJoseSignature(derSignature);

  return `${signingInput}.${base64url(joseSignature)}`;
}
