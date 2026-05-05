function notImplemented(methodName) {
  const error = new Error(`Spotify provider placeholder: ${methodName} is not implemented yet.`);
  error.code = 'PROVIDER_PLACEHOLDER';
  error.provider = 'spotify';
  return error;
}

export class SpotifyProvider {
  constructor(options = {}) {
    this.provider = 'spotify';
    this.clientId = options.clientId || process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = options.clientSecret || process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  search() {
    throw notImplemented('search');
  }

  getSongUrl() {
    throw notImplemented('getSongUrl');
  }

  getLyric() {
    throw notImplemented('getLyric');
  }

  recommend() {
    throw notImplemented('recommend');
  }
}
