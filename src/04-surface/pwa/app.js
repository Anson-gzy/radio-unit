const elements = {
  appShell: document.querySelector('.particle-app'),
  authState: document.querySelector('#apple-auth-state'),
  authHint: document.querySelector('#apple-auth-hint'),
  connectButton: document.querySelector('#apple-connect-button'),
  disconnectButton: document.querySelector('#apple-disconnect-button'),
  identityBadge: document.querySelector('#identity-badge'),
  identitySummary: document.querySelector('#apple-id-summary'),
  storefrontInput: document.querySelector('#storefront'),
  status: document.querySelector('#status'),
  modeButtons: Array.from(document.querySelectorAll('.mode-button')),
  visualPanel: document.querySelector('#visual-panel'),
  browserPanel: document.querySelector('#browser-panel'),
  motionModeButtons: Array.from(document.querySelectorAll('.motion-mode-button')),
  luminanceToggle: document.querySelector('#luminance-toggle'),
  luminanceRange: document.querySelector('#luminance-range'),
  luminanceValue: document.querySelector('#luminance-value'),
  luminanceNote: document.querySelector('#luminance-note'),
  densityRange: document.querySelector('#density-range'),
  sizeRange: document.querySelector('#size-range'),
  diffusionRange: document.querySelector('#diffusion-range'),
  baseNoiseRange: document.querySelector('#base-noise-range'),
  baseNoiseValue: document.querySelector('#base-noise-value'),
  motionRange: document.querySelector('#motion-range'),
  pauseTimeRange: document.querySelector('#pause-time-range'),
  pauseTimeValue: document.querySelector('#pause-time-value'),
  playTimeRange: document.querySelector('#play-time-range'),
  playTimeValue: document.querySelector('#play-time-value'),
  explodeJumpRange: document.querySelector('#explode-jump-range'),
  explodeJumpValue: document.querySelector('#explode-jump-value'),
  explodeHoldRange: document.querySelector('#explode-hold-range'),
  explodeHoldValue: document.querySelector('#explode-hold-value'),
  crossfadeRange: document.querySelector('#crossfade-range'),
  crossfadeValue: document.querySelector('#crossfade-value'),
  gatherRange: document.querySelector('#gather-range'),
  gatherValue: document.querySelector('#gather-value'),
  holdZeroRange: document.querySelector('#hold-zero-range'),
  holdZeroValue: document.querySelector('#hold-zero-value'),
  recoverRange: document.querySelector('#recover-range'),
  recoverValue: document.querySelector('#recover-value'),
  bridgeDensityRange: document.querySelector('#bridge-density-range'),
  bridgeDensityValue: document.querySelector('#bridge-density-value'),
  bridgeIntensityRange: document.querySelector('#bridge-intensity-range'),
  bridgeIntensityValue: document.querySelector('#bridge-intensity-value'),
  glowToggle: document.querySelector('#glow-toggle'),
  densityValue: document.querySelector('#density-value'),
  sizeValue: document.querySelector('#size-value'),
  diffusionValue: document.querySelector('#diffusion-value'),
  motionValue: document.querySelector('#motion-value'),
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  searchButton: document.querySelector('#search-button'),
  searchStatus: document.querySelector('#search-status'),
  browserSearchView: document.querySelector('#browser-search-view'),
  browserDetailView: document.querySelector('#browser-detail-view'),
  searchResults: document.querySelector('#search-results'),
  detailBackButton: document.querySelector('#detail-back-button'),
  detailPlayAllButton: document.querySelector('#detail-play-all-button'),
  detailArtwork: document.querySelector('#detail-artwork'),
  detailKicker: document.querySelector('#detail-kicker'),
  detailTitle: document.querySelector('#detail-title'),
  detailMeta: document.querySelector('#detail-meta'),
  detailSupporting: document.querySelector('#detail-supporting'),
  detailStatus: document.querySelector('#detail-status'),
  detailTracks: document.querySelector('#detail-tracks'),
  searchTypeButtons: Array.from(document.querySelectorAll('.type-chip')),
  searchSourceButtons: Array.from(document.querySelectorAll('.source-chip')),
  searchTemplate: document.querySelector('#search-result-template'),
  stage: document.querySelector('#stage'),
  canvas: document.querySelector('#particle-canvas'),
  stageToolbarActions: document.querySelector('#stage-toolbar-actions'),
  toolbarCollapseButton: document.querySelector('#toolbar-collapse-button'),
  fullscreenButton: document.querySelector('#fullscreen-button'),
  toggleSidebarButton: document.querySelector('#toggle-sidebar-button'),
  togglePlayerButton: document.querySelector('#toggle-player-button'),
  stagePlaceholder: document.querySelector('#stage-placeholder'),
  stagePlaceholderTitle: document.querySelector('#stage-placeholder-title'),
  stagePlaceholderCopy: document.querySelector('#stage-placeholder-copy'),
  playerOverlay: document.querySelector('#player-overlay'),
  trackTitle: document.querySelector('#player-track-title'),
  trackMeta: document.querySelector('#player-track-meta'),
  favoriteButton: document.querySelector('#favorite-button'),
  menuButton: document.querySelector('#menu-button'),
  playerMenu: document.querySelector('#player-menu'),
  playerOpenLink: document.querySelector('#player-open-link'),
  progressShell: document.querySelector('#progress-shell'),
  progressSlider: document.querySelector('#progress-slider'),
  elapsedTime: document.querySelector('#elapsed-time'),
  remainingTime: document.querySelector('#remaining-time'),
  volumeShell: document.querySelector('#volume-shell'),
  volumeSlider: document.querySelector('#volume-slider'),
  shuffleButton: document.querySelector('#shuffle-button'),
  previousButton: document.querySelector('#previous-button'),
  playToggleButton: document.querySelector('#play-toggle-button'),
  nextButton: document.querySelector('#next-button'),
  repeatButton: document.querySelector('#repeat-button'),
  repeatModeIndicator: document.querySelector('#repeat-mode-indicator'),
  playIcon: document.querySelector('#play-toggle-button .icon-play'),
  pauseIcon: document.querySelector('#play-toggle-button .icon-pause'),
};

const APPLE_USER_TOKEN_STORAGE_KEY = 'radio.appleMusicUserToken';
const APPLE_STOREFRONT_STORAGE_KEY = 'radio.appleMusicStorefront';
const APPLE_AUTOCONNECT_DISABLED_KEY = 'radio.appleMusicAutoConnectDisabled';
const VISUAL_SETTINGS_STORAGE_KEY = 'radio.visualSettings';
const FAVORITES_STORAGE_KEY = 'radio.favoriteItems';
const UI_PREFERENCES_STORAGE_KEY = 'radio.uiPreferences';
const EMPTY_ARTWORK_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const VISUAL_SETTINGS_VERSION = 5;
const PLAYBACK_STATE_PLAYING = 5;
const REPEAT_MODE_NONE = 0;
const REPEAT_MODE_ONE = 1;
const REPEAT_MODE_ALL = 2;
const SHUFFLE_MODE_OFF = 0;
const SHUFFLE_MODE_SONGS = 1;
const HOLD_SOLID_BEAT_SYNC_MIN_MS = 1000;
const HOLD_SOLID_BEAT_SYNC_MAX_MS = 6000;

const DEFAULT_VISUAL_SETTINGS = {
  version: VISUAL_SETTINGS_VERSION,
  density: 80,
  size: 2,
  diffusion: 50,
  motion: 0.1,
  glow: false,
  minLuminance: 10,
  manualLuminanceEnable: true,
  baseNoise: 5,
  motionMode: 'waveform-displace',
  explodeJump: 800,
  explodeHold: 0,
  crossfade: 2100,
  gather: 900,
  holdZero: HOLD_SOLID_BEAT_SYNC_MIN_MS,
  recover: 0,
  pauseTime: 400,
  playTime: 1400,
  bridgeDensity: 47,
  bridgeIntensity: 0.3,
  maxDiffusion: 100,
  minDiffusion: 0,
};

const TYPE_LABELS = {
  song: 'Song',
  album: 'Album',
  playlist: 'Playlist',
};

function isLibraryIdentifier(value) {
  return /^(?:[ailp]\.|pl\.u-)[A-Za-z0-9]+$/u.test(String(value || ''));
}

function isLibraryResourceType(type) {
  return String(type || '').startsWith('library-');
}

function displayTypeFromResourceType(type) {
  const normalized = String(type || '').replace(/^library-/u, '').replace(/s$/u, '');
  return ['song', 'album', 'playlist'].includes(normalized) ? normalized : normalized || type;
}

function isCollectionType(type) {
  return type === 'album' || type === 'playlist';
}

const state = {
  config: null,
  musicKit: null,
  musicKitPromise: null,
  musicKitEventsBound: false,
  connected: false,
  userToken: localStorage.getItem(APPLE_USER_TOKEN_STORAGE_KEY) || '',
  storefront: localStorage.getItem(APPLE_STOREFRONT_STORAGE_KEY) || 'us',
  identity: null,
  mode: 'visual',
  searchType: 'all',
  searchSource: 'catalog',
  searchQuery: '',
  searchBusy: false,
  searchResults: [],
  browserDetail: null,
  detailTracks: [],
  detailBusy: false,
  selectedQueueKey: '',
  visualSettings: loadVisualSettings(),
  favorites: new Set(loadFavoriteIds()),
  ...loadUiPreferences(),
  currentArtworkUrl: '',
  playbackTime: 0,
  playbackDuration: 0,
  volume: 0.6,
  isSeeking: false,
  pollTimer: null,
  currentMeta: null,
  isFullscreen: Boolean(document.fullscreenElement || document.webkitFullscreenElement),
  playbackRecoveryTimer: null,
  playbackRecoveryPending: false,
  lastPlaybackErrorSignature: '',
  playbackUiOverride: null,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safePlayerRead(read, fallback) {
  try {
    const value = read();
    return value === undefined || value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function getMusicKitPlaybackState(name, fallback) {
  const value = window.MusicKit?.PlaybackStates?.[name];
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function isPlaybackStatePlaying(playbackState) {
  if (typeof playbackState === 'string') {
    return playbackState.toLowerCase() === 'playing';
  }

  return Number(playbackState) === getMusicKitPlaybackState('playing', PLAYBACK_STATE_PLAYING);
}

function loadVisualSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VISUAL_SETTINGS_STORAGE_KEY) || '{}');
    const savedSettings = parsed.version === VISUAL_SETTINGS_VERSION ? parsed : {};
    return {
      ...DEFAULT_VISUAL_SETTINGS,
      ...savedSettings,
      density: clamp(Number(savedSettings.density ?? DEFAULT_VISUAL_SETTINGS.density), 0, 100),
      size: clamp(Number(savedSettings.size ?? DEFAULT_VISUAL_SETTINGS.size), 1, 10),
      diffusion: clamp(Number(savedSettings.diffusion ?? DEFAULT_VISUAL_SETTINGS.diffusion), 0, 200),
      motion: clamp(Number(savedSettings.motion ?? DEFAULT_VISUAL_SETTINGS.motion), 0, 3),
      glow: Boolean(savedSettings.glow ?? DEFAULT_VISUAL_SETTINGS.glow),
      minLuminance: clamp(Number(savedSettings.minLuminance ?? DEFAULT_VISUAL_SETTINGS.minLuminance), 0, 100),
      manualLuminanceEnable: Boolean(
        savedSettings.manualLuminanceEnable ?? DEFAULT_VISUAL_SETTINGS.manualLuminanceEnable,
      ),
      baseNoise: clamp(Number(savedSettings.baseNoise ?? DEFAULT_VISUAL_SETTINGS.baseNoise), 0, 50),
      motionMode: savedSettings.motionMode === 'classic' ? 'classic' : 'waveform-displace',
      explodeJump: clamp(Number(savedSettings.explodeJump ?? DEFAULT_VISUAL_SETTINGS.explodeJump), 0, 2000),
      explodeHold: clamp(Number(savedSettings.explodeHold ?? DEFAULT_VISUAL_SETTINGS.explodeHold), 0, 3000),
      crossfade: clamp(Number(savedSettings.crossfade ?? DEFAULT_VISUAL_SETTINGS.crossfade), 0, 3000),
      gather: clamp(Number(savedSettings.gather ?? DEFAULT_VISUAL_SETTINGS.gather), 0, 3000),
      holdZero: HOLD_SOLID_BEAT_SYNC_MIN_MS,
      recover: clamp(Number(savedSettings.recover ?? DEFAULT_VISUAL_SETTINGS.recover), 0, 2000),
      pauseTime: clamp(Number(savedSettings.pauseTime ?? DEFAULT_VISUAL_SETTINGS.pauseTime), 0, 3000),
      playTime: clamp(Number(savedSettings.playTime ?? DEFAULT_VISUAL_SETTINGS.playTime), 0, 3000),
      bridgeDensity: clamp(Number(savedSettings.bridgeDensity ?? DEFAULT_VISUAL_SETTINGS.bridgeDensity), 0, 100),
      bridgeIntensity: clamp(Number(savedSettings.bridgeIntensity ?? DEFAULT_VISUAL_SETTINGS.bridgeIntensity), 0, 2),
    };
  } catch {
    return { ...DEFAULT_VISUAL_SETTINGS };
  }
}

