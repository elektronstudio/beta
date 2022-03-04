<script setup lang="ts">
import { useProjectBySlug } from "@/utils";

type Props = {
  project_slug: string;
};
const { project_slug } = defineProps<Props>();
const project = useProjectBySlug(project_slug);
</script>

<template>
  <EStack v-if="project" style="padding: var(--p-5)">
    <ETitle size="lg">Project: {{ project.title }}</ETitle>
    <EContent v-html="project.intro" />
    <RouterLink :to="event.route" v-for="event in project.events">
      <EBox>
        <ETitle>{{ event.title }}</ETitle>
        <EContent v-html="event.intro" />
      </EBox>
    </RouterLink>
  </EStack>
</template>
