import { createServer } from 'node:http';

import { createMusicProvider } from '../01-external-context/music/index.js';
import { buildHostCopy, getBrainConfig } from './claude.js';
import {
  appBuild,
  appName,
  clampText,
  formatDuration,
  getRequestUserToken,
  readCommaList,
  readNumber,
  readRequestBody,
  sendJson,
  sendText,
  serveStatic,
} from './context.js';
import { getSchedulerSnapshot } from './scheduler.js';
import { getTtsConfig, handleTtsSpeech } from './tts.js';

const DEMO_TRACKS = [
  {
    provider: 'demo',
    id: 'demo-1',
    name: 'Night Drive',
    artistName: 'Studio Placeholder',
    albumName: 'Radio Seeds',
    durationMs: 201000,
    previewUrl: '',
    url: 'https://music.163.com/',
    reason: '适合作为深夜开场，节奏温和，情绪稳定。',
  },
  {
    provider: 'demo',
    id: 'demo-2',
    name: 'Warm Static',
    artistName: 'Prototype FM',
    albumName: 'Minimal Unit',
    durationMs: 184000,
    previewUrl: '',
    url: 'https://music.163.com/',
    reason: '保留一点颗粒感，能把“电台感”撑起来。',
  },
  {
    provider: 'demo',
    id: 'demo-3',
    name: 'Window Seat',
    artistName: 'Signal Bloom',
    albumName: 'Late Return',
    durationMs: 226000,
    previewUrl: '',
    url: 'https://music.163.com/',
    reason: '适合收束段落，听感轻，方便继续扩展播放列表。',
  },
];

function getAppleMusicConfig() {
  const storefront = process.env.APPLE_MUSIC_STOREFRONT || 'us';

  try {
    const provider = createMusicProvider('apple-music');
    return {
      enabled: true,
      developerToken: provider.getDeveloperToken(),
      storefront,
      app: {
        name: appName,
        build: appBuild,
      },
      origin: process.env.APPLE_MUSIC_TOKEN_ORIGIN || '',
      usingUserToken: Boolean(process.env.APPLE_MUSIC_USER_TOKEN),
      error: '',
    };
  } catch (error) {
    return {
      enabled: false,
      developerToken: '',
      storefront,
      app: {
        name: appName,
        build: appBuild,
      },
      origin: process.env.APPLE_MUSIC_TOKEN_ORIGIN || '',
      usingUserToken: Boolean(process.env.APPLE_MUSIC_USER_TOKEN),
      error: error.message,
    };
  }
}

function normalizeNeteaseSong(song, index) {
  const artists = Array.isArray(song?.ar) ? song.ar.map((item) => item?.name).filter(Boolean).join(' / ') : '';
  const artwork = song?.al?.picUrl || '';

  return {
    provider: 'netease',
    id: song?.id || `netease-${index}`,
    name: song?.name || `曲目 ${index + 1}`,
    artistName: artists || '未知艺人',
    albumName: song?.al?.name || '未知专辑',
    durationMs: song?.dt,
    previewUrl: '',
    url: song?.id ? `https://music.163.com/#/song?id=${song.id}` : 'https://music.163.com/',
    artwork,
  };
}

function extractNeteaseSongs(result) {
  const list = result?.result?.songs;
  return Array.isArray(list) ? list : [];
}

function buildAppleMusicFallbackQuery(prompt) {
  const text = String(prompt || '').toLowerCase();
  const terms = [];

  if (/雨|rain/u.test(text)) terms.push('rain');
  if (/夜|深夜|night/u.test(text)) terms.push('night');
  if (/开车|drive|车/u.test(text)) terms.push('drive');
  if (/温暖|warm/u.test(text)) terms.push('warm');

  return terms.length > 0 ? terms.join(' ') : 'night drive mellow';
}

