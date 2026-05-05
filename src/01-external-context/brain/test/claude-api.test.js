import assert from 'node:assert/strict';
import test from 'node:test';

import { ClaudeApiClient, OpenAIResponsesClient, createBrainClient } from '../index.js';

test('Claude API client sends Messages API request with API-key headers', async () => {
  const requests = [];
  const client = new ClaudeApiClient({
    apiKey: 'test-key',
    model: 'claude-sonnet-4-20250514',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            id: 'msg_123',
            type: 'message',
            role: 'assistant',
            model: 'claude-sonnet-4-20250514',
            stop_reason: 'end_turn',
            usage: { input_tokens: 10, output_tokens: 8 },
            content: [{ type: 'text', text: '{"say":"hello","play":[],"reason":"test","segue":""}' }],
          };
        },
      };
    },
  });

  const result = await client.completeJson('hello');
  const body = JSON.parse(requests[0].init.body);

  assert.equal(requests[0].url.toString(), 'https://api.anthropic.com/v1/messages');
  assert.equal(requests[0].init.method, 'POST');
  assert.equal(requests[0].init.headers['x-api-key'], 'test-key');
  assert.equal(requests[0].init.headers['anthropic-version'], '2023-06-01');
  assert.equal(body.model, 'claude-sonnet-4-20250514');
  assert.deepEqual(body.messages, [{ role: 'user', content: 'hello' }]);
  assert.equal(result.json.say, 'hello');
});

test('createBrainClient exposes API-backed Claude client', () => {
  const client = createBrainClient({ apiKey: 'test-key', fetchImpl: async () => ({}) });
  assert.equal(client.provider, 'anthropic');
});

test('createBrainClient exposes RightCode Responses client', () => {
  const client = createBrainClient({
    provider: 'rightcode',
    apiKey: 'test-key',
    fetchImpl: async () => ({}),
  });
  assert.equal(client.provider, 'rightcode');
});

test('OpenAI Responses client sends Responses API request with bearer auth', async () => {
  const requests = [];
  const client = new OpenAIResponsesClient({
    provider: 'rightcode',
    apiKey: 'test-key',
    baseUrl: 'https://right.codes/codex/v1',
    model: 'gpt-5.4-high',
    reasoningEffort: 'xhigh',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        async text() {
          return JSON.stringify({
            id: 'resp_123',
            model: 'gpt-5.4-high',
            output_text: '{"say":"hello","play":[],"reason":"test","segue":""}',
          });
        },
      };
    },
  });

  const result = await client.completeJson('hello');
  const body = JSON.parse(requests[0].init.body);

  assert.equal(requests[0].url.toString(), 'https://right.codes/codex/v1/responses');
  assert.equal(requests[0].init.method, 'POST');
  assert.equal(requests[0].init.headers.authorization, 'Bearer test-key');
  assert.equal(body.model, 'gpt-5.4-high');
  assert.deepEqual(body.reasoning, { effort: 'xhigh' });
  assert.deepEqual(body.input, [{ role: 'user', content: 'hello' }]);
  assert.equal(result.json.say, 'hello');
});

test('OpenAI Responses client parses streamed response events', async () => {
  const client = new OpenAIResponsesClient({
    apiKey: 'test-key',
    baseUrl: 'https://right.codes/codex/v1',
    model: 'gpt-5.4-high',
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      async text() {
        return [
          'event: response.output_text.delta',
          'data: {"delta":"{\\"say\\":\\"hello\\""}',
          '',
          'event: response.output_text.delta',
          'data: {"delta":",\\"play\\":[],\\"reason\\":\\"test\\",\\"segue\\":\\"\\"}"}',
          '',
          'event: response.completed',
          'data: {"response":{"id":"resp_123","model":"gpt-5.4-high","usage":{"input_tokens":1}}}',
          '',
        ].join('\n');
      },
    }),
  });

  const result = await client.completeJson('hello');

  assert.equal(result.json.say, 'hello');
  assert.equal(result.id, 'resp_123');
});

test('Claude API client fails early without API key', async () => {
  const client = new ClaudeApiClient({ apiKey: '', fetchImpl: async () => ({}) });
  await assert.rejects(() => client.completeText('hello'), /ANTHROPIC_API_KEY/);
});
