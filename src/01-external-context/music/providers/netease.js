const DEFAULT_BASE_URL = 'http://localhost:3000';

function appendQuery(url, query) {
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
}

export class NeteaseCloudMusicProvider {
  constructor(options = {}) {
    this.provider = 'netease';
    this.baseUrl = options.baseUrl || process.env.NETEASE_CLOUD_MUSIC_API_BASE_URL || DEFAULT_BASE_URL;
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
  }

  async request(path, query = {}) {
    if (!this.fetchImpl) {
      throw new Error('A fetch implementation is required for Netease Cloud Music API requests.');
    }

    const url = new URL(path, this.baseUrl);
    appendQuery(url, query);

    const response = await this.fetchImpl(url, {
      headers: { Accept: 'application/json' },
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(`Netease Cloud Music API request failed with ${response.status}`);
      error.status = response.status;
      error.body = body;
      error.url = url.toString();
      throw error;
    }

    return body;
  }

  search(keywords, options = {}) {
    return this.request(options.cloud === false ? '/search' : '/cloudsearch', {
      keywords,
      type: options.type || 1,
      limit: options.limit || 10,
      offset: options.offset || 0,
    });
  }

  getSongUrl(id, options = {}) {
    if (options.level) {
      return this.request('/song/url/v1', {
        id,
        level: options.level,
      });
    }

    return this.request('/song/url', {
      id,
      br: options.br || 999000,
    });
  }

  getLyric(id) {
    return this.request('/lyric', { id });
  }

  recommend(options = {}) {
    return this.request('/recommend/songs', {
      limit: options.limit,
      cookie: options.cookie,
    });
  }
}
