import { createTtsProvider } from '../01-external-context/voice/index.js';
import { clampText, readRequestBody, sendJson } from './context.js';

const TTS_DEFAULTS = {
  voice: 'zh-CN-XiaoxiaoNeural',
  responseFormat: 'mp3',
};

export function getTtsConfig() {
  try {
    const providerName = process.env.TTS_PROVIDER || 'voicecraft';
    const provider = createTtsProvider(providerName);
    return {
      enabled: true,
      ...provider.getConfig(),
    };
  } catch (error) {
    return {
      enabled: false,
      provider: process.env.TTS_PROVIDER || 'voicecraft',
      baseUrl: process.env.TTS_API_BASE_URL || '',
      configured: false,
      usesApiKey: Boolean(process.env.TTS_API_KEY),
      defaults: TTS_DEFAULTS,
      error: error.message,
    };
  }
}

export async function handleTtsSpeech(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const input = clampText(body.input || body.text, 5000);

    if (!input) {
      sendJson(response, 400, {
        ok: false,
        error: 'input is required.',
      });
      return;
    }

    const provider = createTtsProvider(process.env.TTS_PROVIDER || 'voicecraft');
    const result = await provider.synthesize(input, {
      voice: clampText(body.voice, 64) || undefined,
      speed: body.speed,
      pitch: clampText(body.pitch, 32) || undefined,
      style: clampText(body.style, 64) || undefined,
      volume: clampText(body.volume, 32) || undefined,
      responseFormat: clampText(body.responseFormat || body.format, 24) || undefined,
    });

    response.writeHead(200, {
      'access-control-allow-origin': '*',
      'content-type': result.contentType,
      'content-length': result.contentLength || String(result.audioBuffer.length),
      'x-tts-provider': result.provider,
      'x-tts-voice': result.voice,
    });
    response.end(result.audioBuffer);
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'TTS request failed.',
    });
  }
}
