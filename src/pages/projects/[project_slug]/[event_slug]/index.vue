<script setup lang="ts">
import { useEventBySlug } from "@/utils";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);
</script>

<template>
  <EStack v-if="event" style="padding: var(--p-5)">
    <ETitle size="lg">Event: {{ event.title }}</ETitle>
    <RouterLink :to="event.liveRoute"><EBox>Watch live</EBox></RouterLink>
  </EStack>
</template>
