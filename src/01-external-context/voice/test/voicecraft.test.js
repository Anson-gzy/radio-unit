import assert from 'node:assert/strict';
import test from 'node:test';

import { createTtsProvider, VoiceCraftTtsProvider } from '../index.js';

test('createTtsProvider exposes VoiceCraft provider', () => {
  const provider = createTtsProvider('voicecraft');
  assert.equal(provider.provider, 'voicecraft');
});

test('VoiceCraft provider uses configured speech endpoint', async () => {
  const requests = [];
  const provider = new VoiceCraftTtsProvider({
    baseUrl: 'https://tts.example.com',
    apiKey: 'secret-key',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        headers: new Map([
          ['content-type', 'audio/mpeg'],
          ['content-length', '4'],
        ]),
        async arrayBuffer() {
          return new Uint8Array([1, 2, 3, 4]).buffer;
        },
      };
    },
  });

  const result = await provider.synthesize('hello world', {
    voice: 'zh-CN-YunxiNeural',
    speed: 1.2,
    style: 'calm',
  });

  const body = JSON.parse(requests[0].init.body);
  assert.equal(requests[0].url.toString(), 'https://tts.example.com/v1/audio/speech');
  assert.equal(requests[0].init.method, 'POST');
  assert.equal(requests[0].init.headers.authorization, 'Bearer secret-key');
  assert.equal(requests[0].init.headers['x-api-key'], 'secret-key');
  assert.equal(body.voice, 'zh-CN-YunxiNeural');
  assert.equal(body.speed, 1.2);
  assert.equal(body.style, 'calm');
  assert.equal(result.contentType, 'audio/mpeg');
  assert.equal(result.audioBuffer.length, 4);
});

test('VoiceCraft provider requires non-empty text', async () => {
  const provider = new VoiceCraftTtsProvider({
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Map(),
      async arrayBuffer() {
        return new ArrayBuffer(0);
      },
    }),
  });

  await assert.rejects(() => provider.synthesize('   '), /TTS input is required/);
});