async function buildTracks({ providerName, prompt, limit, storefront, userToken }) {
  const safePrompt = clampText(prompt, 80);
  const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 6);
  const safeStorefront = clampText(storefront || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12) || 'us';
  const safeUserToken = clampText(userToken, 4096);

  try {
    if (providerName === 'apple-music') {
      const provider = createMusicProvider('apple-music');
      let result = await provider.search(safePrompt, {
        limit: safeLimit,
        storefront: safeStorefront,
        types: ['songs'],
        userToken: safeUserToken,
      });

      if (!Array.isArray(result?.songs) || result.songs.length === 0) {
        result = await provider.search(buildAppleMusicFallbackQuery(safePrompt), {
          limit: safeLimit,
          storefront: safeStorefront,
          types: ['songs'],
          userToken: safeUserToken,
        });
      }

      const songs = (result?.songs || []).slice(0, safeLimit).map((song, index) => ({
        ...song,
        id: song.id || `apple-${index}`,
        reason: `和“${safePrompt}”的氛围贴近，适合放进这一轮电台编排。`,
      }));

      if (songs.length > 0) {
        return {
          provider: 'apple-music',
          mode: 'live',
          tracks: songs,
          warning: '',
          storefront: safeStorefront,
        };
      }

      return {
        provider: 'apple-music',
        mode: 'fallback',
        tracks: DEMO_TRACKS.slice(0, safeLimit),
        warning: 'Apple Music 没有搜到可用歌曲，已切到演示数据。',
        storefront: safeStorefront,
      };
    }

    const provider = createMusicProvider('netease');
    const result = await provider.search(safePrompt, { limit: safeLimit });
    const songs = extractNeteaseSongs(result).slice(0, safeLimit).map((song, index) => ({
      ...normalizeNeteaseSong(song, index),
      reason: `命中关键词“${safePrompt}”，适合作为这一段的候选曲目。`,
    }));

    if (songs.length > 0) {
      return {
        provider: 'netease',
        mode: 'live',
        tracks: songs,
        warning: '',
        storefront: '',
      };
    }
  } catch (error) {
    return {
      provider: providerName,
      mode: 'fallback',
      tracks: DEMO_TRACKS.slice(0, safeLimit),
      warning: error.message,
      storefront: providerName === 'apple-music' ? safeStorefront : '',
    };
  }

  return {
    provider: providerName,
    mode: 'fallback',
    tracks: DEMO_TRACKS.slice(0, safeLimit),
    warning: '没有搜到可用歌曲，已切到演示数据。',
    storefront: providerName === 'apple-music' ? safeStorefront : '',
  };
}

