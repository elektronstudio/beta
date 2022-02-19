<script setup lang="ts">
import { useProjects } from "../../utils";

const { projects } = useProjects();
</script>

<template>
  <div class="Page">
    <ETitle size="lg">Projektid</ETitle>
    <br />
    <div
      v-if="projects"
      style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--gap-4);
      "
    >
      <router-link
        v-for="project in projects"
        :to="'/projektid/' + project.slug"
      >
        <EProductionCard
          :title="project.title"
          :thumbnail="project.images[0]?.url"
        />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.Page {
  padding: var(--p-5);
}
</style>
