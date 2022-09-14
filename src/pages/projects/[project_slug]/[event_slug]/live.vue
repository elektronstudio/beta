<script setup lang="ts">
import { Draggable } from "elektro";
import { useEventBySlug, useUpdatingEventBySlug } from "@/utils";
import { computed, watchEffect } from "vue";
import LiveView from "../../../../components/LiveView.vue";

type Props = {
  project_slug: string;
  event_slug: string;
};

const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);

// TODO: support multiple videos
const stream = computed(() => {
  console.log(event?.value);
  return event?.value?.videostreams?.[0];
});
const data = computed(() => {
  if (!event.value) {
    return null;
  }
  const d = [
    {
      title: "Stream",
      draggableId: "videosteam",
      contentType: "video",
      gridPosX: 0,
      gridPosY: 1,
      tilesWidth: 15,
      isMinimised: false,
      isMaximised: false,
      isMaximisable: true,
      hideTitleBarOnIdle: true,
      order: 0,
      data: {
        streamurl: stream?.value?.streamurl,
        streamkey: stream?.value?.streamkey,
        viewers: stream?.value?.viewers,
      },
    },
    {
      title: "Chat",
      draggableId: "chat",
      contentType: "chat",
      gridPosX: 16,
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
      tilesHeight: 4,
      gridPosX: 2,
      gridPosY: 7,
      order: 2,
      data: {
        event: event,
      },
    },
  ];
  if (event.value.controls) {
    d.push({
      title: "Controls",
      draggableId: "controls",
      contentType: "controls",
      tilesWidth: 9,
      tilesHeight: 3,
      gridPosX: 9,
      gridPosY: 3,
      order: 3,
      data: {
        event: event,
      },
    });
  }
  return d;
});
</script>

<template>
  <LiveView v-if="data" :data="data" :event="event" />
</template>
