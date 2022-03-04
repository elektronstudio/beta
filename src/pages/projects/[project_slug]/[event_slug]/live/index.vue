<script setup lang="ts">
import { useEventBySlug } from "@/utils";
import { useVideostream } from "elektro";
import { computed, ref } from "vue";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);

// TODO: support multiple videos
const url = computed(() => event?.value.streamurls[0]);
const { videoRef, width, height, status: _status } = useVideostream(url);

// TODO: add event.streamkeys[0] viewer stats
</script>

<template>
  <EStack v-if="event" style="padding: var(--p-5)">
    <RouterLink :to="event.route"><EBox>Back to event</EBox></RouterLink>
    <ETitle size="lg">Live event: {{ event.title }}</ETitle>
    <video
      ref="videoRef"
      muted
      autoplay
      controls
      :width="width"
      :height="height"
    />
    <EContent v-html="event.intro" />
  </EStack>
</template>
