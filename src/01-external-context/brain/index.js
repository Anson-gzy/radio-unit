import { ClaudeApiClient } from './providers/claude-api.js';
import { OpenAIResponsesClient } from './providers/openai-responses.js';

export { ClaudeApiClient };
export { OpenAIResponsesClient };

export function createBrainClient(options = {}) {
  const provider = String(options.provider || process.env.BRAIN_PROVIDER || process.env.MODEL_PROVIDER || '').toLowerCase();
  if (['openai', 'openai-responses', 'rightcode'].includes(provider)) {
    return new OpenAIResponsesClient(options);
  }

  return new ClaudeApiClient(options);
}
