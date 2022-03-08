<script setup lang="ts">
import { useProjects, l } from "@/utils";
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
    <ETitle size="lg" v-if="upcomingProjects.length > 0">{{
      l("Projects", "Projektid")
    }}</ETitle>
    <br />
    <div v-if="upcomingProjects.length > 0" class="projects">
      <template v-for="project in projects">
        <router-link v-if="!project.archived" :to="'/projects/' + project.slug">
          <EProductionCard
            :title="project.title"
            :thumbnail="
              project.images[0]
                ? {
                    sizes: Object.values(project.images[0].formats),
                    alt: project.images[0].alternativeText,
                  }
                : undefined
            "
            :next-event="
              project.upcomingEvents && {
                startAt: project.upcomingEvents[0].formattedFromDatetime,
              }
            "
          />
        </router-link>
      </template>
    </div>
    <ETitle size="lg" v-if="archivedProjects.length > 0">Arhiiv</ETitle>
    <br />

    <div v-if="archivedProjects.length > 0" class="projects">
      <template v-for="project in projects">
        <router-link
          v-if="!project.archived"
          :to="'/projektid/' + project.slug"
        >
          <EProductionCard
            :title="project.title"
            :thumbnail="project.images[0]?.url"
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

.projects {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-4);
}
@media only screen and (min-width: 600px) {
  .projects {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media only screen and (min-width: 1000px) {
  .projects {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
