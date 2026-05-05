import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const DEFAULT_API_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-5.4-high';
const DEFAULT_MAX_TOKENS = 1200;

function normalizeMessages({ prompt, messages }) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages;
  }

  if (typeof prompt === 'string' && prompt.trim()) {
    return [{ role: 'user', content: prompt }];
  }

  throw new Error('OpenAI Responses API call requires either prompt or messages.');
}

function readCodexOpenAiKey() {
  const authPath = join(homedir(), '.codex', 'auth.json');
  if (!existsSync(authPath)) {
    return '';
  }

  try {
    const data = JSON.parse(readFileSync(authPath, 'utf8'));
    return typeof data.OPENAI_API_KEY === 'string' ? data.OPENAI_API_KEY : '';
  } catch {
    return '';
  }
}

function extractOutputText(responseBody) {
  if (typeof responseBody?.output_text === 'string') {
    return responseBody.output_text.trim();
  }

  const output = Array.isArray(responseBody?.output) ? responseBody.output : [];
  return output
    .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    .map((block) => {
      if (typeof block?.text === 'string') return block.text;
      if (typeof block?.content === 'string') return block.content;
      return '';
    })
    .filter(Boolean)
    .join('')
    .trim();
}

function parseSseResponse(text) {
  let outputText = '';
  let completedResponse = null;

  for (const block of text.split(/\n\n/u)) {
    const event = block.match(/^event: (.+)$/mu)?.[1];
    const dataText = block.match(/^data: ([\s\S]+)$/mu)?.[1];
    if (!event || !dataText || dataText === '[DONE]') {
      continue;
    }

    let data;
    try {
      data = JSON.parse(dataText);
    } catch {
      continue;
    }

    if (event === 'response.output_text.delta' && typeof data.delta === 'string') {
      outputText += data.delta;
    }
    if (event === 'response.output_text.done' && typeof data.text === 'string') {
      outputText = data.text;
    }
    if (event === 'response.completed') {
      completedResponse = data.response || data;
    }
  }

  return {
    ...(completedResponse || {}),
    output_text: outputText || completedResponse?.output_text || '',
  };
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

function appendPath(baseUrl, path) {
  const normalizedBase = String(baseUrl).endsWith('/') ? String(baseUrl) : `${baseUrl}/`;
  return new URL(path.replace(/^\/+/u, ''), normalizedBase);
}

export class OpenAIResponsesClient {
  constructor(options = {}) {
    this.provider = options.provider || process.env.BRAIN_PROVIDER || process.env.MODEL_PROVIDER || 'openai';
    this.baseUrl = options.baseUrl ||
      process.env.OPENAI_API_BASE_URL ||
      process.env.RIGHTCODE_API_BASE_URL ||
      DEFAULT_API_BASE_URL;
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || readCodexOpenAiKey();
    this.model = options.model || process.env.OPENAI_MODEL || process.env.MODEL || DEFAULT_MODEL;
    this.maxTokens = Number(options.maxTokens || process.env.OPENAI_MAX_TOKENS || DEFAULT_MAX_TOKENS);
    this.reasoningEffort = options.reasoningEffort ||
      process.env.OPENAI_REASONING_EFFORT ||
      process.env.MODEL_REASONING_EFFORT ||
      '';
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
  }

  async createResponse({ prompt, messages, system, model, maxTokens, temperature, metadata } = {}) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAI Responses API access.');
    }

    if (!this.fetchImpl) {
      throw new Error('A fetch implementation is required for OpenAI Responses API access.');
    }

    const url = appendPath(this.baseUrl, 'responses');
    const body = {
      model: model || this.model,
      input: normalizeMessages({ prompt, messages }),
      max_output_tokens: Number(maxTokens || this.maxTokens),
      store: false,
    };

    if (system) body.instructions = system;
    if (temperature !== undefined) body.temperature = temperature;
    if (metadata) body.metadata = metadata;
    if (this.reasoningEffort) body.reasoning = { effort: this.reasoningEffort };

    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const responseBody = contentType.includes('text/event-stream') || responseText.startsWith('event:')
      ? parseSseResponse(responseText)
      : JSON.parse(responseText || '{}');

    if (!response.ok) {
      const message = responseBody?.error?.message || `OpenAI Responses API request failed with ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.body = responseBody;
      error.url = url.toString();
      throw error;
    }

    return responseBody;
  }

  async completeText(prompt, options = {}) {
    const response = await this.createResponse({ ...options, prompt });
    return {
      provider: this.provider,
      model: response.model || this.model,
      id: response.id,
      stopReason: response.status || response.stop_reason,
      usage: response.usage,
      text: extractOutputText(response),
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
      error.message = `OpenAI Responses API response was not valid JSON: ${error.message}`;
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
