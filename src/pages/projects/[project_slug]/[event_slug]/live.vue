<script setup lang="ts">
import { computed } from "vue";
import IconArrowLeft from "~icons/radix-icons/arrow-left";
import { useEventBySlug } from "@/utils";

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
  <EBreadBoard v-if="event" class="Live">
    <EDraggable
      title="Video"
      draggable-id="videosteam"
      :tiles-width="12"
      :tiles-height="7"
      :grid-pos-x="2"
      :grid-pos-y="1"
      :is-minimised="false"
      :order="0"
    >
      <Videostream :src="stream.streamurl">
        <!-- <div>Viewers: {{ stream.viewers }}</div> -->
      </Videostream>
    </EDraggable>
    <EDraggable
      title="Chat"
      draggable-id="chat"
      :tiles-width="4"
      :tiles-height="8"
      :grid-pos-x="15"
      :grid-pos-y="1"
      :order="1"
    >
      <Chat :channel="event_slug" />
    </EDraggable>
    <EDraggable
      title="About"
      draggable-id="videosteam"
      :tiles-width="6"
      :tiles-height="4"
      :grid-pos-x="1"
      :grid-pos-y="4"
      content-type="video"
      :order="2"
    >
      <EStack style="padding: var(--p-5)">
        <!-- TODO Reuse existing back button UI -->
        <RouterLink :to="event.route">
          <EButton size="xs" color="transparent" el="a">
            <IconArrowLeft />
            Back to event
          </EButton>
        </RouterLink>
        <ETitle size="lg">Live event: {{ event.title }}</ETitle>
        <EContent v-html="event.intro" />
        <!-- TODO What about event.description? -->
      </EStack>
    </EDraggable>
  </EBreadBoard>
</template>
