<script setup lang="ts">
import { useProjectBySlug } from "@/utils";

type Props = {
  project_slug: string;
};
const { project_slug } = defineProps<Props>();
const project: any = useProjectBySlug(project_slug);
</script>

<template>
  <pre>Project {{ project_slug }}</pre>
  <RouterLink v-for="e in project.events" :to="/">Link</RouterLink>
  <pre>{{ project }}</pre>
</template>
