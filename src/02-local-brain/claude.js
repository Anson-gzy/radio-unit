import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createBrainClient } from '../01-external-context/brain/index.js';
import { clampText, runtimeDir } from './context.js';

const DJ_PERSONA_PATH = join(runtimeDir, 'prompts', 'dj-persona.md');
const DEFAULT_SYSTEM_PROMPT = '你是一个中文网络电台主持人。返回自然、克制、有氛围感的短句。';

export function getBrainConfig() {
  try {
    const brain = createBrainClient();
    return {
      provider: brain.provider || process.env.BRAIN_PROVIDER || process.env.MODEL_PROVIDER || 'anthropic',
      model: brain.model || '',
      configured: Boolean(brain.apiKey),
    };
  } catch {
    return {
      provider: process.env.BRAIN_PROVIDER || process.env.MODEL_PROVIDER || 'anthropic',
      model: '',
      configured: false,
    };
  }
}

function readDjPersonaPrompt() {
  if (!existsSync(DJ_PERSONA_PATH)) {
    return DEFAULT_SYSTEM_PROMPT;
  }

  const text = readFileSync(DJ_PERSONA_PATH, 'utf8').trim();
  return text || DEFAULT_SYSTEM_PROMPT;
}

function getTrackDisplayName(track) {
  return [track?.name, track?.artistName].filter(Boolean).join(' - ') || '这首歌';
}

function buildInterludeLabel(currentTrack, nextTrack) {
  return `${currentTrack?.name || '上一首'} -> ${nextTrack?.name || '下一首'}`;
}

function buildFallbackInterludes({ prompt, tracks }) {
  return tracks.slice(0, -1).map((track, index) => {
    const nextTrack = tracks[index + 1];
    const currentName = getTrackDisplayName(track);
    const nextName = getTrackDisplayName(nextTrack);

    return {
      index,
      afterTrackId: String(track?.id || index),
      beforeTrackId: String(nextTrack?.id || index + 1),
      label: buildInterludeLabel(track, nextTrack),
      say: `让 ${currentName} 的尾音先落一会儿，下一首转向 ${nextName}，继续贴着“${prompt}”往前走。`,
      reason: '当前使用本地兜底串场，用相邻两首歌的标题、艺人和主题做自然过渡。',
    };
  });
}

function normalizeInterludeItem(item, index, tracks, fallback) {
  const track = tracks[index];
  const nextTrack = tracks[index + 1];

  if (typeof item === 'string') {
    return {
      ...fallback,
      say: clampText(item, 240) || fallback.say,
    };
  }

  if (!item || typeof item !== 'object') {
    return fallback;
  }

  return {
    index,
    afterTrackId: String(item.afterTrackId || item.after_track_id || track?.id || index),
    beforeTrackId: String(item.beforeTrackId || item.before_track_id || nextTrack?.id || index + 1),
    label: clampText(item.label || buildInterludeLabel(track, nextTrack), 80),
    say: clampText(item.say || item.text || item.copy || item.line, 240) || fallback.say,
    reason: clampText(item.reason || item.why || fallback.reason, 240),
  };
}

function normalizeInterludes(plan, { prompt, tracks }) {
  const fallbackInterludes = buildFallbackInterludes({ prompt, tracks });
  if (fallbackInterludes.length === 0) {
    return [];
  }

  const rawInterludes = [
    plan?.interludes,
    plan?.segments,
    plan?.breaks,
    plan?.transitions,
    plan?.betweenTracks,
    plan?.between_tracks,
  ].find(Array.isArray);

  if (!rawInterludes) {
    return fallbackInterludes;
  }

  return fallbackInterludes.map((fallback, index) => (
    normalizeInterludeItem(rawInterludes[index], index, tracks, fallback)
  ));
}

function buildFallbackCopy({ prompt, tracks }) {
  const title = prompt || '今晚的 Radio';
  return {
    say: `这里是你的最小电台单元，主题是“${title}”。我先替你把气氛铺开，再把歌单慢慢长出来。`,
    segue: `这一轮先用 ${tracks[0]?.name || '示例曲目'} 起头，后面再把节奏往更完整的节目流里推。`,
    reason: '当前使用本地兜底文案，所以即使没有配置外部 API，也能先把交互链路跑通。',
    interludes: buildFallbackInterludes({ prompt: title, tracks }),
  };
}

export async function buildHostCopy({ prompt, tracks, provider, mode }) {
  const fallback = buildFallbackCopy({ prompt, tracks });

  try {
    const brain = createBrainClient();
    const plan = await brain.planRadioTurn({
      context: {
        theme: prompt,
        provider,
        mode,
        candidates: tracks.map((track) => ({
          name: track.name,
          artistName: track.artistName,
          albumName: track.albumName,
        })),
      },
      userInput: [
        `请为一个中文网页电台界面生成一段简洁主持词。主题：${prompt}。`,
        `另外请生成 ${Math.max(tracks.length - 1, 0)} 段“歌与歌之间”的串场词，每段在上一首结束、下一首开始前说。`,
        '串场词要像深夜电台，不要像推荐算法说明；15 到 45 个中文字，克制、有画面感。',
      ].join('\n'),
      system: readDjPersonaPrompt(),
      schemaHint: [
        'Return JSON with keys: say, play, reason, segue, interludes.',
        'interludes must be an array with exactly one item between each adjacent pair of tracks.',
        'Each interlude item must include: say, reason.',
      ].join(' '),
    });

    return {
      say: plan?.say || fallback.say,
      segue: plan?.segue || fallback.segue,
      reason: plan?.reason || '已根据候选曲目生成口播。',
      interludes: normalizeInterludes(plan, { prompt, tracks }),
      mode: 'live',
      warning: '',
    };
  } catch (error) {
    return {
      ...fallback,
      mode: 'fallback',
      warning: error.message,
    };
  }
}