async function handleRadioTurn(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const prompt = clampText(body.prompt || body.mood || '深夜通勤、城市微光、带一点回响');
    const providerName = ['apple-music', 'netease'].includes(body.provider) ? body.provider : 'netease';
    const limit = Math.min(Math.max(Number(body.limit) || 3, 1), 6);
    const storefront = clampText(body.storefront || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12);
    const userToken = clampText(body.musicUserToken, 4096);

    const trackBundle = await buildTracks({ providerName, prompt, limit, storefront, userToken });
    const host = await buildHostCopy({
      prompt,
      tracks: trackBundle.tracks,
      provider: trackBundle.provider,
      mode: trackBundle.mode,
    });

    sendJson(response, 200, {
      ok: true,
      theme: prompt,
      provider: trackBundle.provider,
      storefront: trackBundle.storefront,
      sourceMode: trackBundle.mode,
      hostMode: host.mode,
      warnings: [trackBundle.warning, host.warning].filter(Boolean),
      host,
      tracks: trackBundle.tracks.map((track, index) => ({
        ...track,
        durationLabel: formatDuration(track.durationMs),
        interludeAfter: host.interludes?.[index] || null,
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || '请求失败',
    });
  }
}

async function handleAppleMusicIdentity(request, response) {
  try {
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const userToken = clampText(body.musicUserToken, 4096);

    if (!userToken) {
      sendJson(response, 400, {
        ok: false,
        error: 'musicUserToken is required.',
      });
      return;
    }

    const provider = createMusicProvider('apple-music');
    const result = await provider.getUserStorefront({
      userToken,
      language: 'zh-CN',
    });

    sendJson(response, 200, {
      ok: true,
      identity: {
        musicUserToken: userToken,
        storefrontId: result?.storefront?.id || '',
        storefrontName: result?.storefront?.attributes?.name || '',
        defaultLanguageTag: result?.storefront?.attributes?.defaultLanguageTag || '',
        note: 'Apple Music Web 授权可直接拿到 musicUserToken 和 storefront 信息；Apple 账户本身的内部账号 ID 不通过 MusicKit Web 暴露。',
      },
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music identity lookup failed.',
    });
  }
}

function normalizeAppleMusicSearchScope(value) {
  return ['catalog', 'library', 'all'].includes(value) ? value : 'catalog';
}

function toLibrarySearchTypes(types) {
  const mapped = new Set();
  types.forEach((type) => {
    if (type === 'songs') mapped.add('library-songs');
    if (type === 'albums') mapped.add('library-albums');
    if (type === 'artists') mapped.add('library-artists');
    if (type === 'playlists') mapped.add('library-playlists');
  });
  return Array.from(mapped);
}

async function handleAppleMusicSearch(request, response, url) {
  try {
    const term = clampText(url.searchParams.get('term') || url.searchParams.get('q'), 200);
    if (!term) {
      sendJson(response, 400, {
        ok: false,
        error: 'term is required.',
      });
      return;
    }

    const provider = createMusicProvider('apple-music');
    const userToken = getRequestUserToken(request, url);
    const requestedTypes = readCommaList(url.searchParams.get('types'), ['songs', 'albums', 'artists', 'playlists']);
    const sharedOptions = {
      storefront: clampText(url.searchParams.get('storefront') || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12),
      userToken,
      limit: readNumber(url.searchParams.get('limit'), 10, { min: 1, max: 25 }),
      offset: readNumber(url.searchParams.get('offset'), 0, { min: 0, max: 500 }),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    };
    const scope = normalizeAppleMusicSearchScope(url.searchParams.get('scope'));
    let result;

    if (scope === 'library') {
      result = await provider.searchLibrary(term, {
        ...sharedOptions,
        types: toLibrarySearchTypes(requestedTypes),
      });
    } else if (scope === 'all') {
      const [catalogResult, libraryResult] = await Promise.all([
        provider.search(term, {
          ...sharedOptions,
          types: requestedTypes,
        }),
        provider.searchLibrary(term, {
          ...sharedOptions,
          types: toLibrarySearchTypes(requestedTypes),
        }),
      ]);

      result = {
        provider: 'apple-music',
        raw: {
          catalog: catalogResult.raw,
          library: libraryResult.raw,
        },
        songs: [...catalogResult.songs, ...libraryResult.songs],
        albums: [...catalogResult.albums, ...libraryResult.albums],
        artists: [...catalogResult.artists, ...libraryResult.artists],
        playlists: [...catalogResult.playlists, ...libraryResult.playlists],
        scope,
      };
    } else {
      result = await provider.search(term, {
        ...sharedOptions,
        types: requestedTypes,
      });
    }

    sendJson(response, 200, {
      ok: true,
      scope,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music search failed.',
    });
  }
}

async function handleAppleMusicSong(request, response, url, songId) {
  try {
    const provider = createMusicProvider('apple-music');
    const result = await provider.getSong(songId, {
      storefront: clampText(url.searchParams.get('storefront') || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12),
      userToken: getRequestUserToken(request, url),
      include: clampText(url.searchParams.get('include'), 120),
      extend: clampText(url.searchParams.get('extend'), 120),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music song lookup failed.',
    });
  }
}

async function handleAppleMusicSongUrl(request, response, url, songId) {
  try {
    const provider = createMusicProvider('apple-music');
    const result = await provider.getSongUrl(songId, {
      storefront: clampText(url.searchParams.get('storefront') || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12),
      userToken: getRequestUserToken(request, url),
      include: clampText(url.searchParams.get('include'), 120),
      extend: clampText(url.searchParams.get('extend'), 120),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music song url lookup failed.',
    });
  }
}

async function handleAppleMusicCollectionTracks(request, response, url, kind, collectionId) {
  try {
    const normalizedKind = kind === 'playlist' ? 'playlist' : 'album';
    const scope = url.searchParams.get('scope') === 'library' ? 'library' : 'catalog';
    const provider = createMusicProvider('apple-music');
    const result = await provider.getCollectionTracks(normalizedKind, collectionId, {
      scope,
      storefront: clampText(url.searchParams.get('storefront') || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12),
      userToken: getRequestUserToken(request, url),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music collection lookup failed.',
    });
  }
}

async function handleAppleMusicCharts(request, response, url) {
  try {
    const provider = createMusicProvider('apple-music');
    const result = await provider.getCharts({
      storefront: clampText(url.searchParams.get('storefront') || process.env.APPLE_MUSIC_STOREFRONT || 'us', 12),
      userToken: getRequestUserToken(request, url),
      types: readCommaList(url.searchParams.get('types'), ['songs']),
      chart: clampText(url.searchParams.get('chart'), 60),
      genre: clampText(url.searchParams.get('genre'), 60),
      limit: readNumber(url.searchParams.get('limit'), 20, { min: 1, max: 50 }),
      offset: readNumber(url.searchParams.get('offset'), 0, { min: 0, max: 500 }),
      with: clampText(url.searchParams.get('with'), 120),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music charts lookup failed.',
    });
  }
}

async function handleAppleMusicRecommendations(request, response, url) {
  try {
    const provider = createMusicProvider('apple-music');
    const userToken = getRequestUserToken(request, url);
    const result = await provider.getPersonalizedRecommendations({
      userToken,
      limit: readNumber(url.searchParams.get('limit'), 10, { min: 1, max: 25 }),
      offset: readNumber(url.searchParams.get('offset'), 0, { min: 0, max: 500 }),
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music recommendations lookup failed.',
    });
  }
}

async function handleAppleMusicStorefront(request, response, url) {
  try {
    const provider = createMusicProvider('apple-music');
    const userToken = getRequestUserToken(request, url);
    const result = await provider.getUserStorefront({
      userToken,
      language: clampText(url.searchParams.get('l') || url.searchParams.get('language'), 24),
    });

    sendJson(response, 200, {
      ok: true,
      ...result,
    });
  } catch (error) {
    sendJson(response, 400, {
      ok: false,
      error: error.message || 'Apple Music storefront lookup failed.',
    });
  }
}

export function createRadioServer({ port = Number(process.env.PORT || 4173) } = {}) {
  return createServer(async (request, response) => {
    const url = new URL(request.url || '/', `http://${request.headers.host || `localhost:${port}`}`);

    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': 'content-type,music-user-token,x-music-user-token',
      });
      response.end();
      return;
    }

    if (['GET', 'HEAD'].includes(request.method) && url.pathname === '/api/health') {
      const appleMusicConfig = getAppleMusicConfig();
      const brainConfig = getBrainConfig();
      const ttsConfig = getTtsConfig();
      const scheduler = getSchedulerSnapshot();
      sendJson(response, 200, {
        ok: true,
        service: 'radio-web',
        brainProvider: brainConfig.provider,
        brainModel: brainConfig.model,
        brainConfigured: brainConfig.configured,
        anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
        openAIConfigured: brainConfig.provider !== 'anthropic' && brainConfig.configured,
        appleMusicConfigured: appleMusicConfig.enabled,
        appleMusicStorefront: appleMusicConfig.storefront,
        appleMusicOrigin: appleMusicConfig.origin,
        neteaseBaseUrl: process.env.NETEASE_CLOUD_MUSIC_API_BASE_URL || 'http://localhost:3000',
        ttsConfigured: ttsConfig.enabled && ttsConfig.configured,
        ttsProvider: ttsConfig.provider,
        ttsBaseUrl: ttsConfig.baseUrl,
        schedulerEnabled: scheduler.enabled,
        scheduledJobs: scheduler.jobs.length,
      });
      return;
    }

    if (['GET', 'HEAD'].includes(request.method) && url.pathname === '/api/apple-music/config') {
      const appleMusicConfig = getAppleMusicConfig();
      sendJson(response, 200, {
        ok: true,
        ...appleMusicConfig,
      });
      return;
    }

    if (['GET', 'HEAD'].includes(request.method) && url.pathname === '/api/tts/config') {
      const ttsConfig = getTtsConfig();
      sendJson(response, 200, {
        ok: true,
        ...ttsConfig,
      });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/radio-turn') {
      await handleRadioTurn(request, response);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/tts/speech') {
      await handleTtsSpeech(request, response);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/apple-music/identity') {
      await handleAppleMusicIdentity(request, response);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/apple-music/search') {
      await handleAppleMusicSearch(request, response, url);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/apple-music/charts') {
      await handleAppleMusicCharts(request, response, url);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/apple-music/recommendations') {
      await handleAppleMusicRecommendations(request, response, url);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/apple-music/storefront') {
      await handleAppleMusicStorefront(request, response, url);
      return;
    }

    if (['GET', 'HEAD'].includes(request.method) && url.pathname === '/apple-music/login') {
      await serveStatic('/apple-music-login.html', response, request.method);
      return;
    }

    const appleMusicSongMatch = request.method === 'GET'
      ? url.pathname.match(/^\/api\/apple-music\/songs\/([^/]+)$/u)
      : null;
    if (appleMusicSongMatch) {
      await handleAppleMusicSong(request, response, url, decodeURIComponent(appleMusicSongMatch[1]));
      return;
    }

    const appleMusicSongUrlMatch = request.method === 'GET'
      ? url.pathname.match(/^\/api\/apple-music\/songs\/([^/]+)\/url$/u)
      : null;
    if (appleMusicSongUrlMatch) {
      await handleAppleMusicSongUrl(request, response, url, decodeURIComponent(appleMusicSongUrlMatch[1]));
      return;
    }

    const appleMusicCollectionTracksMatch = request.method === 'GET'
      ? url.pathname.match(/^\/api\/apple-music\/(albums|playlists)\/([^/]+)\/tracks$/u)
      : null;
    if (appleMusicCollectionTracksMatch) {
      const kind = appleMusicCollectionTracksMatch[1] === 'playlists' ? 'playlist' : 'album';
      await handleAppleMusicCollectionTracks(
        request,
        response,
        url,
        kind,
        decodeURIComponent(appleMusicCollectionTracksMatch[2]),
      );
      return;
    }

    if (['GET', 'HEAD'].includes(request.method)) {
      await serveStatic(url.pathname, response, request.method);
      return;
    }

    sendText(response, 405, 'Method not allowed');
  });
}
