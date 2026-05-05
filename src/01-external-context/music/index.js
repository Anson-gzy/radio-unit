import { AppleMusicProvider } from './providers/apple-music.js';
import { NeteaseCloudMusicProvider } from './providers/netease.js';
import { SpotifyProvider } from './providers/spotify.js';

export const MUSIC_PROVIDER_NAMES = ['netease', 'apple-music', 'spotify'];

export {
  AppleMusicProvider,
  NeteaseCloudMusicProvider,
  SpotifyProvider,
};

export function createMusicProvider(name, options = {}) {
  switch (name) {
    case 'netease':
    case 'ncm':
      return new NeteaseCloudMusicProvider(options);
    case 'apple-music':
    case 'am':
      return new AppleMusicProvider(options);
    case 'spotify':
      return new SpotifyProvider(options);
    default:
      throw new Error(`Unknown music provider: ${name}`);
  }
}

export function createDefaultMusicProviders(options = {}) {
  return {
    netease: new NeteaseCloudMusicProvider(options.netease),
    appleMusic: new AppleMusicProvider(options.appleMusic),
    spotify: new SpotifyProvider(options.spotify),
  };
}