function persistVisualSettings() {
  localStorage.setItem(VISUAL_SETTINGS_STORAGE_KEY, JSON.stringify(state.visualSettings));
}

function loadFavoriteIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistFavoriteIds() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(state.favorites)));
}

function loadUiPreferences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(UI_PREFERENCES_STORAGE_KEY) || '{}');
    return {
      showSidebar: parsed.showSidebar !== false,
      showPlayer: parsed.showPlayer !== false,
      showToolbarOptions: parsed.showToolbarOptions !== false,
    };
  } catch {
    return {
      showSidebar: true,
      showPlayer: true,
      showToolbarOptions: true,
    };
  }
}

function persistUiPreferences() {
  localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
    showSidebar: state.showSidebar,
    showPlayer: state.showPlayer,
    showToolbarOptions: state.showToolbarOptions,
  }));
}

function setStatus(text) {
  elements.status.textContent = text;
}

function setSearchStatus(text) {
  elements.searchStatus.textContent = text;
}

function setAuthState(text, tone = 'default') {
  elements.authState.textContent = text;
  elements.authState.className = 'auth-state-pill';

  if (tone === 'connected') {
    elements.authState.classList.add('is-connected');
  }

  if (tone === 'warning') {
    elements.authState.classList.add('is-warning');
  }
}

function setAuthHint(text) {
  elements.authHint.textContent = text;
}

