const loginStatusNode = document.querySelector('#login-status');
const loginDetailNode = document.querySelector('#login-detail');
const retryButton = document.querySelector('#retry-button');
const returnLink = document.querySelector('#return-link');

const APPLE_USER_TOKEN_STORAGE_KEY = 'radio.appleMusicUserToken';
const APPLE_STOREFRONT_STORAGE_KEY = 'radio.appleMusicStorefront';
const APPLE_AUTOCONNECT_DISABLED_KEY = 'radio.appleMusicAutoConnectDisabled';

const loginState = {
  config: null,
  musicKit: null,
  musicKitPromise: null,
  busy: false,
};

function setStatus(text, tone = 'default') {
  loginStatusNode.textContent = text;
  loginStatusNode.className = 'auth-state-pill';

  if (tone === 'connected') {
    loginStatusNode.classList.add('is-connected');
  }
  if (tone === 'warning') {
    loginStatusNode.classList.add('is-warning');
  }
}

function setDetail(text) {
  loginDetailNode.textContent = text;
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
  return fetch(url, options)
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
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
  timeoutMs = 30_000,
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

  throw new Error('Apple Music 账号已完成登录，但网页没有收到授权回传。更像是 Safari 弹窗回调卡住了，不是服务器 identity 接口失败。');
}

function loadMusicKitScript() {
  if (window.MusicKit) {
    return Promise.resolve(window.MusicKit);
  }

  if (loginState.musicKitPromise) {
    return loginState.musicKitPromise;
  }

  loginState.musicKitPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="musickit.js"]');

    function handleReady() {
      if (window.MusicKit) {
        resolve(window.MusicKit);
      } else {
        reject(new Error('MusicKit JS 已加载，但全局对象不可用。'));
      }
    }

    window.addEventListener('musickitloaded', handleReady, { once: true });

    if (existingScript) {
      existingScript.addEventListener('error', () => reject(new Error('MusicKit JS 加载失败。')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js-cdn.music.apple.com/musickit/v1/musickit.js';
    script.async = true;
    script.addEventListener('load', handleReady, { once: true });
    script.addEventListener('error', () => reject(new Error('MusicKit JS 加载失败。')), { once: true });
    document.head.appendChild(script);
  });

  return loginState.musicKitPromise;
}

async function fetchAppleMusicConfig() {
  const data = await requestJson('/api/apple-music/config');
  loginState.config = data;
  return data;
}

async function ensureMusicKit() {
  const config = loginState.config || await fetchAppleMusicConfig();

  if (!config.enabled) {
    throw new Error(config.error || 'Apple Music 还没有准备好。');
  }

  if (hasOriginMismatch(config.origin)) {
    throw new Error(`当前页面是 ${window.location.origin}，但 token origin 配置为 ${config.origin}。`);
  }

  await loadMusicKitScript();

  if (!window.MusicKit || typeof window.MusicKit.configure !== 'function') {
    throw new Error('MusicKit JS 未正常初始化。');
  }

  if (!loginState.musicKit) {
    const configuredMusicKit = await window.MusicKit.configure({
      developerToken: config.developerToken,
      app: config.app,
    });
    loginState.musicKit = configuredMusicKit ||
      (typeof window.MusicKit.getInstance === 'function' ? window.MusicKit.getInstance() : null);
  }

  if (!loginState.musicKit) {
    throw new Error('MusicKit JS 已加载，但没有返回可用的授权实例。');
  }

  return loginState.musicKit;
}

function persistSession(userToken, storefront) {
  if (userToken) {
    localStorage.setItem(APPLE_USER_TOKEN_STORAGE_KEY, userToken);
  }

  if (storefront) {
    localStorage.setItem(APPLE_STOREFRONT_STORAGE_KEY, storefront);
  }

  sessionStorage.removeItem(APPLE_AUTOCONNECT_DISABLED_KEY);
}

