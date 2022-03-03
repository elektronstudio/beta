<script setup lang="ts">
import { useRoute } from "vue-router";
import { useEventData } from "../../../../../utils";
type Props = {
  project_slug: string;
  event_slug: string;
};
const { project_slug, event_slug } = defineProps<Props>();
//const { data } = await useEventData(params.event_slug);
</script>

<template>
  <pre>Live event</pre>
  <pre>{{ project_slug }}</pre>
  <pre>{{ event_slug }}</pre>
</template>
