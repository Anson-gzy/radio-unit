import { createAppleMusicDeveloperToken } from './apple-music-token.js';

const DEFAULT_BASE_URL = 'https://api.music.apple.com/v1';
const DEFAULT_STOREFRONT = 'us';

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ''),
  );
}

function toCommaList(value) {
  return Array.isArray(value) ? value.join(',') : value;
}

function appendQuery(url, query) {
  for (const [key, value] of Object.entries(compactObject(query))) {
    url.searchParams.set(key, String(toCommaList(value)));
  }
}

function firstDataItem(response) {
  return Array.isArray(response?.data) ? response.data[0] : undefined;
}

function normalizeAppleMusicSong(song) {
  const attributes = song?.attributes || {};
  const preview = Array.isArray(attributes.previews) ? attributes.previews[0] : undefined;

  return {
    provider: 'apple-music',
    id: song?.id,
    type: song?.type,
    name: attributes.name,
    artistName: attributes.artistName,
    albumName: attributes.albumName,
    durationMs: attributes.durationInMillis,
    artwork: attributes.artwork,
    url: attributes.url,
    previewUrl: preview?.url,
    hasLyrics: attributes.hasLyrics,
    playParams: attributes.playParams,
    raw: song,
  };
}

function normalizeAppleMusicLibrarySong(song) {
  const attributes = song?.attributes || {};

  return {
    provider: 'apple-music',
    id: song?.id,
    type: song?.type,
    name: attributes.name,
    artistName: attributes.artistName,
    albumName: attributes.albumName,
    durationMs: attributes.durationInMillis,
    artwork: attributes.artwork,
    url: attributes.url,
    playParams: attributes.playParams,
    raw: song,
    isLibrary: true,
  };
}

function normalizeAppleMusicTrack(song) {
  const isLibrary = Boolean(song?.isLibrary) || String(song?.type || '').startsWith('library-');
  const base = isLibrary ? normalizeAppleMusicLibrarySong(song) : normalizeAppleMusicSong(song);
  const attributes = song?.attributes || {};

  return {
    ...base,
    trackNumber: attributes.trackNumber,
    discNumber: attributes.discNumber,
  };
}

function normalizeAppleMusicCollection(collection) {
  const attributes = collection?.attributes || {};
  const isLibrary = String(collection?.type || '').startsWith('library-');

  return {
    provider: 'apple-music',
    id: collection?.id,
    type: collection?.type,
    name: attributes.name,
    artistName: attributes.artistName || attributes.curatorName,
    artwork: attributes.artwork,
    url: attributes.url,
    playParams: attributes.playParams,
    trackCount: attributes.trackCount,
    description: attributes.description,
    isLibrary,
    raw: collection,
  };
}

function collectionPathSegment(kind) {
  return kind === 'playlist' ? 'playlists' : 'albums';
}

export class AppleMusicProvider {
  constructor(options = {}) {
    this.provider = 'apple-music';
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.storefront = options.storefront || process.env.APPLE_MUSIC_STOREFRONT || DEFAULT_STOREFRONT;
    this.userToken = options.userToken || process.env.APPLE_MUSIC_USER_TOKEN || '';
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.developerToken = options.developerToken || process.env.APPLE_MUSIC_DEVELOPER_TOKEN || '';
    this.apiDeveloperToken = options.apiDeveloperToken || process.env.APPLE_MUSIC_API_DEVELOPER_TOKEN || '';
    this.tokenOptions = {
      teamId: options.teamId || process.env.APPLE_MUSIC_TEAM_ID,
      keyId: options.keyId || process.env.APPLE_MUSIC_KEY_ID,
      privateKey: options.privateKey || process.env.APPLE_MUSIC_PRIVATE_KEY,
      privateKeyPath: options.privateKeyPath || process.env.APPLE_MUSIC_PRIVATE_KEY_PATH,
      expiresInSeconds: options.tokenTTLSeconds || process.env.APPLE_MUSIC_TOKEN_TTL_SECONDS || 86_400,
      origin: options.origin || process.env.APPLE_MUSIC_TOKEN_ORIGIN,
    };
  }

