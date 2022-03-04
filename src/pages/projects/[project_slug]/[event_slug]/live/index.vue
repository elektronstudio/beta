<script setup lang="ts">
import { useEventBySlug } from "@/utils";
import { useChat, useVideostream } from "elektro";
import { computed, ref } from "vue";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);

// TODO: support multiple videos
// TODO: add event.streamkeys[0] viewer stats
const url = computed(() => event?.value.streamurls[0]);
const { videoRef, width, height, status: _status } = useVideostream(url);

const {
  chatMessages,
  newChatMessage,
  onNewChatMessage,
  scrollRef,
  textareaRef,
} = useChat(event?.value.slug);
</script>

<template>
  <div v-if="event" class="Live">
    <div>
      <RouterLink :to="event.route">&larr; Back to event</RouterLink>
      <!-- TODO: separate component -->
      <video
        ref="videoRef"
        muted
        autoplay
        controls
        :width="width"
        :height="height"
        style="width: 100%"
      />
      <ETitle size="lg">Live event: {{ event.title }}</ETitle>
      <EContent v-html="event.intro" />
    </div>
    <div>
      <div ref="scrollRef" class="messages">
        <EBox v-for="message in chatMessages">
          <pre>{{ message }}</pre>
        </EBox>
      </div>
      <EFormTextArea v-model="newChatMessage" />
      <EButton size="xs" @click="onNewChatMessage">Submit</EButton>
    </div>
  </div>
</template>

<style scoped>
.Live {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--gap-5);
  padding: var(--p-5);
}
.Live > * {
  display: grid;
  grid-auto-rows: min-content;
  gap: var(--gap-5);
}
.messages {
  height: 60vh;
  display: grid;
  gap: var(--gap-4);
  overflow: auto;
}
</style>
