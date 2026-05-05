import { VoiceCraftTtsProvider } from './providers/voicecraft.js';

export const TTS_PROVIDER_NAMES = ['voicecraft'];

export {
  VoiceCraftTtsProvider,
};

export function createTtsProvider(name, options = {}) {
  switch (name) {
    case 'voicecraft':
    case 'tts':
      return new VoiceCraftTtsProvider(options);
    default:
      throw new Error(`Unknown TTS provider: ${name}`);
  }
}
