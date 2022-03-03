<script setup lang="ts">
import { useEventBySlug } from "@/utils";
import { watchEffect } from "vue";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { project_slug, event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);
</script>

<template>
  <pre>Event</pre>
  <pre>{{ project_slug }} / {{ event_slug }}</pre>
  <pre>{{ event }}</pre>
</template>