function readErrorMessage(error, fallback) {
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

function parseOriginList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasOriginMismatch(originValue) {
  const allowedOrigins = parseOriginList(originValue);
  return allowedOrigins.length > 0 && !allowedOrigins.includes(window.location.origin);
}

function requestJson(url, options = {}) {
  return fetch(url, {
    cache: 'no-store',
    ...options,
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      const payload = await response.text();
      let data = null;

      try {
        data = payload ? JSON.parse(payload) : null;
      } catch {
        data = null;
      }

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        const invalidPayloadMessage = /text\/html/iu.test(contentType) || /^\s*</u.test(payload)
          ? `The endpoint ${url} returned an HTML page instead of JSON.`
          : `The endpoint ${url} returned JSON that could not be parsed.`;
        throw new Error(!response.ok ? `Request failed: ${response.status}` : invalidPayloadMessage);
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Request failed: ${response.status}`);
      }
      return data;
    });
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

function wait(delayMs) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function readMusicUserToken(musicKit) {
  const directToken = typeof musicKit?.musicUserToken === 'string' ? musicKit.musicUserToken.trim() : '';
  if (directToken) {
    return directToken;
  }

  const instance = typeof window.MusicKit?.getInstance === 'function' ? window.MusicKit.getInstance() : null;
  const instanceToken = typeof instance?.musicUserToken === 'string' ? instance.musicUserToken.trim() : '';
  return instanceToken;
}

async function resolveAuthorizedUserToken(musicKit, {
  timeoutMs = 20_000,
  pollMs = 250,
} = {}) {
  const existingToken = readMusicUserToken(musicKit);
  if (existingToken) {
    return existingToken;
  }

  const authorizationPromise = Promise.resolve().then(() => musicKit.authorize());
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const token = readMusicUserToken(musicKit);
    if (token) {
      return token;
    }

    const result = await Promise.race([
      authorizationPromise.then((value) => ({ type: 'resolved', value })),
      wait(pollMs).then(() => ({ type: 'tick' })),
    ]);

    if (result.type === 'resolved') {
      const resolvedToken = typeof result.value === 'string' ? result.value.trim() : '';
      return resolvedToken || readMusicUserToken(musicKit);
    }
  }

  const finalToken = readMusicUserToken(musicKit);
  if (finalToken) {
    return finalToken;
  }

  throw new Error('Apple Music sign-in finished, but the page never received the authorization callback.');
}

function persistAppleMusicSession() {
  if (state.userToken) {
    localStorage.setItem(APPLE_USER_TOKEN_STORAGE_KEY, state.userToken);
  } else {
    localStorage.removeItem(APPLE_USER_TOKEN_STORAGE_KEY);
  }

  if (state.storefront) {
    localStorage.setItem(APPLE_STOREFRONT_STORAGE_KEY, state.storefront);
  }
}

function clearAppleMusicSession() {
  state.connected = false;
  state.userToken = '';
  state.identity = null;
  localStorage.removeItem(APPLE_USER_TOKEN_STORAGE_KEY);
  sessionStorage.setItem(APPLE_AUTOCONNECT_DISABLED_KEY, '1');
}

function syncUrlState() {
  const url = new URL(window.location.href);

  if (state.storefront) {
    url.searchParams.set('storefront', state.storefront);
  } else {
    url.searchParams.delete('storefront');
  }

  url.searchParams.set('mode', state.mode);

  if (state.searchQuery) {
    url.searchParams.set('q', state.searchQuery);
  } else {
    url.searchParams.delete('q');
  }

  if (state.searchSource && state.searchSource !== 'catalog') {
    url.searchParams.set('source', state.searchSource);
  } else {
    url.searchParams.delete('source');
  }

  url.searchParams.delete('appleMusicConnected');
  const query = url.searchParams.toString();
  window.history.replaceState({}, '', query ? `${url.pathname}?${query}` : url.pathname);
}

function applyQueryState() {
  const url = new URL(window.location.href);
  const storefront = url.searchParams.get('storefront');
  const mode = url.searchParams.get('mode');
  const searchQuery = url.searchParams.get('q');
  const searchSource = url.searchParams.get('source');

  if (storefront) {
    state.storefront = storefront;
  }

  if (mode === 'visual' || mode === 'browser') {
    state.mode = mode;
  }

  if (searchQuery) {
    state.searchQuery = searchQuery;
  }

  if (['catalog', 'library', 'all'].includes(searchSource)) {
    state.searchSource = searchSource;
  }
}

function replaceCurrentUrl(url) {
  const query = url.searchParams.toString();
  window.history.replaceState({}, '', query ? `${url.pathname}?${query}` : url.pathname);
}

function consumeAppleMusicConnectedFlag() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('appleMusicConnected') !== '1') {
    return;
  }

  setStatus('Apple Music connected successfully.');
  url.searchParams.delete('appleMusicConnected');
  replaceCurrentUrl(url);
}

function buildAppleMusicReturnPath() {
  syncUrlState();
  const url = new URL(window.location.href);
  url.searchParams.delete('appleMusicConnected');
  return `${url.pathname}${url.search ? url.search : ''}`;
}

function buildAppleMusicLoginUrl() {
  const loginUrl = new URL('./apple-music-login.html', window.location.href);
  loginUrl.searchParams.set('returnTo', buildAppleMusicReturnPath());
  return loginUrl.toString();
}

async function redirectToAppleMusicLogin() {
  const config = state.config || await fetchAppleMusicConfig();
  if (!config.enabled) {
    setAuthState('Apple Music not ready', 'warning');
    setAuthHint(config.error || 'Configure the developer token on the server before starting Apple Music authorization.');
    setStatus('Apple Music is not configured yet, so authorization cannot start.');
    return;
  }

  if (hasOriginMismatch(config.origin)) {
    setAuthState('Origin mismatch', 'warning');
    setAuthHint(`The current page origin is ${window.location.origin}, but the token origin is configured as ${config.origin}.`);
    return;
  }

  setAuthState('Redirecting to authorization', 'default');
  setAuthHint('The current browser did not open MusicKit authorization correctly, so the dedicated connection page will open instead.');
  window.location.assign(buildAppleMusicLoginUrl());
}

function createPlaceholderArtwork() {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 720;
  const context = canvas.getContext('2d');

  if (!context) {
    return '';
  }

  const gradient = context.createLinearGradient(0, 0, 720, 720);
  gradient.addColorStop(0, '#7ca8ff');
  gradient.addColorStop(0.55, '#0f1725');
  gradient.addColorStop(1, '#ff76ae');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 720, 720);

  context.fillStyle = 'rgba(255, 255, 255, 0.14)';
  context.beginPath();
  context.arc(200, 180, 120, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = 'rgba(255, 255, 255, 0.08)';
  context.beginPath();
  context.arc(540, 530, 160, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  context.lineWidth = 2;
  context.strokeRect(54, 54, 612, 612);

  context.fillStyle = '#ffffff';
  context.font = '700 112px Manrope';
  context.fillText('AM', 84, 360);

  context.fillStyle = 'rgba(255, 255, 255, 0.7)';
  context.font = '500 34px "Noto Sans SC"';
  context.fillText('Connect Apple Music', 88, 426);
  context.fillText('and select a track', 88, 474);

  return canvas.toDataURL('image/png');
}

class ParticleVisualizerSurface {
  constructor(canvas, stage, getSettings) {
    this.canvas = canvas;
    this.stage = stage;
    this.getSettings = getSettings;
    this.context = canvas.getContext('2d');
    this.particles = [];
    this.transition = {
      phase: 'IDLE',
      startTime: 0,
      pendingParticles: [],
      pendingIsDark: false,
      ready: false,
    };
    this.playTransition = {
      phase: 'PAUSED',
      startTime: 0,
    };
    this.currentSource = '';
    this.placeholderSource = '';
    this.animationFrame = 0;
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.isDarkImage = false;
    this.isPlaying = false;
    this.audioContext = null;
    this.analyser = null;
    this.mediaSource = null;
    this.mediaElement = null;
    this.mediaSourceCache = new WeakMap();
    this.frequencyData = null;
    this.timeDomainData = null;
    this.analysisWaveArray = null;
    this.fallbackWaveArray = new Float32Array(1024);
    this.lastAnalysisAttempt = 0;
    this.zeroDataFrames = 0;
    this.fallbackPlaybackAnchor = 0;
    this.fallbackPerfAnchor = 0;
    this.fallbackReportedTime = 0;
    this.resizeObserver = null;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.stage);
    }

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }

  handleResize() {
    const rect = this.stage.getBoundingClientRect();
    const nextWidth = Math.round(rect.width);
    const nextHeight = Math.round(rect.height);

    if (nextWidth === this.width && nextHeight === this.height) {
      return;
    }

    this.width = nextWidth;
    this.height = nextHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.currentSource) {
      this.setArtwork(this.currentSource, { immediate: true, force: true }).catch(() => {});
    }
  }

  async setArtwork(source, { immediate = false, force = false } = {}) {
    const nextSource = String(source || '').trim();
    if (!nextSource) {
      return;
    }

    if (!force && nextSource === this.currentSource) {
      return;
    }

    this.currentSource = nextSource;
    const settings = this.getSettings();

    if (immediate || this.transition.phase === 'IDLE' && this.particles.length === 0) {
      this.loadParticles(nextSource, settings.density, settings.manualLuminanceEnable, settings.minLuminance, true, false);
      return;
    }

    this.transition = {
      phase: 'EXPLODING',
      startTime: performance.now(),
      pendingParticles: [],
      pendingIsDark: false,
      ready: false,
    };
    this.loadParticles(nextSource, settings.density, true, settings.minLuminance, false, true);
  }

  rebuildCurrent() {
    if (!this.currentSource) {
      return;
    }

    const settings = this.getSettings();
    this.loadParticles(
      this.currentSource,
      settings.density,
      settings.manualLuminanceEnable,
      settings.minLuminance,
      true,
      false,
    );
  }

  getParticleOffsets(canvasSize) {
    return {
      x: (this.width - canvasSize) / 2,
      y: (this.height - canvasSize) / 2,
    };
  }

  buildParticlesParams(image, density, allowLuminance, minLuminance, initialDiffusion) {
    const canvasSize = 600;
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasSize;
    offscreen.height = canvasSize;
    const context = offscreen.getContext('2d');

    if (!context) {
      return { particles: [], isDark: false };
    }

    const scale = Math.max(canvasSize / image.width, canvasSize / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const offsetX = (canvasSize - width) / 2;
    const offsetY = (canvasSize - height) / 2;
    context.drawImage(image, offsetX, offsetY, width, height);

    let imageData;
    try {
      imageData = context.getImageData(0, 0, canvasSize, canvasSize);
    } catch {
      imageData = this.generateBaseImage(canvasSize, canvasSize);
    }

    const gridStep = Math.max(1, Math.floor(16 - (density / 100) * 15));
    let darkPixelCount = 0;
    let totalPixelCount = 0;

    for (let y = 0; y < canvasSize; y += gridStep) {
      for (let x = 0; x < canvasSize; x += gridStep) {
        const index = (y * canvasSize + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 10) {
          totalPixelCount += 1;
          const red = imageData.data[index];
          const green = imageData.data[index + 1];
          const blue = imageData.data[index + 2];
          const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
          if (luminance < 40) {
            darkPixelCount += 1;
          }
        }
      }
    }

    const darkRatio = totalPixelCount > 0 ? darkPixelCount / totalPixelCount : 0;
    const isDark = darkRatio >= 0.5;
    const applyBoost = isDark && allowLuminance;
    const particles = [];
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    let particleIndex = 0;
    const settings = this.getSettings();

    for (let y = 0; y < canvasSize; y += gridStep) {
      for (let x = 0; x < canvasSize; x += gridStep) {
        const index = (y * canvasSize + x) * 4;
        const alpha = imageData.data[index + 3];

        if (alpha > 10) {
          let red = imageData.data[index];
          let green = imageData.data[index + 1];
          let blue = imageData.data[index + 2];

          if (applyBoost && minLuminance > 0) {
            const threshold = (minLuminance / 100) * 255;
            const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
            if (luminance < threshold) {
              const difference = threshold - luminance;
              red = Math.min(255, red + difference);
              green = Math.min(255, green + difference);
              blue = Math.min(255, blue + difference);
            }
          }

          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const maxDistance = canvasSize / 2;
          const distNorm = Math.min(distance / maxDistance, 1);
          const randX = Math.random() * 2 - 1;
          const randY = Math.random() * 2 - 1;
          const totalDiffusion = settings.baseNoise + Math.pow(distNorm, 1.5) * initialDiffusion;
          const startX = x + randX * totalDiffusion;
          const startY = y + randY * totalDiffusion;

          particles.push({
            baseX: x,
            baseY: y,
            x: startX,
            y: startY,
            vx: 0,
            vy: 0,
            color: `rgba(${Math.floor(red)},${Math.floor(green)},${Math.floor(blue)},${alpha / 255})`,
            r: Math.floor(red),
            g: Math.floor(green),
            b: Math.floor(blue),
            distNorm,
            randX,
            randY,
            angle: Math.atan2(y - centerY, x - centerX),
            idx: particleIndex,
          });

          particleIndex += 1;
        }
      }
    }

    const offsets = this.getParticleOffsets(canvasSize);

    for (let index = 0; index < particles.length; index += 1) {
      particles[index].baseX += offsets.x;
      particles[index].baseY += offsets.y;
      particles[index].x += offsets.x;
      particles[index].y += offsets.y;
    }

    return { particles, isDark };
  }

  generateBaseImage(width, height) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = width;
    fallbackCanvas.height = height;
    const fallbackContext = fallbackCanvas.getContext('2d');

    if (!fallbackContext) {
      return new ImageData(width, height);
    }

    fallbackContext.fillStyle = '#E31837';
    fallbackContext.fillRect(0, 0, width, height);

    const backgroundImage = fallbackContext.getImageData(0, 0, width, height);
    for (let index = 0; index < backgroundImage.data.length; index += 4) {
      const noise = (Math.random() - 0.5) * 15;
      backgroundImage.data[index] = Math.min(255, Math.max(0, backgroundImage.data[index] + noise));
      backgroundImage.data[index + 1] = Math.min(255, Math.max(0, backgroundImage.data[index + 1] + noise));
      backgroundImage.data[index + 2] = Math.min(255, Math.max(0, backgroundImage.data[index + 2] + noise));
    }
    fallbackContext.putImageData(backgroundImage, 0, 0);

    const insetSize = width * 0.45;
    const insetX = (width - insetSize) / 2;
    const insetY = (height - insetSize) / 2;
    const colors = ['#FFCBA4', '#FFDAB9', '#5C4033', '#3E2723', '#1E90FF', '#FF0000', '#00FF00'];
    const gridSize = 10;
    const blockSize = Math.ceil(insetSize / gridSize);

    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        fallbackContext.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        fallbackContext.fillRect(insetX + x * blockSize, insetY + y * blockSize, blockSize, blockSize);
      }
    }

    fallbackContext.strokeStyle = '#D4AF37';
    fallbackContext.lineWidth = 3;
    fallbackContext.strokeRect(insetX, insetY, insetSize, insetSize);

    const labelWidth = width * 0.25;
    const labelHeight = labelWidth * 0.6;
    const labelX = width - labelWidth - (width * 0.05);
    const labelY = height - labelHeight - (width * 0.05);

    fallbackContext.fillStyle = '#FFFFFF';
    fallbackContext.fillRect(labelX, labelY, labelWidth, labelHeight);
    fallbackContext.strokeStyle = '#000000';
    fallbackContext.lineWidth = 2;
    fallbackContext.strokeRect(labelX, labelY, labelWidth, labelHeight);

    const headerHeight = labelHeight * 0.35;
    fallbackContext.fillStyle = '#000000';
    fallbackContext.fillRect(labelX, labelY, labelWidth, headerHeight);

    fallbackContext.textAlign = 'center';
    fallbackContext.textBaseline = 'middle';

    fallbackContext.fillStyle = '#FFFFFF';
    fallbackContext.font = `bold ${labelHeight * 0.2}px "Arial Black", sans-serif`;
    fallbackContext.fillText('PARENTAL', labelX + labelWidth / 2, labelY + headerHeight / 2);

    fallbackContext.fillStyle = '#000000';
    fallbackContext.font = `bold ${labelHeight * 0.2}px "Arial Black", sans-serif`;
    fallbackContext.fillText('ADVISORY', labelX + labelWidth / 2, labelY + headerHeight + (labelHeight - headerHeight) * 0.3);

    fallbackContext.font = `bold ${labelHeight * 0.12}px Arial, sans-serif`;
    fallbackContext.fillText('EXPLICIT CONTENT', labelX + labelWidth / 2, labelY + headerHeight + (labelHeight - headerHeight) * 0.7);

    return fallbackContext.getImageData(0, 0, width, height);
  }

  loadParticles(source, density, allowLuminance, minLuminance, isInitial = false, isTransition = false) {
    const image = new Image();
    if (!source.startsWith('blob:') && !source.startsWith('data:')) {
      image.crossOrigin = 'anonymous';
    }

    image.onload = () => {
      const settings = this.getSettings();
      const initialDiffusion = isTransition ? settings.maxDiffusion : settings.diffusion;
      const { particles, isDark } = this.buildParticlesParams(
        image,
        density,
        allowLuminance,
        minLuminance,
        initialDiffusion,
      );

      if (isInitial || this.transition.phase === 'IDLE') {
        this.particles = particles;
        this.isDarkImage = isDark;
        updateLuminanceControls();
      } else {
        this.transition.pendingParticles = particles;
        this.transition.pendingIsDark = isDark;
        this.transition.ready = true;
      }
    };

    image.onerror = () => {
      if (isTransition && this.transition.phase !== 'IDLE') {
        this.transition.phase = 'RECOVERING';
        this.transition.startTime = performance.now();
      }
    };

    image.src = source;
  }

  setPlaybackPlaying(isPlaying) {
    if (this.isPlaying === isPlaying) {
      return;
    }

    this.isPlaying = isPlaying;
    this.playTransition = {
      phase: isPlaying ? 'HOLD_PLAYING' : 'PAUSING',
      startTime: performance.now(),
    };
  }

  ensureAudioAnalysis() {
    if (!this.isPlaying) {
      return false;
    }

    if (this.analyser && this.mediaElement?.isConnected) {
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }
      return true;
    }

    const now = performance.now();
    if (now - this.lastAnalysisAttempt < 2000) {
      return false;
    }

    this.lastAnalysisAttempt = now;
    const mediaElement = document.querySelector('audio, video');
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!mediaElement || !AudioContextClass) {
      return false;
    }

    if (this.mediaElement && mediaElement !== this.mediaElement && this.mediaElement.isConnected) {
      return false;
    }

    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeDomainData = new Float32Array(this.analyser.frequencyBinCount);
        this.analysisWaveArray = this.timeDomainData;
      }

      let source = this.mediaSourceCache.get(mediaElement);
      if (!source) {
        source = this.audioContext.createMediaElementSource(mediaElement);
        this.mediaSourceCache.set(mediaElement, source);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }

      this.mediaSource = source;
      this.mediaElement = mediaElement;
      return true;
    } catch {
      return false;
    }
  }

  readLiveAudioMetrics() {
    if (!this.analyser || !this.frequencyData || !this.timeDomainData || !this.analysisWaveArray) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    if (typeof this.analyser.getFloatTimeDomainData === 'function') {
      this.analyser.getFloatTimeDomainData(this.timeDomainData);
    } else {
      const byteTimeDomain = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(byteTimeDomain);
      for (let index = 0; index < byteTimeDomain.length; index += 1) {
        this.timeDomainData[index] = (byteTimeDomain[index] - 128) / 128;
      }
    }

    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;
    let energySum = 0;
    const length = this.frequencyData.length;

    for (let index = 0; index < 15 && index < length; index += 1) {
      bassSum += this.frequencyData[index];
    }

    for (let index = 15; index < 120 && index < length; index += 1) {
      midSum += this.frequencyData[index];
    }

    for (let index = 120; index < 400 && index < length; index += 1) {
      highSum += this.frequencyData[index];
    }

    for (let index = 0; index < length; index += 1) {
      energySum += this.frequencyData[index];
    }

    if (energySum <= 0) {
      this.zeroDataFrames += 1;
      return null;
    }

    this.zeroDataFrames = 0;

    const bass = (bassSum / 15) / 255;
    const mid = (midSum / 105) / 255;
    const high = (highSum / 280) / 255;
    const energy = (energySum / Math.max(1, length)) / 255;
    const kick = bass > 0.8 ? bass : 0;
    const snare = mid > 0.5 && high > 0.4 ? mid : 0;

    return {
      bass,
      mid,
      high,
      energy,
      kick,
      snare,
      waveArray: this.analysisWaveArray,
    };
  }

  getFallbackPlaybackTime() {
    const reportedTime = Number(state.playbackTime) || 0;
    const now = performance.now();

    if (
      this.fallbackPerfAnchor === 0 ||
      Math.abs(reportedTime - this.fallbackReportedTime) > 0.05
    ) {
      this.fallbackPlaybackAnchor = reportedTime;
      this.fallbackReportedTime = reportedTime;
      this.fallbackPerfAnchor = now;
    }

    return this.fallbackPlaybackAnchor + (now - this.fallbackPerfAnchor) / 1000;
  }

  getTrackSeed() {
    const input = `${state.currentMeta?.id || ''}:${state.currentMeta?.title || ''}:${state.currentMeta?.artist || ''}`;
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
      hash = ((hash << 5) - hash) + input.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash) || 1;
  }

  buildFallbackAudioMetrics() {
    const playbackTime = this.getFallbackPlaybackTime();
    const seed = this.getTrackSeed();
    const tempo = 82 + (seed % 64);
    const beat = playbackTime * tempo / 60;
    const phasePulse = (phase, width) => {
      const distance = Math.min(phase, 1 - phase);
      return Math.pow(clamp(1 - distance / width, 0, 1), 2);
    };

    const beatPhase = beat % 1;
    const kick = phasePulse(beatPhase, 0.1);
    const snare = phasePulse((beatPhase + 0.5) % 1, 0.08);
    const bass = clamp(0.16 + kick * 0.78 + (Math.sin(playbackTime * 1.8 + seed * 0.01) * 0.5 + 0.5) * 0.18, 0, 1);
    const mid = clamp(0.12 + snare * 0.55 + (Math.sin(playbackTime * 2.6 + seed * 0.013) * 0.5 + 0.5) * 0.24, 0, 1);
    const high = clamp(0.08 + (Math.sin(playbackTime * 7.4 + seed * 0.017) * 0.5 + 0.5) * 0.22 + snare * 0.22, 0, 1);
    const energy = clamp(bass * 0.42 + mid * 0.34 + high * 0.24, 0, 1);

    for (let index = 0; index < this.fallbackWaveArray.length; index += 1) {
      const position = index / Math.max(1, this.fallbackWaveArray.length - 1);
      const waveA = Math.sin(position * Math.PI * 6 + playbackTime * 4.2 + seed * 0.001) * (0.08 + bass * 0.2);
      const waveB = Math.cos(position * Math.PI * 14 - playbackTime * 3.4 + seed * 0.002) * (0.05 + high * 0.14);
      const waveC = Math.sin(position * Math.PI * 2 + playbackTime * 2.1) * (0.04 + snare * 0.12);
      this.fallbackWaveArray[index] = waveA + waveB + waveC;
    }

    return {
      bass,
      mid,
      high,
      energy,
      kick,
      snare,
      waveArray: this.fallbackWaveArray,
    };
  }

  getAudioMetrics() {
    if (!this.isPlaying) {
      return {
        bass: 0,
        mid: 0,
        high: 0,
        energy: 0,
        kick: 0,
        snare: 0,
        waveArray: null,
      };
    }

    this.ensureAudioAnalysis();
    return this.readLiveAudioMetrics() || this.buildFallbackAudioMetrics();
  }

  simulateAndDraw(particleList, alphaMult, currentDiffusion, metrics, bridgeProgressAlpha, otherList, isPrimary = true) {
    if (alphaMult <= 0.01 || !this.context) {
      return;
    }

    const settings = this.getSettings();
    this.context.globalAlpha = alphaMult;
    this.context.globalCompositeOperation = 'source-over';

    for (let index = 0; index < particleList.length; index += 1) {
      const particle = particleList[index];
      const totalDiffusion = settings.baseNoise + Math.pow(particle.distNorm, 1.5) * currentDiffusion;
      const targetX = particle.baseX + particle.randX * totalDiffusion;
      const targetY = particle.baseY + particle.randY * totalDiffusion;
      const waveX = Math.sin(particle.baseX * 0.05 + this.time * 0.05) * metrics.mid * settings.motion * 50;
      const waveY = Math.cos(particle.baseY * 0.05 - this.time * 0.03) * metrics.bass * settings.motion * 80;
      let waveformDisplacement = 0;

      if (settings.motionMode === 'waveform-displace' && metrics.waveArray && metrics.waveArray.length > 0) {
        const waveIndex = Math.floor((particle.baseX / this.width) * metrics.waveArray.length);
        const safeIndex = Math.max(0, Math.min(metrics.waveArray.length - 1, waveIndex));
        waveformDisplacement = metrics.waveArray[safeIndex] * 200 * settings.motion;
      }

      const kickPush = metrics.kick * 100 * settings.motion;
      const kickDX = Math.cos(particle.angle) * kickPush * particle.distNorm;
      const kickDY = Math.sin(particle.angle) * kickPush * particle.distNorm;
      const snareScatterX = metrics.snare * particle.randX * 150 * settings.motion;
      const snareScatterY = metrics.snare * particle.randY * 150 * settings.motion;
      const finalX = targetX + waveX + kickDX + snareScatterX;
      const finalY = targetY + waveY + kickDY + snareScatterY + waveformDisplacement;

      particle.vx += (finalX - particle.x) * 0.1;
      particle.vy += (finalY - particle.y) * 0.1;
      particle.vx *= 0.8;
      particle.vy *= 0.8;
      particle.x += particle.vx;
      particle.y += particle.vy;

      this.context.fillStyle = particle.color;
      this.context.fillRect(Math.floor(particle.x), Math.floor(particle.y), settings.size, settings.size);

      if (settings.glow) {
        this.context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.context.lineWidth = 0.5;
        this.context.strokeRect(
          Math.floor(particle.x) - 0.5,
          Math.floor(particle.y) - 0.5,
          settings.size + 1,
          settings.size + 1,
        );
      }

      if (
        otherList &&
        otherList.length > 0 &&
        settings.bridgeDensity > 0 &&
        this.transition.phase === 'CROSSFADING' &&
        isPrimary &&
        (particle.idx % 100) < settings.bridgeDensity
      ) {
        const other = otherList[particle.idx % otherList.length];
        const bridgeRed = (particle.r + other.r) / 2;
        const bridgeGreen = (particle.g + other.g) / 2;
        const bridgeBlue = (particle.b + other.b) / 2;
        const orbitX = Math.cos(this.time * 2 + particle.idx) * 60 * settings.bridgeIntensity;
        const orbitY = Math.sin(this.time * 2 + particle.idx) * 60 * settings.bridgeIntensity;
        const bridgeSize = settings.size * (0.8 + 0.8 * settings.bridgeIntensity);

        this.context.globalAlpha = bridgeProgressAlpha * settings.bridgeIntensity;
        this.context.fillStyle = `rgba(${Math.floor(bridgeRed)},${Math.floor(bridgeGreen)},${Math.floor(bridgeBlue)}, 1)`;
        this.context.globalCompositeOperation = 'lighter';
        this.context.fillRect(
          Math.floor(particle.x + orbitX) - bridgeSize / 2,
          Math.floor(particle.y + orbitY) - bridgeSize / 2,
          bridgeSize,
          bridgeSize,
        );
        this.context.globalCompositeOperation = 'source-over';
        this.context.globalAlpha = alphaMult;
      }
    }

    this.context.globalCompositeOperation = 'source-over';
    this.context.globalAlpha = 1;
  }

  animate(timestamp) {
    this.animationFrame = window.requestAnimationFrame(this.animate);

    if (!this.context) {
      return;
    }

    const settings = this.getSettings();
    this.time += 1;
    this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.context.fillRect(0, 0, this.width, this.height);

    const metrics = this.getAudioMetrics();
    let currentDiffusion = settings.diffusion;
    let alphaMain = 1;
    let alphaPending = 0;
    let drawPending = false;
    let bridgeProgressAlpha = 0;

    if (this.transition.phase !== 'IDLE') {
      const now = performance.now();
      const elapsed = now - this.transition.startTime;

      if (this.transition.phase === 'EXPLODING') {
        const totalExplode = settings.explodeJump + settings.explodeHold;
        if (elapsed >= totalExplode && this.transition.ready) {
          this.transition.phase = 'CROSSFADING';
          this.transition.startTime = now;
          currentDiffusion = settings.maxDiffusion;
        } else if (elapsed < settings.explodeJump) {
          const jumpProgress = clamp(elapsed / settings.explodeJump, 0, 1);
          const easeOut = 1 - Math.pow(1 - jumpProgress, 3);
          currentDiffusion = settings.diffusion + (settings.maxDiffusion - settings.diffusion) * easeOut;
        } else {
          currentDiffusion = settings.maxDiffusion;
        }
      } else if (this.transition.phase === 'CROSSFADING') {
        drawPending = true;
        if (elapsed >= settings.crossfade) {
          this.particles = this.transition.pendingParticles;
          this.isDarkImage = this.transition.pendingIsDark;
          updateLuminanceControls();
          this.transition.phase = 'GATHERING';
          this.transition.startTime = now;
          currentDiffusion = settings.maxDiffusion;
          this.transition.pendingParticles = [];
          drawPending = false;
        } else {
          const progress = clamp(elapsed / settings.crossfade, 0, 1);
          alphaMain = 1 - progress;
          alphaPending = progress;
          bridgeProgressAlpha = Math.sin(progress * Math.PI);
          currentDiffusion = settings.maxDiffusion;
        }
      } else if (this.transition.phase === 'GATHERING') {
        if (elapsed >= settings.gather) {
          this.transition.phase = 'HOLD_GATHERING';
          this.transition.startTime = now;
          currentDiffusion = settings.minDiffusion;
        } else {
          const progress = clamp(elapsed / settings.gather, 0, 1);
          currentDiffusion = settings.maxDiffusion -
            (settings.maxDiffusion - settings.minDiffusion) * (progress * progress * progress);
        }
      } else if (this.transition.phase === 'HOLD_GATHERING') {
        const minWait = HOLD_SOLID_BEAT_SYNC_MIN_MS;
        const maxWait = HOLD_SOLID_BEAT_SYNC_MAX_MS;
        const isBeat = metrics.kick > 0 || metrics.bass > 0.85;

        if ((elapsed >= minWait && isBeat) || elapsed >= maxWait) {
          this.transition.phase = 'RECOVERING';
          this.transition.startTime = now;
          currentDiffusion = settings.minDiffusion;
        } else {
          currentDiffusion = settings.minDiffusion;
        }
      } else if (this.transition.phase === 'RECOVERING') {
        if (elapsed >= settings.recover) {
          this.transition.phase = 'IDLE';
          currentDiffusion = settings.diffusion;
        } else {
          const progress = clamp(elapsed / settings.recover, 0, 1);
          currentDiffusion = settings.minDiffusion + (settings.diffusion - settings.minDiffusion) * progress;
        }
      }
    } else {
      const elapsed = performance.now() - this.playTransition.startTime;

      if (this.playTransition.phase === 'PAUSING') {
        const progress = clamp(elapsed / settings.pauseTime, 0, 1);
        const smoothProgress = progress * progress * (3 - 2 * progress);
        currentDiffusion = settings.diffusion - (settings.diffusion - settings.minDiffusion) * smoothProgress;
        if (elapsed >= settings.pauseTime) {
          this.playTransition.phase = 'PAUSED';
        }
      } else if (this.playTransition.phase === 'PAUSED') {
        currentDiffusion = settings.minDiffusion;
      } else if (this.playTransition.phase === 'HOLD_PLAYING') {
        const minWait = HOLD_SOLID_BEAT_SYNC_MIN_MS;
        const maxWait = HOLD_SOLID_BEAT_SYNC_MAX_MS;
        const isBeat = metrics.kick > 0 || metrics.bass > 0.85;

        currentDiffusion = settings.minDiffusion;

        if ((elapsed >= minWait && isBeat) || elapsed >= maxWait) {
          this.playTransition.phase = 'RESUMING';
          this.playTransition.startTime = performance.now();
        }
      } else if (this.playTransition.phase === 'RESUMING') {
        const progress = clamp(elapsed / settings.playTime, 0, 1);
        const smoothProgress = progress * progress * (3 - 2 * progress);
        currentDiffusion = settings.minDiffusion + (settings.diffusion - settings.minDiffusion) * smoothProgress;
        if (elapsed >= settings.playTime) {
          this.playTransition.phase = 'PLAYING';
        }
      } else if (this.playTransition.phase === 'PLAYING') {
        currentDiffusion = settings.diffusion;
      }
    }

    const oldParticles = this.particles;
    const newParticles = this.transition.pendingParticles;

    if (this.transition.phase !== 'IDLE' && newParticles.length > 0) {
      this.simulateAndDraw(oldParticles, alphaMain, currentDiffusion, metrics, bridgeProgressAlpha, newParticles, true);
      if (drawPending) {
        this.simulateAndDraw(newParticles, alphaPending, currentDiffusion, metrics, bridgeProgressAlpha, oldParticles, false);
      }
    } else {
      this.simulateAndDraw(oldParticles, alphaMain, currentDiffusion, metrics, bridgeProgressAlpha);
    }

    this.context.filter = 'none';
  }
}

const particleVisualizer = new ParticleVisualizerSurface(
  elements.canvas,
  elements.stage,
  () => state.visualSettings,
);

function updateVisualLabels() {
  elements.luminanceValue.textContent = `${Math.round(state.visualSettings.minLuminance)}%`;
  elements.densityValue.textContent = `${Math.round(state.visualSettings.density)}%`;
  elements.sizeValue.textContent = `${state.visualSettings.size.toFixed(1)} px`;
  elements.diffusionValue.textContent = `${Math.round(state.visualSettings.diffusion)}`;
  elements.baseNoiseValue.textContent = `${state.visualSettings.baseNoise.toFixed(1)}`;
  elements.motionValue.textContent = `${state.visualSettings.motion.toFixed(2)}x`;
  elements.pauseTimeValue.textContent = `${Math.round(state.visualSettings.pauseTime)}`;
  elements.playTimeValue.textContent = `${Math.round(state.visualSettings.playTime)}`;
  elements.explodeJumpValue.textContent = `${Math.round(state.visualSettings.explodeJump)}`;
  elements.explodeHoldValue.textContent = `${Math.round(state.visualSettings.explodeHold)}`;
  elements.crossfadeValue.textContent = `${Math.round(state.visualSettings.crossfade)}`;
  elements.gatherValue.textContent = `${Math.round(state.visualSettings.gather)}`;
  elements.holdZeroValue.textContent = `${HOLD_SOLID_BEAT_SYNC_MIN_MS} - ${HOLD_SOLID_BEAT_SYNC_MAX_MS}ms`;
  elements.recoverValue.textContent = `${Math.round(state.visualSettings.recover)}`;
  elements.bridgeDensityValue.textContent = `${Math.round(state.visualSettings.bridgeDensity)}%`;
  elements.bridgeIntensityValue.textContent = `${state.visualSettings.bridgeIntensity.toFixed(1)}`;
}

function updateLuminanceControls() {
  const isDarkImage = Boolean(particleVisualizer.isDarkImage);
  elements.luminanceToggle.checked = isDarkImage && state.visualSettings.manualLuminanceEnable;
  elements.luminanceToggle.disabled = !isDarkImage;
  elements.luminanceRange.disabled = !isDarkImage;
  elements.luminanceNote.hidden = isDarkImage;
}

function setArtworkImageSource(image, source, alt = '') {
  image.alt = alt;
  image.src = source || EMPTY_ARTWORK_DATA_URL;
}

function applyVisualControls() {
  elements.luminanceRange.value = String(state.visualSettings.minLuminance);
  elements.densityRange.value = String(state.visualSettings.density);
  elements.sizeRange.value = String(state.visualSettings.size);
  elements.diffusionRange.value = String(state.visualSettings.diffusion);
  elements.baseNoiseRange.value = String(state.visualSettings.baseNoise);
  elements.motionRange.value = String(state.visualSettings.motion);
  elements.pauseTimeRange.value = String(state.visualSettings.pauseTime);
  elements.playTimeRange.value = String(state.visualSettings.playTime);
  elements.explodeJumpRange.value = String(state.visualSettings.explodeJump);
  elements.explodeHoldRange.value = String(state.visualSettings.explodeHold);
  elements.crossfadeRange.value = String(state.visualSettings.crossfade);
  elements.gatherRange.value = String(state.visualSettings.gather);
  elements.holdZeroRange.value = String(HOLD_SOLID_BEAT_SYNC_MIN_MS);
  elements.recoverRange.value = String(state.visualSettings.recover);
  elements.bridgeDensityRange.value = String(state.visualSettings.bridgeDensity);
  elements.bridgeIntensityRange.value = String(state.visualSettings.bridgeIntensity);
  elements.glowToggle.checked = state.visualSettings.glow;
  elements.motionModeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.motionMode === state.visualSettings.motionMode);
  });
  updateLuminanceControls();
  updateVisualLabels();
}

function toggleMode(mode) {
  state.mode = mode;
  elements.visualPanel.hidden = mode !== 'visual';
  elements.browserPanel.hidden = mode !== 'browser';

  elements.modeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.mode === mode);
  });

  syncUrlState();
}

function applySearchSourceUi() {
  elements.searchSourceButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.source === state.searchSource);
  });
}

function setSearchSource(source) {
  state.searchSource = ['catalog', 'library', 'all'].includes(source) ? source : 'catalog';
  applySearchSourceUi();
  syncUrlState();
}

function renderBrowserDetail() {
  const detail = state.browserDetail;
  const isActive = Boolean(detail);
  elements.browserSearchView.hidden = isActive;
  elements.browserDetailView.hidden = !isActive;

  if (!isActive) {
    elements.detailTracks.replaceChildren();
    return;
  }

  setArtworkImageSource(elements.detailArtwork, detail.artworkUrl, detail.title || detail.subtitle || '');
  elements.detailKicker.textContent = detail.type === 'playlist' ? 'Playlist Tracks' : 'Album Tracks';
  elements.detailTitle.textContent = detail.title || 'Untitled Collection';
  elements.detailMeta.textContent = [detail.subtitle, detail.supporting].filter(Boolean).join(' · ') || 'Apple Music';
  elements.detailSupporting.textContent = detail.type === 'playlist'
    ? 'Pick a track to start playback here, or play the full playlist continuously.'
    : 'Pick a track to start playback here, or play the full album continuously.';
  elements.detailStatus.textContent = state.detailBusy
    ? 'Loading track list...'
    : (state.detailTracks.length > 0 ? `Loaded ${state.detailTracks.length} tracks.` : 'No playable tracks were returned.');
  elements.detailPlayAllButton.disabled = state.detailBusy || state.detailTracks.length === 0;

  const fragment = document.createDocumentFragment();
  state.detailTracks.forEach((track, index) => {
    const row = document.createElement('article');
    row.className = 'detail-track-row';

    const trackIndex = document.createElement('span');
    trackIndex.className = 'detail-track-index';
    trackIndex.textContent = String(index + 1).padStart(2, '0');

    const copy = document.createElement('div');
    copy.className = 'detail-track-copy';

    const title = document.createElement('p');
    title.className = 'detail-track-title';
    title.textContent = track.title;

    const metaRow = document.createElement('div');
    metaRow.className = 'detail-track-meta-row';

    const meta = document.createElement('p');
    meta.className = 'detail-track-meta';
    meta.textContent = [track.subtitle, track.albumName].filter(Boolean).join(' · ') || 'Apple Music';

    const duration = document.createElement('span');
    duration.className = 'detail-track-meta';
    duration.textContent = formatTime((track.durationMs || 0) / 1000);

    metaRow.append(meta, duration);
    copy.append(title, metaRow);

    const playButton = document.createElement('button');
    playButton.className = 'ghost-button detail-track-play-button';
    playButton.type = 'button';
    playButton.dataset.index = String(index);
    playButton.textContent = 'Play';

    row.append(trackIndex, copy, playButton);
    fragment.appendChild(row);
  });

  elements.detailTracks.replaceChildren(fragment);
}

function clearBrowserDetail() {
  state.browserDetail = null;
  state.detailTracks = [];
  state.detailBusy = false;
  renderBrowserDetail();
}

function applyUiVisibility() {
  elements.appShell.classList.toggle('is-sidebar-hidden', !state.showSidebar);
  elements.appShell.classList.toggle('is-player-hidden', !state.showPlayer);
  elements.appShell.classList.toggle('is-toolbar-collapsed', !state.showToolbarOptions);
  elements.toggleSidebarButton.classList.toggle('is-active', state.showSidebar);
  elements.togglePlayerButton.classList.toggle('is-active', state.showPlayer);
  elements.toggleSidebarButton.textContent = state.showSidebar ? 'Hide Sidebar' : 'Show Sidebar';
  elements.togglePlayerButton.textContent = state.showPlayer ? 'Hide Player' : 'Show Player';
  elements.toolbarCollapseButton.textContent = state.showToolbarOptions ? '>' : '<';
  window.requestAnimationFrame(() => {
    particleVisualizer.handleResize();
  });
}

function toggleSidebarVisibility() {
  state.showSidebar = !state.showSidebar;
  applyUiVisibility();
  persistUiPreferences();
}

function togglePlayerVisibility() {
  state.showPlayer = !state.showPlayer;
  applyUiVisibility();
  persistUiPreferences();
}

function toggleToolbarOptionsVisibility() {
  state.showToolbarOptions = !state.showToolbarOptions;
  applyUiVisibility();
  persistUiPreferences();
}

function syncFullscreenState() {
  state.isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  elements.fullscreenButton.textContent = state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
  window.requestAnimationFrame(() => {
    particleVisualizer.handleResize();
  });
}

async function toggleFullscreenMode() {
  try {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
      if (typeof elements.appShell.requestFullscreen === 'function') {
        await elements.appShell.requestFullscreen();
      } else if (typeof elements.appShell.webkitRequestFullscreen === 'function') {
        elements.appShell.webkitRequestFullscreen();
      }
    } else if (typeof document.exitFullscreen === 'function') {
      await document.exitFullscreen();
    } else if (typeof document.webkitExitFullscreen === 'function') {
      document.webkitExitFullscreen();
    }
  } catch (error) {
    setStatus(error.message || 'Failed to enter fullscreen.');
  } finally {
    syncFullscreenState();
  }
}

function updateStorefrontInput() {
  elements.storefrontInput.value = state.storefront || 'us';
}

function loadMusicKitScript() {
  if (window.MusicKit) {
    return Promise.resolve(window.MusicKit);
  }

  if (state.musicKitPromise) {
    return state.musicKitPromise;
  }

  state.musicKitPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="musickit.js"]');

    function handleReady() {
      if (window.MusicKit) {
        resolve(window.MusicKit);
      } else {
        reject(new Error('MusicKit JS loaded, but the global object is unavailable.'));
      }
    }

    window.addEventListener('musickitloaded', handleReady, { once: true });

    if (existingScript) {
      existingScript.addEventListener('error', () => reject(new Error('MusicKit JS failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js-cdn.music.apple.com/musickit/v1/musickit.js';
    script.async = true;
    script.addEventListener('load', handleReady, { once: true });
    script.addEventListener('error', () => reject(new Error('MusicKit JS failed to load.')), { once: true });
    document.head.appendChild(script);
  });

  return state.musicKitPromise;
}

async function fetchAppleMusicConfig() {
  const data = await requestJson('/api/apple-music/config');
  state.config = data;
  return data;
}

function getPlayer() {
  if (!state.musicKit) {
    return null;
  }

  return state.musicKit.player || state.musicKit;
}

function setPlayerVolume(value) {
  const safeValue = clamp(value, 0, 1);
  state.volume = safeValue;

  if (state.musicKit && typeof state.musicKit.volume === 'number') {
    state.musicKit.volume = safeValue;
  }

  const player = getPlayer();
  if (player && typeof player.volume === 'number') {
    player.volume = safeValue;
  }

  updateSliderShell(elements.volumeShell, elements.volumeSlider, safeValue);
}

function syncStateFromMusicKit() {
  const player = getPlayer();
  const userToken = typeof state.musicKit?.musicUserToken === 'string' && state.musicKit.musicUserToken
    ? state.musicKit.musicUserToken
    : (localStorage.getItem(APPLE_USER_TOKEN_STORAGE_KEY) || '');
  const storefrontId = typeof state.musicKit?.storefrontId === 'string' && state.musicKit.storefrontId
    ? state.musicKit.storefrontId
    : (localStorage.getItem(APPLE_STOREFRONT_STORAGE_KEY) || state.storefront || state.config?.storefront || 'us');

  state.connected = Boolean(userToken);
  state.userToken = userToken;
  state.storefront = storefrontId || 'us';

  if (typeof player?.volume === 'number' && Number.isFinite(player.volume)) {
    state.volume = clamp(player.volume, 0, 1);
  }

  persistAppleMusicSession();
  updateStorefrontInput();
}

function bindMusicKitEvents() {
  if (!state.musicKit || state.musicKitEventsBound || !window.MusicKit?.Events) {
    return;
  }

  state.musicKit.addEventListener(window.MusicKit.Events.mediaPlaybackError, (error) => {
    handleMediaPlaybackError(error);
  });

  const events = [
    window.MusicKit.Events.authorizationStatusDidChange,
    window.MusicKit.Events.playbackStateDidChange,
    window.MusicKit.Events.mediaItemDidChange,
    window.MusicKit.Events.playbackTimeDidChange,
    window.MusicKit.Events.playbackDurationDidChange,
    window.MusicKit.Events.queueItemsDidChange,
  ];

  events.forEach((eventName) => {
    state.musicKit.addEventListener(eventName, () => {
      syncStateFromMusicKit();
      renderAppleMusicUi();
      syncPlayerUi();
    });
  });

  state.musicKitEventsBound = true;
}

async function ensureMusicKit() {
  const config = state.config || await fetchAppleMusicConfig();

  if (!config.enabled) {
    throw new Error(config.error || 'Apple Music is not ready yet.');
  }

  await loadMusicKitScript();

  if (!window.MusicKit || typeof window.MusicKit.configure !== 'function') {
    throw new Error('MusicKit JS did not initialize correctly.');
  }

  if (!state.musicKit) {
    const configured = await window.MusicKit.configure({
      developerToken: config.developerToken,
      app: config.app,
      suppressErrorDialog: true,
    });
    state.musicKit = configured ||
      (typeof window.MusicKit.getInstance === 'function' ? window.MusicKit.getInstance() : null);
  }

  if (!state.musicKit) {
    throw new Error('MusicKit JS loaded, but no usable authorization instance was returned.');
  }

  bindMusicKitEvents();
  setPlayerVolume(state.volume);
  syncStateFromMusicKit();
  return state.musicKit;
}

async function fetchAppleMusicIdentity() {
  if (!state.userToken) {
    state.identity = null;
    renderAppleMusicUi();
    return null;
  }

  try {
    const data = await requestJson('/api/apple-music/identity', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        musicUserToken: state.userToken,
      }),
    });

    state.identity = data.identity || null;

    if (state.identity?.storefrontId) {
      state.storefront = state.identity.storefrontId;
      persistAppleMusicSession();
      updateStorefrontInput();
    }
  } catch (error) {
    state.identity = {
      storefrontId: state.storefront || '',
      note: readErrorMessage(error, 'Apple Music identity lookup failed.'),
    };
  }

  renderAppleMusicUi();
  return state.identity;
}

function renderAppleMusicUi() {
  const config = state.config;
  if (!config) {
    elements.connectButton.disabled = true;
    elements.disconnectButton.disabled = !state.connected;
    setAuthState('Checking Apple Music setup', 'default');
    setAuthHint('Checking whether the server is ready with a developer token.');
    elements.identityBadge.textContent = 'Checking';
    elements.identityBadge.classList.remove('is-connected');
    elements.identitySummary.textContent = 'Once the server configuration is loaded, the connection status and Apple Music storefront will appear here.';
    return;
  }

  const ready = Boolean(config.enabled);
  const originMismatch = ready && hasOriginMismatch(config.origin);

  elements.connectButton.disabled = !ready || originMismatch;
  elements.disconnectButton.disabled = !state.connected;

  if (!ready) {
    setAuthState('Apple Music not ready', 'warning');
    setAuthHint(config?.error || 'Please configure the developer token on the server before starting Apple Music authorization.');
    elements.identityBadge.textContent = 'Disconnected';
    elements.identityBadge.classList.remove('is-connected');
    elements.identitySummary.textContent = 'After authorization, the storefront for this Apple Music account will appear here.';
    return;
  }

  if (originMismatch) {
    setAuthState('Origin mismatch', 'warning');
    setAuthHint(`The current page origin is ${window.location.origin}, but the token origin is configured as ${config.origin}.`);
    elements.identityBadge.textContent = 'Restricted';
    elements.identityBadge.classList.remove('is-connected');
    return;
  }

  if (state.connected) {
    const storefrontLabel = state.identity?.storefrontId || state.storefront || config.storefront || 'us';
    setAuthState(`Connected to Apple Music · ${storefrontLabel}`, 'connected');
    setAuthHint('You can search songs, albums, and playlists and send them directly to the current playback queue.');
    elements.identityBadge.textContent = state.identity?.storefrontName || storefrontLabel.toUpperCase();
    elements.identityBadge.classList.add('is-connected');
    elements.identitySummary.textContent = state.identity?.note || 'Apple Music authorization is complete. Full playback is now available.';
    return;
  }

  setAuthState('Ready to connect', 'default');
  setAuthHint('Once connected, the player will control the real Apple Music playback queue directly.');
  elements.identityBadge.textContent = 'Disconnected';
  elements.identityBadge.classList.remove('is-connected');
  elements.identitySummary.textContent = 'After authorization, the storefront for this Apple Music account will appear here.';
}

async function initializeAppleMusic() {
  setAuthState('Checking Apple Music setup', 'default');
  setAuthHint('Checking whether the server is ready with a developer token.');

  try {
    await fetchAppleMusicConfig();
    if (state.config.enabled) {
      await ensureMusicKit();
      if (state.userToken) {
        await fetchAppleMusicIdentity();
      }
    }
  } catch (error) {
    console.error('Apple Music initialization failed:', error);
    state.config = {
      enabled: false,
      error: readErrorMessage(error, 'Apple Music initialization failed.'),
      storefront: 'us',
      origin: '',
    };
  }

  renderAppleMusicUi();
  syncPlayerUi({ forceArtwork: true });
}

async function connectAppleMusic() {
  sessionStorage.removeItem(APPLE_AUTOCONNECT_DISABLED_KEY);
  elements.connectButton.disabled = true;
  setAuthState('Starting authorization', 'default');
  setAuthHint('If this browser cannot open the authorization flow properly, it will switch to the dedicated connection page.');

  try {
    const musicKit = await ensureMusicKit();
    const userToken = readMusicUserToken(musicKit) || await withTimeout(
      resolveAuthorizedUserToken(musicKit),
      24_000,
      'The Apple Music authorization window did not open correctly.',
    );

    if (!userToken) {
      throw new Error('Apple Music did not return a valid musicUserToken.');
    }

    state.userToken = userToken;
    syncStateFromMusicKit();
    await fetchAppleMusicIdentity();
    setStatus('Apple Music is connected. You can start choosing music now.');
    syncPlayerUi();
  } catch (error) {
    setStatus('Authorization did not complete in this browser. Switching to the dedicated connection page.');
    await redirectToAppleMusicLogin().catch(() => {
      setAuthState('Connection failed', 'warning');
      setAuthHint(error.message || 'Apple Music authorization failed.');
    });
  } finally {
    renderAppleMusicUi();
  }
}

async function disconnectAppleMusic() {
  try {
    const musicKit = state.musicKit || await ensureMusicKit();
    if (typeof musicKit.pause === 'function') {
      await musicKit.pause().catch(() => {});
    }
    if (typeof musicKit.unauthorize === 'function') {
      await musicKit.unauthorize().catch(() => {});
    }
  } catch {
    // Ignore disconnect errors and still clear local state.
  }

  clearAppleMusicSession();
  renderAppleMusicUi();
  syncPlayerUi({ forceArtwork: true });
  setStatus('Apple Music disconnected.');
}

function getArtworkTemplate(item) {
  return item?.artworkURL || item?.attributes?.artwork?.url || item?.artwork?.url || '';
}

function resolveArtworkUrl(item, size = 900) {
  const artwork = item?.attributes?.artwork || item?.artwork || null;
  const rawUrl = getArtworkTemplate(item);

  if (artwork && window.MusicKit?.formatArtworkURL) {
    try {
      return window.MusicKit.formatArtworkURL(artwork, size, size);
    } catch {
      // Ignore and fall through to template replacement.
    }
  }

  if (!rawUrl) {
    return '';
  }

  return rawUrl
    .replace('{w}', String(size))
    .replace('{h}', String(size))
    .replace('{f}', 'jpg')
    .replace('{c}', 'sr');
}

function readTextValue(value) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.standard || value.short || value.editorial || '';
}

function extractMeta(item) {
  if (!item) {
    return {
      id: '',
      type: '',
      title: '',
      artist: '',
      album: '',
      url: '',
      artworkUrl: '',
    };
  }

  return {
    id: item.id || item.playParams?.id || item.container?.id || '',
    type: item.type || item.playParams?.kind || '',
    title: item.title || item.attributes?.name || item.name || '',
    artist: item.artistName || item.attributes?.artistName || item.attributes?.curatorName || '',
    album: item.albumName || item.attributes?.albumName || item.container?.attributes?.name || '',
    url: item.url || item.attributes?.url || '',
    artworkUrl: resolveArtworkUrl(item),
  };
}

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateSliderShell(shell, slider, ratio) {
  const safeRatio = clamp(ratio, 0, 1);
  shell.style.setProperty('--value', String(safeRatio));
  slider.value = String(Math.round(safeRatio * 1000));
}

function describePlaybackError(error) {
  const candidates = [
    error?.message,
    error?.description,
    error?.errorCode,
    error?.code,
    error?.name,
  ];
  const message = candidates.find((value) => typeof value === 'string' && value.trim());
  return message ? message.trim() : 'unknown error';
}

function resetPlaybackRecoveryState() {
  if (state.playbackRecoveryTimer) {
    window.clearTimeout(state.playbackRecoveryTimer);
    state.playbackRecoveryTimer = null;
  }

  state.playbackRecoveryPending = false;
  state.lastPlaybackErrorSignature = '';
}

function readPlayerSnapshot() {
  const player = getPlayer();

  if (!player) {
    return {
      item: null,
      isPlaying: false,
      playbackTime: 0,
      playbackDuration: 0,
      playbackRemaining: 0,
      volume: state.volume,
      repeatMode: REPEAT_MODE_NONE,
      shuffleMode: SHUFFLE_MODE_OFF,
      playbackState: 0,
      hasQueue: false,
    };
  }

  const item = safePlayerRead(() => player.nowPlayingItem, null);
  const playbackDuration = Number(safePlayerRead(() => player.currentPlaybackDuration, 0)) || 0;
  const playbackTime = Number(safePlayerRead(() => player.currentPlaybackTime, 0)) || 0;
  const playbackRemaining = Number(
    safePlayerRead(() => player.currentPlaybackTimeRemaining, Math.max(0, playbackDuration - playbackTime)),
  ) || Math.max(0, playbackDuration - playbackTime);
  const rawPlaybackState = safePlayerRead(
    () => player.playbackState ?? state.musicKit?.playbackState ?? 0,
    0,
  );
  const numericPlaybackState = Number(rawPlaybackState);
  const playbackState = Number.isFinite(numericPlaybackState) ? numericPlaybackState : rawPlaybackState;
  const queue = safePlayerRead(() => player.queue || state.musicKit?.queue || null, null);
  const queueItems = Array.isArray(queue?.items) ? queue.items : [];
  const hasQueue = Boolean(item) ||
    Boolean(queue) && (!safePlayerRead(() => queue.isEmpty, false) || queueItems.length > 0);
  const isPlaying = safePlayerRead(() => player.isPlaying ?? state.musicKit?.isPlaying, false) === true ||
    isPlaybackStatePlaying(playbackState);

  return {
    item,
    isPlaying,
    playbackTime,
    playbackDuration,
    playbackRemaining,
    volume: Number.isFinite(safePlayerRead(() => player.volume, NaN))
      ? clamp(safePlayerRead(() => player.volume, state.volume), 0, 1)
      : state.volume,
    repeatMode: Number(safePlayerRead(
      () => player.repeatMode ?? state.musicKit?.repeatMode ?? REPEAT_MODE_NONE,
      REPEAT_MODE_NONE,
    )) || REPEAT_MODE_NONE,
    shuffleMode: Number(safePlayerRead(
      () => player.shuffleMode ?? state.musicKit?.shuffleMode ?? SHUFFLE_MODE_OFF,
      SHUFFLE_MODE_OFF,
    )) || SHUFFLE_MODE_OFF,
    playbackState,
    hasQueue,
  };
}

function setPlaybackUiOverride(isPlaying, ttlMs = 1800) {
  state.playbackUiOverride = {
    isPlaying: Boolean(isPlaying),
    expiresAt: performance.now() + ttlMs,
  };
}

function resolvePlaybackUiState(actualIsPlaying) {
  const resolvedIsPlaying = Boolean(actualIsPlaying);
  const override = state.playbackUiOverride;

  if (!override) {
    return resolvedIsPlaying;
  }

  if (override.isPlaying === resolvedIsPlaying) {
    state.playbackUiOverride = null;
    return resolvedIsPlaying;
  }

  if (performance.now() <= override.expiresAt) {
    return override.isPlaying;
  }

  state.playbackUiOverride = null;
  return resolvedIsPlaying;
}

function renderPlaybackToggle(isPlaying) {
  elements.playToggleButton.dataset.playbackState = isPlaying ? 'playing' : 'paused';
  elements.playToggleButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
  elements.playIcon.hidden = isPlaying;
  elements.pauseIcon.hidden = !isPlaying;
}

function renderPlayerButtons(meta, snapshot) {
  const isPlaying = Boolean(snapshot.isPlaying);
  renderPlaybackToggle(isPlaying);
  elements.playToggleButton.setAttribute('aria-label', isPlaying ? 'Pause playback' : 'Play playback');
  elements.playToggleButton.title = isPlaying ? 'Pause' : 'Play';

  const queueInteractive = snapshot.hasQueue;
  const playInteractive = queueInteractive || Boolean(meta.id);
  elements.playToggleButton.disabled = !playInteractive;
  elements.previousButton.disabled = !queueInteractive;
  elements.nextButton.disabled = !queueInteractive;
  elements.shuffleButton.disabled = !queueInteractive;
  elements.repeatButton.disabled = !queueInteractive;
  elements.favoriteButton.disabled = !meta.id;

  const isShuffleOn = snapshot.shuffleMode === SHUFFLE_MODE_SONGS;
  const isRepeatAll = snapshot.repeatMode === REPEAT_MODE_ALL;
  const isRepeatOne = snapshot.repeatMode === REPEAT_MODE_ONE;

  elements.shuffleButton.classList.toggle('is-active', isShuffleOn);
  elements.shuffleButton.classList.toggle('is-shuffled', isShuffleOn);
  elements.repeatButton.classList.toggle('is-active', isRepeatAll || isRepeatOne);
  elements.repeatButton.classList.toggle('is-repeat-all', isRepeatAll);
  elements.repeatButton.classList.toggle('is-repeat-one', isRepeatOne);
  elements.repeatModeIndicator.hidden = !isRepeatOne;
  elements.favoriteButton.classList.toggle('is-active', Boolean(meta.id) && state.favorites.has(meta.id));
}

function syncPlayerUi({ forceArtwork = false, isPlayingOverride = null } = {}) {
  const snapshot = readPlayerSnapshot();
  if (typeof isPlayingOverride === 'boolean') {
    setPlaybackUiOverride(isPlayingOverride);
    snapshot.isPlaying = isPlayingOverride;
  } else {
    snapshot.isPlaying = resolvePlaybackUiState(snapshot.isPlaying);
  }

  const meta = extractMeta(snapshot.item);
  const hasTrack = Boolean(meta.title);
  particleVisualizer.setPlaybackPlaying(Boolean(hasTrack && snapshot.isPlaying));

  if (snapshot.isPlaying) {
    resetPlaybackRecoveryState();
  }

  state.currentMeta = {
    ...meta,
    isPlaying: snapshot.isPlaying,
    playbackTime: snapshot.playbackTime,
    playbackDuration: snapshot.playbackDuration,
  };
  state.playbackTime = snapshot.playbackTime;
  state.playbackDuration = snapshot.playbackDuration;
  state.volume = snapshot.volume;

  elements.trackTitle.textContent = hasTrack ? meta.title : 'Nothing playing';
  elements.trackMeta.textContent = hasTrack
    ? [meta.artist, meta.album].filter(Boolean).join(' · ') || 'Apple Music'
    : 'Connect Apple Music to play songs, albums, or playlists';

  elements.playerOpenLink.href = meta.url || 'https://music.apple.com/';
  elements.playerOpenLink.textContent = meta.url ? 'Open in Apple Music' : 'Open Apple Music';

  const progressRatio = snapshot.playbackDuration > 0 ? snapshot.playbackTime / snapshot.playbackDuration : 0;
  if (!state.isSeeking) {
    updateSliderShell(elements.progressShell, elements.progressSlider, progressRatio);
    elements.elapsedTime.textContent = formatTime(snapshot.playbackTime);
    elements.remainingTime.textContent = `-${formatTime(snapshot.playbackRemaining)}`;
  }

  updateSliderShell(elements.volumeShell, elements.volumeSlider, snapshot.volume);
  renderPlayerButtons(meta, snapshot);

  elements.stagePlaceholder.hidden = hasTrack;
  if (!hasTrack) {
    elements.stagePlaceholderTitle.textContent = state.connected ? 'Search on the left and play a song' : 'Connect Apple Music and choose a song';
    elements.stagePlaceholderCopy.textContent = state.connected
      ? 'The artwork will automatically become the particle image, and the bottom player will stay synced with real playback.'
      : 'Once connected, you can play songs, albums, and playlists through the real Apple Music queue.';
  }

  const nextArtworkUrl = meta.artworkUrl || '';
  if (nextArtworkUrl && (forceArtwork || nextArtworkUrl !== state.currentArtworkUrl)) {
    state.currentArtworkUrl = nextArtworkUrl;
    particleVisualizer.setArtwork(nextArtworkUrl).catch(() => {});
  }
}

function normalizeSongResult(song) {
  const isLibrary = Boolean(song.isLibrary) || isLibraryResourceType(song.type);
  const playbackType = displayTypeFromResourceType(song.type || 'song');
  return {
    id: song.id,
    type: playbackType || 'song',
    queueKey: `${isLibrary ? 'library-' : ''}${playbackType || 'song'}:${song.id}`,
    title: song.name || 'Untitled Song',
    subtitle: song.artistName || 'Unknown Artist',
    supporting: [isLibrary ? 'Library' : 'Catalog', song.albumName || 'Apple Music'].filter(Boolean).join(' · '),
    artworkUrl: resolveArtworkUrl(song),
    url: song.url || '',
    playParams: song.playParams || song.attributes?.playParams || null,
    isLibrary,
  };
}

function normalizeAlbumResult(album) {
  const attributes = album.attributes || {};
  const isLibrary = isLibraryResourceType(album.type);
  const playbackType = displayTypeFromResourceType(album.type || 'album');
  return {
    id: album.id,
    type: playbackType || 'album',
    queueKey: `${isLibrary ? 'library-' : ''}${playbackType || 'album'}:${album.id}`,
    title: attributes.name || 'Untitled Album',
    subtitle: attributes.artistName || 'Apple Music',
    supporting: [isLibrary ? 'Library' : 'Catalog', attributes.trackCount ? `${attributes.trackCount} tracks` : 'Album'].join(' · '),
    artworkUrl: resolveArtworkUrl(album),
    url: attributes.url || '',
    playParams: attributes.playParams || null,
    isLibrary,
    trackCount: attributes.trackCount || 0,
  };
}

function normalizePlaylistResult(playlist) {
  const attributes = playlist.attributes || {};
  const isLibrary = isLibraryResourceType(playlist.type);
  const playbackType = displayTypeFromResourceType(playlist.type || 'playlist');
  return {
    id: playlist.id,
    type: playbackType || 'playlist',
    queueKey: `${isLibrary ? 'library-' : ''}${playbackType || 'playlist'}:${playlist.id}`,
    title: attributes.name || 'Untitled Playlist',
    subtitle: attributes.curatorName || 'Apple Music',
    supporting: [isLibrary ? 'Library' : 'Catalog', readTextValue(attributes.description) || 'Playlist'].join(' · '),
    artworkUrl: resolveArtworkUrl(playlist),
    url: attributes.url || '',
    playParams: attributes.playParams || null,
    isLibrary,
    trackCount: attributes.trackCount || 0,
  };
}

function normalizeCollectionTrackResult(track, index = 0) {
  return {
    id: track.id || `track-${index}`,
    title: track.name || track.attributes?.name || `Track ${index + 1}`,
    subtitle: track.artistName || track.attributes?.artistName || 'Apple Music',
    albumName: track.albumName || track.attributes?.albumName || '',
    durationMs: Number(track.durationMs || track.attributes?.durationInMillis || 0) || 0,
    playParams: track.playParams || track.attributes?.playParams || null,
  };
}

function normalizeSearchResults(data) {
  const songs = Array.isArray(data.songs) ? data.songs.map(normalizeSongResult) : [];
  const albums = Array.isArray(data.albums) ? data.albums.map(normalizeAlbumResult) : [];
  const playlists = Array.isArray(data.playlists) ? data.playlists.map(normalizePlaylistResult) : [];
  return [...songs, ...albums, ...playlists];
}

function renderSearchResults() {
  elements.searchResults.replaceChildren();

  const filtered = state.searchType === 'all'
    ? state.searchResults
    : state.searchResults.filter((item) => item.type === state.searchType);

  if (filtered.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted-copy';
    empty.textContent = state.searchBusy
      ? 'Searching Apple Music...'
      : (state.searchQuery ? 'No matching results found. Try a different keyword.' : 'Songs, albums, and playlists will appear here after you enter a keyword.');
    elements.searchResults.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((item) => {
    const cardFragment = elements.searchTemplate.content.cloneNode(true);
    const card = cardFragment.querySelector('.search-card');
    const artwork = cardFragment.querySelector('.search-artwork');
    const title = cardFragment.querySelector('.search-title');
    const typeBadge = cardFragment.querySelector('.search-type-badge');
    const subtitle = cardFragment.querySelector('.search-subtitle');
    const supporting = cardFragment.querySelector('.search-supporting');
    const detailButton = cardFragment.querySelector('.search-detail-button');
    const playButton = cardFragment.querySelector('.search-play-button');
    const openLink = cardFragment.querySelector('.search-open-link');

    card.classList.toggle('is-active', item.queueKey === state.selectedQueueKey);
    setArtworkImageSource(artwork, item.artworkUrl, item.title);
    title.textContent = item.title;
    typeBadge.textContent = TYPE_LABELS[item.type] || item.type;
    subtitle.textContent = item.subtitle || 'Apple Music';
    supporting.textContent = item.supporting || 'Apple Music';
    if (detailButton) {
      detailButton.hidden = !isCollectionType(item.type);
      detailButton.dataset.queueKey = item.queueKey;
    }
    playButton.dataset.queueKey = item.queueKey;
    playButton.textContent = item.queueKey === state.selectedQueueKey
      ? 'Playing'
      : (isCollectionType(item.type) ? 'Play All' : 'Play');
    openLink.href = item.url || 'https://music.apple.com/';
    openLink.textContent = item.url ? 'Open' : 'Apple Music';

    fragment.appendChild(cardFragment);
  });

  elements.searchResults.appendChild(fragment);
}

async function searchAppleMusic(query) {
  const trimmed = String(query || '').trim();
  state.searchQuery = trimmed;
  syncUrlState();
  clearBrowserDetail();

  if (!trimmed) {
    state.searchResults = [];
    setSearchStatus('Enter a keyword to search with the Apple Music API, then click a result to load it for playback.');
    renderSearchResults();
    return;
  }

  if (state.searchSource === 'library' && !state.connected) {
    setSearchStatus('Library search requires an Apple Music connection first.');
    return;
  }

  const resolvedSearchSource = state.searchSource === 'all' && !state.connected
    ? 'catalog'
    : state.searchSource;

  state.searchBusy = true;
  elements.searchButton.disabled = true;
  setSearchStatus('Searching Apple Music...');
  renderSearchResults();

  try {
    const params = new URLSearchParams({
      term: trimmed,
      storefront: state.storefront || 'us',
      types: 'songs,albums,playlists',
      limit: '6',
      scope: resolvedSearchSource,
    });

    const headers = {};
    if (state.userToken) {
      headers['music-user-token'] = state.userToken;
    }

    const data = await requestJson(`/api/apple-music/search?${params.toString()}`, {
      headers,
    });

    state.searchResults = normalizeSearchResults(data);
    setSearchStatus(
      resolvedSearchSource === state.searchSource
        ? `Found ${state.searchResults.length} results.`
        : `Apple Music is not connected yet, so ${state.searchResults.length} catalog results are shown first.`,
    );
  } catch (error) {
    state.searchResults = [];
    setSearchStatus(error.message || 'Apple Music search failed.');
  } finally {
    state.searchBusy = false;
    elements.searchButton.disabled = false;
    renderSearchResults();
  }
}

async function openCollectionDetail(queueKey) {
  const item = state.searchResults.find((entry) => entry.queueKey === queueKey);
  if (!item || !isCollectionType(item.type)) {
    return;
  }

  state.browserDetail = item;
  state.detailBusy = true;
  state.detailTracks = [];
  renderBrowserDetail();

  try {
    const params = new URLSearchParams({
      storefront: state.storefront || 'us',
      scope: item.isLibrary ? 'library' : 'catalog',
    });
    const headers = {};
    if (state.userToken) {
      headers['music-user-token'] = state.userToken;
    }

    const resourcePath = item.type === 'playlist' ? 'playlists' : 'albums';
    const data = await requestJson(`/api/apple-music/${resourcePath}/${encodeURIComponent(item.id)}/tracks?${params.toString()}`, {
      headers,
    });

    state.browserDetail = {
      ...item,
      title: data.collection?.name || item.title,
      subtitle: data.collection?.artistName || item.subtitle,
      artworkUrl: resolveArtworkUrl(data.collection) || item.artworkUrl,
      playParams: data.collection?.playParams || item.playParams,
      url: data.collection?.url || item.url,
      trackCount: data.collection?.trackCount || item.trackCount || data.tracks?.length || 0,
      supporting: [item.isLibrary ? 'Library' : 'Catalog', `${data.tracks?.length || 0} tracks`].join(' · '),
    };
    state.detailTracks = Array.isArray(data.tracks) ? data.tracks.map(normalizeCollectionTrackResult) : [];
  } catch (error) {
    state.detailTracks = [];
    setStatus(error.message || 'Failed to load track list.');
  } finally {
    state.detailBusy = false;
    renderBrowserDetail();
  }
}

async function playCollectionTrack(index) {
  const detail = state.browserDetail;
  if (!detail || !isCollectionType(detail.type)) {
    return;
  }

  const track = state.detailTracks[index];
  if (!track) {
    return;
  }

  if (!state.connected) {
    setStatus('You need to connect Apple Music before playback can start.');
    await connectAppleMusic();
    if (!state.connected) {
      return;
    }
  }

  try {
    const musicKit = await ensureMusicKit();
    const player = getPlayer();
    setStatus(`Loading: ${track.title}`);
    state.selectedQueueKey = detail.queueKey;
    renderSearchResults();
    await musicKit.setQueue(queueOptionsForItem(detail));

    if (typeof musicKit.changeToMediaAtIndex === 'function') {
      await musicKit.changeToMediaAtIndex(index);
    } else if (typeof player?.changeToMediaAtIndex === 'function') {
      await player.changeToMediaAtIndex(index);
    } else {
      await musicKit.setQueue(queueOptionsForItem({
        type: 'song',
        id: track.id,
        playParams: track.playParams,
      }));
    }

    await musicKit.play();
    syncPlayerUi({ forceArtwork: true, isPlayingOverride: true });
    setStatus(`Now playing: ${track.title}`);
  } catch (error) {
    setStatus(readErrorMessage(error, 'Failed to load the selected track.'));
  }
}

function queueOptionsForItem(item) {
  const queueType = displayTypeFromResourceType(item.playParams?.kind || item.type || 'song') || 'song';
  const prefersLibraryId = Boolean(item.isLibrary) ||
    isLibraryResourceType(item.playParams?.kind) ||
    isLibraryResourceType(item.type) ||
    isLibraryIdentifier(item.playParams?.id) ||
    isLibraryIdentifier(item.id);
  const queueId = prefersLibraryId
    ? (item.playParams?.id || item.id || item.playParams?.catalogId || '')
    : (item.playParams?.catalogId || item.playParams?.id || item.id || '');

  if (queueId) {
    return {
      [queueType]: queueId,
    };
  }

  return item.url ? { url: item.url } : {};
}

function schedulePlaybackRecovery(error) {
  if (state.playbackRecoveryPending) {
    return;
  }

  state.playbackRecoveryPending = true;
  state.playbackRecoveryTimer = window.setTimeout(async () => {
    state.playbackRecoveryTimer = null;

    try {
      const musicKit = state.musicKit || await ensureMusicKit().catch(() => null);
      const player = getPlayer();

      if (!musicKit || !player) {
        return;
      }

      const snapshot = readPlayerSnapshot();
      if (snapshot.isPlaying) {
        return;
      }

      await musicKit.play().catch(() => {});
      setPlaybackUiOverride(true);
      const resumedSnapshot = readPlayerSnapshot();
      if (resumedSnapshot.isPlaying) {
        setStatus('Playback resumed automatically.');
        return;
      }

      const queue = safePlayerRead(() => player.queue || state.musicKit?.queue || null, null);
      const queueItems = Array.isArray(queue?.items) ? queue.items : [];
      const queuePosition = Number(safePlayerRead(() => queue?.position, -1));
      const hasUpcomingItem = queueItems.length > 0 && queuePosition >= 0 && queuePosition < queueItems.length - 1;

      if (hasUpcomingItem && typeof musicKit.skipToNextItem === 'function') {
        await musicKit.skipToNextItem().catch(() => {});
        await musicKit.play().catch(() => {});
        setPlaybackUiOverride(true);

        if (readPlayerSnapshot().isPlaying) {
          setStatus('Skipped the problematic track and continued playback.');
          return;
        }
      }

      setStatus(`Apple Music playback failed: ${describePlaybackError(error)}`);
    } finally {
      state.playbackRecoveryPending = false;
    }
  }, 320);
}

function handleMediaPlaybackError(error) {
  const message = describePlaybackError(error);
  const signature = `${state.currentMeta?.id || 'no-track'}:${message}`;

  if (signature === state.lastPlaybackErrorSignature) {
    return;
  }

  state.lastPlaybackErrorSignature = signature;
  setStatus(
    /^unknown error$/iu.test(message)
      ? 'Apple Music returned an unknown error while auto-advancing. Trying to recover...'
      : `Apple Music playback error: ${message}. Trying to recover...`,
  );
  schedulePlaybackRecovery(error);
}

async function playSearchResult(queueKey) {
  const item = state.searchResults.find((entry) => entry.queueKey === queueKey);
  if (!item) {
    return;
  }

  if (!state.connected) {
    setStatus('You need to connect Apple Music before playback can start.');
    await connectAppleMusic();
    if (!state.connected) {
      return;
    }
  }

  try {
    const musicKit = await ensureMusicKit();
    setStatus(`Loading ${TYPE_LABELS[item.type] || item.type}: ${item.title}`);
    state.selectedQueueKey = item.queueKey;
    renderSearchResults();
    await musicKit.setQueue(queueOptionsForItem(item));
    await musicKit.play();
    syncPlayerUi({ forceArtwork: true, isPlayingOverride: true });
    setStatus(`Now playing: ${item.title}`);
  } catch (error) {
    setStatus(readErrorMessage(error, 'Failed to load the Apple Music queue.'));
  }
}

async function togglePlayback() {
  const snapshot = readPlayerSnapshot();
  if (!snapshot.hasQueue) {
    setStatus('Choose a song, album, or playlist on the left first.');
    return;
  }

  try {
    const musicKit = await ensureMusicKit();
    if (snapshot.isPlaying) {
      await musicKit.pause();
      setPlaybackUiOverride(false);
      syncPlayerUi({ isPlayingOverride: false });
      setStatus('Playback paused.');
    } else {
      await musicKit.play();
      setPlaybackUiOverride(true);
      syncPlayerUi({ isPlayingOverride: true });
      setStatus('Playback resumed.');
    }
  } catch (error) {
    setStatus(readErrorMessage(error, 'Failed to toggle playback state.'));
  }
}

async function skipToNext() {
  try {
    const musicKit = await ensureMusicKit();
    await musicKit.skipToNextItem();
    setStatus('Skipped to the next track.');
  } catch (error) {
    setStatus(error.message || 'Failed to skip to the next track.');
  }
}

async function skipToPrevious() {
  try {
    const musicKit = await ensureMusicKit();
    await musicKit.skipToPreviousItem();
    setStatus('Went back to the previous track.');
  } catch (error) {
    setStatus(error.message || 'Failed to go back to the previous track.');
  }
}

async function toggleShuffleMode() {
  const musicKit = state.musicKit || await ensureMusicKit().catch(() => null);
  const player = getPlayer();
  if (!player) {
    return;
  }

  const nextMode = Number(player.shuffleMode) === SHUFFLE_MODE_SONGS ? SHUFFLE_MODE_OFF : SHUFFLE_MODE_SONGS;
  if (musicKit) {
    state.musicKit.shuffleMode = nextMode;
  }
  player.shuffleMode = nextMode;
  syncPlayerUi();
  setStatus(nextMode === SHUFFLE_MODE_SONGS ? 'Shuffle is on.' : 'Shuffle is off.');
}

async function toggleRepeatMode() {
  const musicKit = state.musicKit || await ensureMusicKit().catch(() => null);
  const player = getPlayer();
  if (!player) {
    return;
  }

  const currentMode = Number(player.repeatMode) || REPEAT_MODE_NONE;
  const nextMode = currentMode === REPEAT_MODE_NONE
    ? REPEAT_MODE_ALL
    : (currentMode === REPEAT_MODE_ALL ? REPEAT_MODE_ONE : REPEAT_MODE_NONE);
  if (musicKit) {
    state.musicKit.repeatMode = nextMode;
  }
  player.repeatMode = nextMode;
  syncPlayerUi();

  if (nextMode === REPEAT_MODE_ALL) {
    setStatus('Repeat all is on.');
  } else if (nextMode === REPEAT_MODE_ONE) {
    setStatus('Repeat one is on.');
  } else {
    setStatus('Repeat is off.');
  }
}

function toggleFavoriteCurrent() {
  const trackId = state.currentMeta?.id;
  if (!trackId) {
    return;
  }

  if (state.favorites.has(trackId)) {
    state.favorites.delete(trackId);
    setStatus('Removed from favorites.');
  } else {
    state.favorites.add(trackId);
    setStatus('Added to favorites.');
  }

  persistFavoriteIds();
  syncPlayerUi();
}

async function seekToSliderPosition() {
  const duration = state.playbackDuration;
  if (!duration) {
    state.isSeeking = false;
    syncPlayerUi();
    return;
  }

  const ratio = Number(elements.progressSlider.value) / 1000;
  const nextTime = clamp(duration * ratio, 0, duration);

  try {
    const musicKit = await ensureMusicKit();
    if (typeof musicKit.seekToTime === 'function') {
      await musicKit.seekToTime(nextTime);
    }
  } catch (error) {
    setStatus(error.message || 'Failed to change playback position.');
  } finally {
    state.isSeeking = false;
    syncPlayerUi();
  }
}

function handleProgressPreview() {
  state.isSeeking = true;
  const ratio = Number(elements.progressSlider.value) / 1000;
  const previewTime = state.playbackDuration * ratio;
  updateSliderShell(elements.progressShell, elements.progressSlider, ratio);
  elements.elapsedTime.textContent = formatTime(previewTime);
  elements.remainingTime.textContent = `-${formatTime(Math.max(0, state.playbackDuration - previewTime))}`;
}

function closePlayerMenu() {
  elements.playerMenu.hidden = true;
}

function openPlayerMenu() {
  elements.playerMenu.hidden = false;
}

function startPollingPlayerState() {
  if (state.pollTimer) {
    window.clearInterval(state.pollTimer);
  }

  state.pollTimer = window.setInterval(() => {
    syncPlayerUi();
  }, 320);
}

function bindEvents() {
  elements.connectButton.addEventListener('click', connectAppleMusic);
  elements.disconnectButton.addEventListener('click', disconnectAppleMusic);

  elements.modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      toggleMode(button.dataset.mode || 'visual');
    });
  });

  elements.searchTypeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.searchType = button.dataset.type || 'all';
      elements.searchTypeButtons.forEach((node) => {
        node.classList.toggle('is-active', node === button);
      });
      renderSearchResults();
    });
  });

  elements.searchSourceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setSearchSource(button.dataset.source || 'catalog');
      if (state.searchQuery) {
        searchAppleMusic(state.searchQuery);
      }
    });
  });

  elements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchAppleMusic(elements.searchInput.value);
  });

  elements.searchResults.addEventListener('click', (event) => {
    const detailButton = event.target.closest('.search-detail-button');
    if (detailButton) {
      openCollectionDetail(detailButton.dataset.queueKey || '');
      return;
    }

    const button = event.target.closest('.search-play-button');
    if (!button) {
      return;
    }

    playSearchResult(button.dataset.queueKey || '');
  });

  elements.detailBackButton.addEventListener('click', clearBrowserDetail);
  elements.detailPlayAllButton.addEventListener('click', () => {
    if (state.browserDetail?.queueKey) {
      playSearchResult(state.browserDetail.queueKey);
    }
  });
  elements.detailTracks.addEventListener('click', (event) => {
    const button = event.target.closest('.detail-track-play-button');
    if (!button) {
      return;
    }

    playCollectionTrack(Number(button.dataset.index || 0));
  });

  elements.storefrontInput.addEventListener('change', () => {
    state.storefront = elements.storefrontInput.value.trim() || 'us';
    persistAppleMusicSession();
    syncUrlState();
    setStatus(`Storefront updated to ${state.storefront}.`);
  });

  const bindVisualRange = (element, key, { rebuild = false } = {}) => {
    element.addEventListener('input', () => {
      state.visualSettings[key] = Number(element.value);
      updateVisualLabels();
      persistVisualSettings();
    });

    if (rebuild) {
      element.addEventListener('change', () => {
        particleVisualizer.rebuildCurrent();
      });
    }
  };

  bindVisualRange(elements.luminanceRange, 'minLuminance', { rebuild: true });
  bindVisualRange(elements.densityRange, 'density', { rebuild: true });
  bindVisualRange(elements.sizeRange, 'size');
  bindVisualRange(elements.diffusionRange, 'diffusion');
  bindVisualRange(elements.baseNoiseRange, 'baseNoise');
  bindVisualRange(elements.motionRange, 'motion');
  bindVisualRange(elements.pauseTimeRange, 'pauseTime');
  bindVisualRange(elements.playTimeRange, 'playTime');
  bindVisualRange(elements.explodeJumpRange, 'explodeJump');
  bindVisualRange(elements.explodeHoldRange, 'explodeHold');
  bindVisualRange(elements.crossfadeRange, 'crossfade');
  bindVisualRange(elements.gatherRange, 'gather');
  bindVisualRange(elements.recoverRange, 'recover');
  bindVisualRange(elements.bridgeDensityRange, 'bridgeDensity');
  bindVisualRange(elements.bridgeIntensityRange, 'bridgeIntensity');

  elements.motionModeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.visualSettings.motionMode = button.dataset.motionMode === 'classic' ? 'classic' : 'waveform-displace';
      applyVisualControls();
      persistVisualSettings();
    });
  });

  elements.glowToggle.addEventListener('change', () => {
    state.visualSettings.glow = elements.glowToggle.checked;
    persistVisualSettings();
  });

  elements.luminanceToggle.addEventListener('change', () => {
    state.visualSettings.manualLuminanceEnable = elements.luminanceToggle.checked;
    persistVisualSettings();
    particleVisualizer.rebuildCurrent();
  });

  elements.toggleSidebarButton.addEventListener('click', toggleSidebarVisibility);
  elements.togglePlayerButton.addEventListener('click', togglePlayerVisibility);
  elements.toolbarCollapseButton.addEventListener('click', toggleToolbarOptionsVisibility);
  elements.fullscreenButton.addEventListener('click', toggleFullscreenMode);

  elements.playToggleButton.addEventListener('click', togglePlayback);
  elements.previousButton.addEventListener('click', skipToPrevious);
  elements.nextButton.addEventListener('click', skipToNext);
  elements.shuffleButton.addEventListener('click', toggleShuffleMode);
  elements.repeatButton.addEventListener('click', toggleRepeatMode);
  elements.favoriteButton.addEventListener('click', toggleFavoriteCurrent);

  elements.menuButton.addEventListener('click', () => {
    if (elements.playerMenu.hidden) {
      openPlayerMenu();
    } else {
      closePlayerMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-wrap')) {
      closePlayerMenu();
    }
  });

  elements.progressSlider.addEventListener('input', handleProgressPreview);
  elements.progressSlider.addEventListener('change', seekToSliderPosition);
  elements.progressSlider.addEventListener('blur', () => {
    state.isSeeking = false;
    syncPlayerUi();
  });

  elements.volumeSlider.addEventListener('input', () => {
    const ratio = Number(elements.volumeSlider.value) / 1000;
    setPlayerVolume(ratio);
  });

  document.addEventListener('fullscreenchange', syncFullscreenState);
  document.addEventListener('webkitfullscreenchange', syncFullscreenState);
}

function initializeUi() {
  applyQueryState();
  consumeAppleMusicConnectedFlag();
  applyVisualControls();
  applyUiVisibility();
  updateStorefrontInput();
  toggleMode(state.mode);
  elements.searchInput.value = state.searchQuery;
  elements.searchTypeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.type === state.searchType);
  });
  applySearchSourceUi();
  updateSliderShell(elements.progressShell, elements.progressSlider, 0);
  updateSliderShell(elements.volumeShell, elements.volumeSlider, state.volume);
  renderSearchResults();
  renderBrowserDetail();
  syncFullscreenState();
  syncUrlState();
  bindEvents();
  startPollingPlayerState();
  renderAppleMusicUi();
  syncPlayerUi({ forceArtwork: true });
}

async function bootstrap() {
  try {
    initializeUi();
  } catch (error) {
    console.error('UI bootstrap failed:', error);
    setStatus(readErrorMessage(error, 'Page initialization failed.'));
  }

  try {
    await initializeAppleMusic();
  } catch (error) {
    console.error('Apple Music bootstrap failed:', error);
  }

  if (state.searchQuery) {
    searchAppleMusic(state.searchQuery);
  }
}

bootstrap();
