const DEFAULT_API_BASE_URL = 'https://api.anthropic.com';
const DEFAULT_API_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 1200;

function normalizeMessages({ prompt, messages }) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages;
  }

  if (typeof prompt === 'string' && prompt.trim()) {
    return [{ role: 'user', content: prompt }];
  }

  throw new Error('Claude API call requires either prompt or messages.');
}

function extractTextContent(responseBody) {
  return (responseBody?.content || [])
    .filter((block) => block?.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('')
    .trim();
}

function extractJsonText(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/iu);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstObject = trimmed.indexOf('{');
  const lastObject = trimmed.lastIndexOf('}');
  if (firstObject !== -1 && lastObject > firstObject) {
    return trimmed.slice(firstObject, lastObject + 1);
  }

  const firstArray = trimmed.indexOf('[');
  const lastArray = trimmed.lastIndexOf(']');
  if (firstArray !== -1 && lastArray > firstArray) {
    return trimmed.slice(firstArray, lastArray + 1);
  }

  return trimmed;
}

export class ClaudeApiClient {
  constructor(options = {}) {
    this.provider = 'anthropic';
    this.baseUrl = options.baseUrl || process.env.ANTHROPIC_API_BASE_URL || DEFAULT_API_BASE_URL;
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '';
    this.apiVersion = options.apiVersion || process.env.ANTHROPIC_VERSION || DEFAULT_API_VERSION;
    this.model = options.model || process.env.CLAUDE_MODEL || DEFAULT_MODEL;
    this.maxTokens = Number(options.maxTokens || process.env.CLAUDE_MAX_TOKENS || DEFAULT_MAX_TOKENS);
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
  }

  async createMessage({ prompt, messages, system, model, maxTokens, temperature, metadata, stopSequences } = {}) {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for Claude API access.');
    }

    if (!this.fetchImpl) {
      throw new Error('A fetch implementation is required for Claude API access.');
    }

    const url = new URL('/v1/messages', this.baseUrl);
    const body = {
      model: model || this.model,
      max_tokens: Number(maxTokens || this.maxTokens),
      messages: normalizeMessages({ prompt, messages }),
    };

    if (system) body.system = system;
    if (temperature !== undefined) body.temperature = temperature;
    if (metadata) body.metadata = metadata;
    if (stopSequences) body.stop_sequences = stopSequences;

    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': this.apiVersion,
      },
      body: JSON.stringify(body),
    });

    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = responseBody?.error?.message || `Claude API request failed with ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.body = responseBody;
      error.url = url.toString();
      throw error;
    }

    return responseBody;
  }

  async completeText(prompt, options = {}) {
    const response = await this.createMessage({ ...options, prompt });
    return {
      provider: this.provider,
      model: response.model,
      id: response.id,
      stopReason: response.stop_reason,
      usage: response.usage,
      text: extractTextContent(response),
      raw: response,
    };
  }

  async completeJson(prompt, options = {}) {
    const textResult = await this.completeText(prompt, {
      ...options,
      system: [
        options.system,
        'Return only valid JSON. Do not wrap it in Markdown.',
      ].filter(Boolean).join('\n\n'),
    });

    try {
      return {
        ...textResult,
        json: JSON.parse(extractJsonText(textResult.text)),
      };
    } catch (error) {
      error.message = `Claude API response was not valid JSON: ${error.message}`;
      error.responseText = textResult.text;
      throw error;
    }
  }

  async planRadioTurn({ context, userInput, system, schemaHint } = {}) {
    const prompt = [
      schemaHint || 'Plan the next radio turn as JSON with keys: say, play, reason, segue.',
      context ? `Context:\n${typeof context === 'string' ? context : JSON.stringify(context)}` : '',
      userInput ? `User input:\n${userInput}` : '',
    ].filter(Boolean).join('\n\n');

    const result = await this.completeJson(prompt, { system });
    return result.json;
  }
}
