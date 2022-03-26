<script setup lang="ts">
import { Draggable } from "elektro";
import { useEventBySlug } from "@/utils";
import { computed } from "vue";
import LiveView from "../../../../components/LiveView.vue";

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
          tilesHeight: 6,
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
          tilesHeight: 3,
          gridPosX: 1,
          gridPosY: 5,
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
  <LiveView v-if="data" :data="data" :event="event" />
</template>