function buildReturnUrl() {
  const params = new URLSearchParams(window.location.search);
  const rawReturnTo = params.get('returnTo');
  const fallback = new URL('./', window.location.href);
  fallback.searchParams.set('provider', 'apple-music');

  if (!rawReturnTo) {
    return fallback;
  }

  try {
    const url = new URL(rawReturnTo, window.location.origin);
    if (url.origin !== window.location.origin) {
      return fallback;
    }
    return url;
  } catch {
    return fallback;
  }
}

async function fetchIdentity(userToken) {
  const data = await requestJson('/api/apple-music/identity', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      musicUserToken: userToken,
    }),
  });

  return data.identity || null;
}

function redirectBack(identity) {
  const nextUrl = buildReturnUrl();
  nextUrl.searchParams.delete('autoconnect');
  nextUrl.searchParams.set('provider', 'apple-music');
  nextUrl.searchParams.set('appleMusicConnected', '1');

  const storefront = identity?.storefrontId || loginState.musicKit?.storefrontId || '';
  if (storefront) {
    nextUrl.searchParams.set('storefront', storefront);
  }

  window.location.replace(nextUrl.toString());
}

async function authorizeAndReturn({ autoStarted = false } = {}) {
  if (loginState.busy) {
    return;
  }

  loginState.busy = true;
  retryButton.hidden = true;
  retryButton.disabled = true;

  try {
    setStatus('正在发起 Apple Music 授权', 'default');
    setDetail(autoStarted
      ? '如果浏览器没有继续，请点下方按钮手动完成这一步。'
      : '请在 Apple Music 授权窗口里完成登录。若 Apple 页面已经通过，这里也会自动轮询 token 继续。');

    const musicKit = await ensureMusicKit();
    const userToken = readMusicUserToken(musicKit) || await withTimeout(
      resolveAuthorizedUserToken(musicKit),
      35_000,
      'Apple Music 授权窗口没有正常完成回传。请检查 Safari 内容拦截、跨站跟踪设置或当前网络。',
    );

    if (!userToken) {
      throw new Error('Apple Music 没有返回有效的 musicUserToken。');
    }

    const storefront = musicKit.storefrontId || loginState.config?.storefront || '';
    persistSession(userToken, storefront);

    let identity = null;
    try {
      identity = await fetchIdentity(userToken);
      if (identity?.storefrontId) {
        localStorage.setItem(APPLE_STOREFRONT_STORAGE_KEY, identity.storefrontId);
      }
    } catch {
      identity = null;
    }

    setStatus('关联成功', 'connected');
    setDetail('已拿到 musicUserToken，正在回到 Sonic Particles。');
    window.setTimeout(() => redirectBack(identity), 450);
  } catch (error) {
    setStatus('等待继续', 'warning');
    setDetail(error.message || 'Apple Music 授权失败，请再试一次。');
    retryButton.hidden = false;
    retryButton.disabled = false;
  } finally {
    loginState.busy = false;
  }
}

async function initialize() {
  const returnUrl = buildReturnUrl();
  returnLink.href = returnUrl.toString();

  setStatus('检查 Apple Music 配置中', 'default');
  setDetail('正在确认服务端 developer token 与当前 origin 是否匹配。');

  try {
    await fetchAppleMusicConfig();
    await ensureMusicKit();
    setStatus('准备好了', 'default');
    setDetail('点击“继续关联 Apple Music”后，会拉起 Apple Music 授权并在成功后回到 Sonic Particles。');
    retryButton.hidden = false;
    retryButton.disabled = false;
  } catch (error) {
    setStatus('Apple Music 未就绪', 'warning');
    setDetail(error.message || '当前还不能发起 Apple Music 授权。');
    retryButton.hidden = false;
    retryButton.disabled = false;
  }
}

retryButton.addEventListener('click', () => {
  authorizeAndReturn({ autoStarted: false });
});

initialize();
