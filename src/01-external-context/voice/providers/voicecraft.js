const DEFAULT_BASE_URL = 'https://tts.wangwangit.com';
const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';
const DEFAULT_FORMAT = 'mp3';

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/u, '');
}

function buildSpeechPayload(input, options = {}) {
  return {
    input,
    voice: options.voice || DEFAULT_VOICE,
    speed: options.speed ?? 1.0,
    pitch: options.pitch ?? '0',
    style: options.style || 'general',
    volume: options.volume ?? '0',
    response_format: options.responseFormat || DEFAULT_FORMAT,
  };
}

export class VoiceCraftTtsProvider {
  constructor(options = {}) {
    this.provider = 'voicecraft';
    this.baseUrl = trimTrailingSlash(options.baseUrl || process.env.TTS_API_BASE_URL || DEFAULT_BASE_URL);
    this.apiKey = options.apiKey || process.env.TTS_API_KEY || '';
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
  }

  getConfig() {
    return {
      provider: this.provider,
      baseUrl: this.baseUrl,
      configured: Boolean(this.baseUrl),
      usesApiKey: Boolean(this.apiKey),
      defaults: {
        voice: DEFAULT_VOICE,
        responseFormat: DEFAULT_FORMAT,
      },
    };
  }

  async synthesize(input, options = {}) {
    const text = String(input || '').trim();
    if (!text) {
      throw new Error('TTS input is required.');
    }

    if (!this.fetchImpl) {
      throw new Error('A fetch implementation is required for TTS access.');
    }

    const url = new URL('/v1/audio/speech', `${this.baseUrl}/`);
    const headers = {
      'content-type': 'application/json',
    };

    if (this.apiKey) {
      headers.authorization = `Bearer ${this.apiKey}`;
      headers['x-api-key'] = this.apiKey;
    }

    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildSpeechPayload(text, options)),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `TTS request failed with ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return {
      provider: this.provider,
      audioBuffer: Buffer.from(arrayBuffer),
      contentType: response.headers.get('content-type') || 'audio/mpeg',
      contentLength: response.headers.get('content-length') || '',
      voice: options.voice || DEFAULT_VOICE,
      format: options.responseFormat || DEFAULT_FORMAT,
    };
  }
}
