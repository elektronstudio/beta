// Todo: Move to elektro

import { ref } from "vue";
import { config, replaceTokens, split } from ".";

function formatStreamkey(streamkey = "") {
  return streamkey === config.streamTranscodeKeyIn
    ? (config.streamTranscodeKeyOut as string)
    : streamkey;
}

const formatStreamUrl = (streamkey = "") => {
  if (streamkey.endsWith("m3u8")) {
    return streamkey;
  } else if (streamkey === config.streamTranscodeKeyIn) {
    return replaceTokens(config.streamTranscodeUrl as string, {
      streamkey: config.streamTranscodeKeyOut as string,
    });
  } else {
    return replaceTokens(config.streamUrl as string, { streamkey });
  }
};

export const processStreamkey = (streamkey = "") => {
  const streamkeys = split(streamkey);
  return streamkeys.map(formatStreamkey).map((streamkey: string) => {
    // TODO: Support actual stats
    const viewers = ref(0);
    return {
      streamkey,
      streamurl: formatStreamUrl(streamkey),
      viewers,
    };
  });
};
