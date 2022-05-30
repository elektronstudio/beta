<script setup lang="ts">
import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { randomString, newMessages } from "elektro";
import { randomName, l, userId, userName } from "@/utils";
import Videostream from "./Videostream.vue";

export type ContentType = "chat" | "text" | "image" | "video" | "event";

type Props = {
  contentType: ContentType;
  data: any;
};

const { contentType, data } = defineProps<Props>();
const newMessagesString = computed(() => {
  if (newMessages.value > 1) {
    return l("new messages", "uut sõnumit");
  } else {
    return l("new message", "uus sõnum");
  }
});
</script>
<template>
  <!-- Chat draggable -->
  <EChat
    v-if="contentType === 'chat'"
    :channel="data.channel"
    :userId="userId"
    :userName="userName"
    :new-messages-string="newMessagesString"
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
