export const config = {
  strapiUrl: import.meta.env.VITE_STRAPI_URL || "",
  // @TODO: remove hardcoded variable
  strapiV4Url:
    import.meta.env.VITE_STRAPI_V4_URL || "https://strapi-v4-ee9v.onrender.com",
  liveUrl: import.meta.env.VITE_LIVE_URL || "",
  fientaTicketUrl: import.meta.env.VITE_FIENTA_TICKET_URL || "",
};
