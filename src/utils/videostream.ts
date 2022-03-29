// TODO: Move to elektro

import { Ref, ref } from "vue";
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

// TODO: Move to Elektro
// TODO: Add SSR check with typeof document !== 'undefined'

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
