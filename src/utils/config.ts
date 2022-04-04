export const config = {
  strapiUrl: import.meta.env.VITE_STRAPI_URL || "",
  strapiV4Url: import.meta.env.VITE_STRAPI_V4_URL || "",
  liveUrl: import.meta.env.VITE_LIVE_URL || "",
  fientaUrl: import.meta.env.VITE_FIENTA_URL || "",
  fientaToken: import.meta.env.VITE_FIENTA_TOKEN || "",
  fientaTicketUrl: import.meta.env.VITE_FIENTA_TICKET_URL || "",
  streamUrl: import.meta.env.VITE_STREAM_URL || "",
  streamTranscodeUrl: import.meta.env.VITE_STREAM_TRANSCODE_URL || "",
  streamTranscodeKeyIn: import.meta.env.VITE_STREAM_TRANSCODE_KEY_IN || "",
  streamTranscodeKeyOut: import.meta.env.VITE_STREAM_TRANSCODE_KEY_OUT || "",
  podcastRssUrl: import.meta.env.VITE_PODCAST_RSS_URL || "",
};
