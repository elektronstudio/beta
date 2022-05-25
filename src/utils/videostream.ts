// TODO: Move to elektro

import { computed, Ref, ref } from "vue";
import { useMessage, safeJsonParse } from "elektro";
import type { Message } from "elektro";
import { config, replaceTokens, split } from ".";

function formatStreamkey(streamkey = "") {
  return streamkey === config.streamTranscodeKeyIn
    ? (config.streamTranscodeKeyOut as string)
    : streamkey;
}

const formatStreamUrl = (streamkey = "") => {
  if (streamkey.endsWith("m3u8")) {
    return streamkey;
  } else if (streamkey === config.streamTranscodeKeyOut) {
    return replaceTokens(config.streamTranscodeUrl as string, {
      streamkey: config.streamTranscodeKeyOut as string,
    });
  } else {
    return replaceTokens(config.streamUrl as string, { streamkey });
  }
};

export const stats = ref([]);

function processStats(stats: any) {
  return stats.map((s: any) => {
    return {
      streamkey: formatStreamkey(s.group),
      viewers: parseFloat(s.count),
    };
  });
}

const statsSync = ref<any>({});

export const statsSynced = computed(() => {
  return stats.value.map((s: any) => {
    const sync =
      s.streamkey === statsSync.value.streamkey ? statsSync.value.sync : 1;
    return {
      streamkey: s.streamkey,
      viewers: Math.max(0, Math.floor(s.viewers * sync)),
    };
  });
});

export function initStats() {
  const { ws } = useMessage();
  ws.addEventListener("message", ({ data }: any) => {
    const message = JSON.parse(data);
    if (message.type === "STATS") {
      stats.value = processStats(message.value);
    }
    if (message.type === "STATS_SYNC") {
      const m = message.value.split(":").map((s) => s.trim());
      statsSync.value = { streamkey: m[0], sync: parseFloat(m[1]) || 1 };
      console.log(statsSync.value);
    }
  });
}

export function processStreamkey(streamkey = "") {
  const streamkeys = split(streamkey);
  return streamkeys.map(formatStreamkey).map((streamkey: string) => {
    const viewers = computed(() => {
      console.log(stats.value[streamkey] || null);
      return stats.value[streamkey] || null;
    });
    return {
      streamkey,
      streamurl: formatStreamUrl(streamkey),
      viewers,
    };
  });
}

// TODO: Move to Elektro

export function usePip(videoRef: Ref<HTMLVideoElement | null>) {
  const isPipAvailable =
    typeof document !== undefined && "pictureInPictureEnabled" in document;
  const isPip = ref(false);
  const enterPip = () => {
    console.log("enter");
    if (isPipAvailable && videoRef?.value) {
      videoRef.value
        .requestPictureInPicture()
        .then(() => (isPip.value = true))
        .catch((e) => console.log(e));
    }
  };
  const exitPip = () => {
    document
      .exitPictureInPicture()
      .then(() => (isPip.value = false))
      .catch((e) => console.log(e));
  };
  return { isPipAvailable, isPip, enterPip, exitPip };
}
