<script setup lang="ts">
import Videostream from "./Videostream.vue";
import Chat from "./Chat.vue";
import IconArrowLeft from "~icons/radix-icons/arrow-left";

export type ContentType = "chat" | "text" | "image" | "video" | "event";

type Props = {
  contentType: ContentType;
  data: any;
};

const { contentType } = defineProps<Props>();
</script>
<template>
  <Chat v-if="contentType === 'chat'" :channel="data.channel" />
  <Videostream v-else-if="contentType === 'video'" :src="data.src" />
  <EStack v-else-if="contentType === 'event'" style="padding: var(--p-5)">
    <!-- TODO Reuse existing back button UI -->
    <template v-if="data.event">
      <RouterLink :to="data.event.route">
        <EButton size="xs" color="transparent" el="a">
          <IconArrowLeft />
          Back to event
        </EButton>
      </RouterLink>
      <ETitle size="lg">Live event: {{ data.event.title }}</ETitle>
      <EContent v-html="data.event.intro" />
    </template>
    <!-- TODO What about event.description? -->
  </EStack>
</template>
