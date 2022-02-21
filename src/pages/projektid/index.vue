<script setup lang="ts">
import { useProjects } from "../../utils";
import { formatDatetime } from "elektro";
import { computed } from "vue";

const { projects } = useProjects();
const upcomingProjects = computed(() =>
  projects.value.filter((project: any) => !project.archived),
);
const archivedProjects = computed(() =>
  projects.value.filter((project: any) => project.archived),
);
</script>

<template>
  <div class="Page">
    <ETitle size="lg" v-if="upcomingProjects.length > 0">Projektid</ETitle>
    <br />
    <div
      v-if="upcomingProjects.length > 0"
      style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--gap-4);
      "
    >
      <template v-for="project in projects">
        <router-link
          v-if="!project.archived"
          :to="'/projektid/' + project.slug"
        >
          <EProductionCard
            :title="project.title"
            :thumbnail="project.images[0]?.url"
            :next-event="
              project.events[0] && {
                startAt: formatDatetime(new Date(project.events[0]?.start_at)),
                endAt: formatDatetime(new Date(project.events[0]?.end_at)),
              }
            "
          />
        </router-link>
      </template>
    </div>
    <ETitle size="lg" v-if="archivedProjects.length > 0">Arhiiv</ETitle>
    <br />

    <div
      v-if="archivedProjects.length > 0"
      style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--gap-4);
      "
    >
      <template v-for="project in projects">
        <router-link
          v-if="!project.archived"
          :to="'/projektid/' + project.slug"
        >
          <EProductionCard
            :title="project.title"
            :thumbnail="project.images[0]?.url"
            :next-event="
              project.events[0] && {
                startAt: formatDatetime(new Date(project.events[0]?.start_at)),
                endAt: formatDatetime(new Date(project.events[0]?.end_at)),
              }
            "
          />
        </router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
.Page {
  padding: var(--p-5);
}
</style>
