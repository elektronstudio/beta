<script setup lang="ts">
import { Draggable } from "elektro";
import { useEventBySlug } from "@/utils";
import { computed } from "vue";
import LiveView from "../../../../components/LiveView.vue";
import IconArrowLeft from "~icons/radix-icons/arrow-left";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);

// TODO: support multiple videos
const stream = computed(() => event?.value?.videostreams[0]);
const data = computed(() =>
  event.value
    ? ([
        {
          title: "Stream",
          draggableId: "videosteam",
          contentType: "video",
          gridPosX: 2,
          gridPosY: 1,
          tilesWidth: 12,
          isMinimised: false,
          order: 0,
          data: {
            src: stream?.value?.streamurl,
          },
        },
        {
          title: "Chat",
          draggableId: "chat",
          contentType: "chat",
          gridPosX: 15,
          gridPosY: 1,
          tilesWidth: 4,
          tilesHeight: 8,
          order: 1,
          data: {
            channel: event_slug,
          },
        },
        {
          title: "About",
          draggableId: "about",
          contentType: "event",
          tilesWidth: 8,
          tilesHeight: 5,
          gridPosX: 1,
          gridPosY: 4,
          order: 2,
          data: {
            event: event,
          },
        },
      ] as Draggable[])
    : null,
);
</script>

<template>
  <RouterLink v-if="event" :to="event.route" class="eventNav">
    <EButton size="xs" color="transparent" el="a">
      <IconArrowLeft />
      Back to event
    </EButton>
  </RouterLink>
  <LiveView v-if="data" :data="data" />
</template>

<style scoped>
.eventNav {
  position: fixed;
  top: var(--p-2);
  left: var(--p-2);
  z-index: 1000;
}
</style>
