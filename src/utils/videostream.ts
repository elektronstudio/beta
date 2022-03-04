// Todo: Move to elektro

import { config, replaceTokens, split } from ".";

const formatStreamkey = (streamkey = "") => {
  return streamkey === config.streamTranscodeKeyIn
    ? config.streamTranscodeKeyOut
    : streamkey;
};

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
  const streamurls = streamkeys.map(formatStreamUrl);
  return { streamkeys: streamkeys.map(formatStreamkey), streamurls };
};
