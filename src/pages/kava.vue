<script setup lang="ts">
import { useProjects } from "../utils";

const { upcomingProjects } = useProjects();
</script>

<template>
  <EStack class="Page">
    <template v-for="project in upcomingProjects">
      <ETitle size="lg" v-html="project.title" />
      <EContent v-html="project.intro" />
      <template v-for="event in project.upcomingEvents">
        <ETitle v-html="event.title" />
        <p>{{ event.formattedFromDatetime }} / {{ event.formattedDistance }}</p>
      </template>
    </template>
  </EStack>
</template>

<style scoped>
.Page {
  padding: var(--p-5);
}
</style>
