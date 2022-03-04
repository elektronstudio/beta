<script setup lang="ts">
import { useProjectBySlug } from "@/utils";

type Props = {
  project_slug: string;
};
const { project_slug } = defineProps<Props>();
const project = useProjectBySlug(project_slug);
</script>

<template>
  <pre>Project {{ project_slug }}</pre>
  <pre>{{ project?.events }}</pre>
</template>
