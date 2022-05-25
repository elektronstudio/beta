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

export const stats = ref<any>({});
const statsSync = ref<any>({});

function processStats(stats: any) {
  return Object.fromEntries(
    stats.map((s: any) => {
      const key = formatStreamkey(s.group);
      const sync = statsSync && statsSync[key] ? parseFloat(statsSync[key]) : 1;
      return [key, parseFloat(s.count) * sync];
    }),
  );
}

export function initStats() {
  const { ws } = useMessage();
  ws.addEventListener("message", ({ data }: any) => {
    const message = JSON.parse(data);
    if (message.type === "STATS_SYNC") {
      statsSync.value = message.value;
    }
    if (message.type === "STATS") {
      stats.value = processStats(message.value);
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
