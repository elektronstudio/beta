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
  <pre>Live event</pre>
  <pre>{{ event }}</pre>
</template>
