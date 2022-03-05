<script setup lang="ts">
import { useEventBySlug } from "@/utils";
import { useChat } from "elektro";
import { computed, ref } from "vue";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);

// TODO: support multiple videos
const stream = computed(() => event?.value.videostreams[0]);
</script>

<template>
  <div v-if="event" class="Live">
    <RouterLink :to="event.route">&larr; Back to event</RouterLink>
    <Videostream :src="stream.streamurl">
      <div>Viewers: {{ stream.viewers }}</div>
    </Videostream>
    <ETitle size="lg">Live event: {{ event.title }}</ETitle>
    <EContent v-html="event.intro" />
    <Chat :channel="event_slug" />
  </div>
</template>

<style scoped>
.Live {
  display: grid;
  gap: var(--gap-5);
  padding: var(--p-5);
}
</style>
