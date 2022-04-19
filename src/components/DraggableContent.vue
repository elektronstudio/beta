<script setup lang="ts">
import Videostream from "./Videostream.vue";
import { useStorage } from "@vueuse/core";
import { randomString } from "elektro";
import { randomName } from "@/utils";

export type ContentType = "chat" | "text" | "image" | "video" | "event";

type Props = {
  contentType: ContentType;
  data: any;
};

const { contentType, data } = defineProps<Props>();
const userId = useStorage("elektron_user_id", randomString());
const userName = useStorage("elektron_user_name", randomName());
</script>
<template>
  <!-- Chat draggable -->
  <EChat
    v-if="contentType === 'chat'"
    :channel="data.channel"
    :userId="userId"
    :userName="userName"
  />

  <!-- Video draggable -->
  <Videostream v-else-if="data && contentType === 'video'" :src="data.src" />

  <!-- Event draggable -->
  <EStack
    v-else-if="data && contentType === 'event'"
    style="padding: var(--p-5)"
  >
    <!-- TODO Reuse existing back button UI -->
    <template v-if="data.event">
      <ETitle size="lg">Live event: {{ data.event.title }}</ETitle>
      <EContent v-html="data.event.intro" />
    </template>
    <!-- TODO What about event.description? -->
  </EStack>
</template>
