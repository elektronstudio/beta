<script setup lang="ts">
import { config, replaceTokens } from "../utils";

const liveUrl2 = replaceTokens(config.liveUrl as string, {
  projectSlug: "project1",
  eventSlug: "event1",
});

const fientaTicketUrl2 = replaceTokens(config.fientaTicketUrl as string, {
  fientaId: "1234",
});

const d = {
  "VITE_LIVE_URL         ": import.meta.env.VITE_LIVE_URL,
  "liveUrl               ": config.liveUrl,
  "liveUrl2              ": liveUrl2,
  VITE_FIENTA_TICKET_URL: import.meta.env.VITE_FIENTA_TICKET_URL,
  "fientaTicketUrl       ": config.fientaTicketUrl,
  "fientaTicketUrl2      ": fientaTicketUrl2,
};
</script>
<template>
  <pre>{{ d }}</pre>
</template>