  getDeveloperToken({ includeOrigin = true } = {}) {
    if (!includeOrigin) {
      if (this.apiDeveloperToken) {
        return this.apiDeveloperToken;
      }
      const canGenerateScopedToken = this.tokenOptions.teamId &&
        this.tokenOptions.keyId &&
        (this.tokenOptions.privateKey || this.tokenOptions.privateKeyPath);
      if (!canGenerateScopedToken && this.developerToken) {
        return this.developerToken;
      }
      this.apiDeveloperToken = createAppleMusicDeveloperToken({
        ...this.tokenOptions,
        origin: '',
      });
      return this.apiDeveloperToken;
    }

    if (!this.developerToken) {
      this.developerToken = createAppleMusicDeveloperToken(this.tokenOptions);
    }
    return this.developerToken;
  }

  async request(path, { query = {}, storefront, userToken, method = 'GET' } = {}) {
    if (!this.fetchImpl) {
      throw new Error('A fetch implementation is required for Apple Music API requests.');
    }

    const resolvedPath = path.replace('{storefront}', encodeURIComponent(storefront || this.storefront));
    const url = new URL(`${this.baseUrl}${resolvedPath}`);
    appendQuery(url, query);

    const headers = {
      Authorization: `Bearer ${this.getDeveloperToken({ includeOrigin: false })}`,
      Accept: 'application/json',
    };

    const resolvedUserToken = userToken || this.userToken;
    if (resolvedUserToken) {
      headers['Music-User-Token'] = resolvedUserToken;
    }

    const response = await this.fetchImpl(url, { method, headers });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = body?.errors?.[0]?.detail || body?.errors?.[0]?.title || `Apple Music API request failed with ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.body = body;
      error.url = url.toString();
      throw error;
    }

    return body;
  }

  async search(term, options = {}) {
    const raw = await this.request('/catalog/{storefront}/search', {
      storefront: options.storefront,
      userToken: options.userToken,
      query: {
        term,
        types: options.types || ['songs', 'albums', 'artists', 'playlists'],
        limit: options.limit || 10,
        offset: options.offset,
        l: options.language,
      },
    });

    const results = raw.results || {};
    return {
      provider: this.provider,
      raw,
      songs: (results.songs?.data || []).map(normalizeAppleMusicSong),
      albums: results.albums?.data || [],
      artists: results.artists?.data || [],
      playlists: results.playlists?.data || [],
    };
  }

  async searchLibrary(term, options = {}) {
    const userToken = options.userToken || this.userToken;
    if (!userToken) {
      throw new Error('Music-User-Token is required for Apple Music library search.');
    }

    const raw = await this.request('/me/library/search', {
      userToken,
      query: {
        term,
        types: options.types || ['library-songs', 'library-albums', 'library-artists', 'library-playlists'],
        limit: options.limit || 10,
        offset: options.offset,
        l: options.language,
      },
    });

    const results = raw.results || {};
    return {
      provider: this.provider,
      raw,
      songs: (results['library-songs']?.data || []).map(normalizeAppleMusicLibrarySong),
      albums: results['library-albums']?.data || [],
      artists: results['library-artists']?.data || [],
      playlists: results['library-playlists']?.data || [],
      library: true,
    };
  }

  async getSong(id, options = {}) {
    const raw = await this.request(`/catalog/{storefront}/songs/${encodeURIComponent(id)}`, {
      storefront: options.storefront,
      userToken: options.userToken,
      query: {
        include: options.include,
        extend: options.extend,
        l: options.language,
      },
    });

    return {
      provider: this.provider,
      raw,
      song: normalizeAppleMusicSong(firstDataItem(raw)),
    };
  }

  async getSongUrl(id, options = {}) {
    const result = await this.getSong(id, options);
    return {
      provider: this.provider,
      id,
      url: result.song?.url,
      previewUrl: result.song?.previewUrl,
      playbackUrl: null,
      reason: 'Apple Music API returns catalog URLs, previews, and playParams, not direct full-track audio files.',
      playParams: result.song?.playParams,
      song: result.song,
      raw: result.raw,
    };
  }

  async getCollectionTracks(kind, id, options = {}) {
    const normalizedKind = kind === 'playlist' ? 'playlist' : 'album';
    const pathSegment = collectionPathSegment(normalizedKind);
    const isLibrary = options.scope === 'library';
    const resourcePath = isLibrary
      ? `/me/library/${pathSegment}/${encodeURIComponent(id)}`
      : `/catalog/{storefront}/${pathSegment}/${encodeURIComponent(id)}`;
    const sharedOptions = {
      storefront: options.storefront,
      userToken: options.userToken,
      query: {
        include: isLibrary ? undefined : 'tracks',
        l: options.language,
      },
    };

    const rawCollection = await this.request(resourcePath, sharedOptions);
    const collection = firstDataItem(rawCollection);
    let tracks = Array.isArray(collection?.relationships?.tracks?.data)
      ? collection.relationships.tracks.data
      : [];
    let rawTracks = null;

    if (tracks.length === 0) {
      rawTracks = await this.request(`${resourcePath}/tracks`, {
        storefront: options.storefront,
        userToken: options.userToken,
        query: {
          l: options.language,
        },
      });
      tracks = Array.isArray(rawTracks?.data) ? rawTracks.data : [];
    }

    return {
      provider: this.provider,
      raw: {
        collection: rawCollection,
        tracks: rawTracks,
      },
      collection: normalizeAppleMusicCollection(collection),
      tracks: tracks.map(normalizeAppleMusicTrack),
      scope: isLibrary ? 'library' : 'catalog',
      kind: normalizedKind,
    };
  }

  async recommend(options = {}) {
    if (options.personalized) {
      return this.getPersonalizedRecommendations(options);
    }
    return this.getCharts(options);
  }

  async getCharts(options = {}) {
    const raw = await this.request('/catalog/{storefront}/charts', {
      storefront: options.storefront,
      userToken: options.userToken,
      query: {
        types: options.types || ['songs'],
        chart: options.chart,
        genre: options.genre,
        limit: options.limit || 20,
        offset: options.offset,
        with: options.with,
        l: options.language,
      },
    });

    const songCharts = raw.results?.songs || [];
    const songs = songCharts.flatMap((chart) => chart.data || []).map(normalizeAppleMusicSong);
    return {
      provider: this.provider,
      raw,
      songs,
      charts: raw.results || {},
    };
  }

  async getPersonalizedRecommendations(options = {}) {
    const userToken = options.userToken || this.userToken;
    if (!userToken) {
      throw new Error('APPLE_MUSIC_USER_TOKEN is required for personalized Apple Music recommendations.');
    }

    const raw = await this.request('/me/recommendations', {
      userToken,
      query: {
        limit: options.limit || 10,
        offset: options.offset,
        l: options.language,
      },
    });

    return {
      provider: this.provider,
      raw,
      recommendations: raw.data || [],
    };
  }

  async getUserStorefront(options = {}) {
    const userToken = options.userToken || this.userToken;
    if (!userToken) {
      throw new Error('APPLE_MUSIC_USER_TOKEN is required to fetch the Apple Music storefront.');
    }

    const raw = await this.request('/me/storefront', {
      userToken,
      query: {
        l: options.language,
      },
    });

    return {
      provider: this.provider,
      raw,
      storefront: firstDataItem(raw),
    };
  }

  async getLyric(id) {
    const error = new Error(`Apple Music API does not expose full lyrics through the catalog HTTP API for song ${id}.`);
    error.code = 'UNSUPPORTED_FEATURE';
    error.provider = this.provider;
    throw error;
  }
}
