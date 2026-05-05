import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import test from 'node:test';

import { AppleMusicProvider, createMusicProvider } from '../index.js';
import { createAppleMusicDeveloperToken } from '../providers/apple-music-token.js';

function decodeJwtPart(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

test('creates an Apple Music developer token from a MusicKit private key', () => {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const token = createAppleMusicDeveloperToken({
    teamId: 'TEAM123456',
    keyId: 'KEY1234567',
    privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    now: 1_700_000_000,
    expiresInSeconds: 3600,
  });

  const [headerPart, payloadPart, signaturePart] = token.split('.');
  assert.equal(decodeJwtPart(headerPart).alg, 'ES256');
  assert.equal(decodeJwtPart(headerPart).kid, 'KEY1234567');
  assert.equal(decodeJwtPart(payloadPart).iss, 'TEAM123456');
  assert.equal(decodeJwtPart(payloadPart).iat, 1_700_000_000);
  assert.equal(decodeJwtPart(payloadPart).exp, 1_700_003_600);
  assert.ok(signaturePart.length > 40);
});

test('Apple Music search calls the catalog search endpoint and normalizes songs', async () => {
  const requests = [];
  const provider = new AppleMusicProvider({
    developerToken: 'dev-token',
    storefront: 'cn',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            results: {
              songs: {
                data: [
                  {
                    id: '123',
                    type: 'songs',
                    attributes: {
                      name: 'Track',
                      artistName: 'Artist',
                      albumName: 'Album',
                      durationInMillis: 123000,
                      url: 'https://music.apple.com/cn/song/track/123',
                      previews: [{ url: 'https://example.com/preview.m4a' }],
                      playParams: { id: '123', kind: 'song' },
                    },
                  },
                ],
              },
            },
          };
        },
      };
    },
  });

  const result = await provider.search('Track', { limit: 1, types: ['songs'] });

  assert.equal(result.songs[0].id, '123');
  assert.equal(result.songs[0].previewUrl, 'https://example.com/preview.m4a');
  assert.equal(requests[0].url.toString(), 'https://api.music.apple.com/v1/catalog/cn/search?term=Track&types=songs&limit=1');
  assert.equal(requests[0].init.headers.Authorization, 'Bearer dev-token');
});

test('Apple Music catalog requests use a server token without an origin claim', async () => {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const requests = [];
  const provider = new AppleMusicProvider({
    teamId: 'TEAM123456',
    keyId: 'KEY1234567',
    privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    origin: 'http://localhost:4173',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return { results: {} };
        },
      };
    },
  });

  await provider.search('Track', { limit: 1, types: ['songs'] });

  const token = requests[0].init.headers.Authorization.replace('Bearer ', '');
  const [, payloadPart] = token.split('.');
  assert.equal(decodeJwtPart(payloadPart).origin, undefined);
});

test('Apple Music getSongUrl returns catalog and preview URLs, not a fake stream URL', async () => {
  const provider = new AppleMusicProvider({
    developerToken: 'dev-token',
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      async json() {
        return {
          data: [
            {
              id: '456',
              type: 'songs',
              attributes: {
                name: 'Song',
                url: 'https://music.apple.com/us/song/song/456',
                previews: [{ url: 'https://example.com/preview.m4a' }],
              },
            },
          ],
        };
      },
    }),
  });

  const result = await provider.getSongUrl('456');

  assert.equal(result.url, 'https://music.apple.com/us/song/song/456');
  assert.equal(result.previewUrl, 'https://example.com/preview.m4a');
  assert.equal(result.playbackUrl, null);
});

test('Apple Music getUserStorefront uses Music-User-Token and returns storefront data', async () => {
  const requests = [];
  const provider = new AppleMusicProvider({
    developerToken: 'dev-token',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            data: [
              {
                id: 'us',
                type: 'storefronts',
                attributes: {
                  name: 'United States',
                  defaultLanguageTag: 'en-US',
                },
              },
            ],
          };
        },
      };
    },
  });

  const result = await provider.getUserStorefront({ userToken: 'user-token-123', language: 'zh-CN' });

  assert.equal(result.storefront.id, 'us');
  assert.equal(result.storefront.attributes.name, 'United States');
  assert.equal(requests[0].url.toString(), 'https://api.music.apple.com/v1/me/storefront?l=zh-CN');
  assert.equal(requests[0].init.headers.Authorization, 'Bearer dev-token');
  assert.equal(requests[0].init.headers['Music-User-Token'], 'user-token-123');
});

test('Apple Music getCollectionTracks normalizes album tracks', async () => {
  const requests = [];
  const provider = new AppleMusicProvider({
    developerToken: 'dev-token',
    storefront: 'us',
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            data: [
              {
                id: 'album-1',
                type: 'albums',
                attributes: {
                  name: 'Album One',
                  artistName: 'Artist One',
                  trackCount: 2,
                  url: 'https://music.apple.com/us/album/album-one/album-1',
                  artwork: {
                    url: 'https://example.com/{w}x{h}.jpg',
                  },
                  playParams: {
                    id: 'album-1',
                    kind: 'album',
                  },
                },
                relationships: {
                  tracks: {
                    data: [
                      {
                        id: 'song-1',
                        type: 'songs',
                        attributes: {
                          name: 'Song One',
                          artistName: 'Artist One',
                          albumName: 'Album One',
                          durationInMillis: 120000,
                          trackNumber: 1,
                          url: 'https://music.apple.com/us/song/song-one/song-1',
                          playParams: {
                            id: 'song-1',
                            kind: 'song',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          };
        },
      };
    },
  });

  const result = await provider.getCollectionTracks('album', 'album-1');

  assert.equal(result.collection.name, 'Album One');
  assert.equal(result.tracks[0].name, 'Song One');
  assert.equal(result.tracks[0].trackNumber, 1);
  assert.equal(requests[0].url.toString(), 'https://api.music.apple.com/v1/catalog/us/albums/album-1?include=tracks');
});

test('Spotify is registered as a placeholder provider', () => {
  const spotify = createMusicProvider('spotify');
  assert.equal(spotify.provider, 'spotify');
  assert.throws(() => spotify.search('hello'), /placeholder/);
});
