<script setup lang="ts">
import { useProjects } from "@/utils";

const { upcomingProjects } = useProjects();
</script>

<template>
  <main class="Page Schedule">
    <template
      v-if="upcomingProjects?.length > 0"
      v-for="project in upcomingProjects"
    >
      <EScheduleEvent :description="project.intro" :path="''">
        <template #title>
          <RouterLink :to="project.route">
            <ETitle
              el="h2"
              size="lg"
              :title="project.title"
              class="projectTitle"
            />
          </RouterLink>
        </template>
        <EventCard
          v-if="project.upcomingEvents"
          v-for="event in project.upcomingEvents"
          layout="horizontal"
          :project-thumbnail="project.thumbnail"
          :event="event"
        />
      </EScheduleEvent>
    </template>
    <section v-else>
      <!-- TODO: Differentiate between data not -->
      <!-- yet loaded and data fetching failed  -->
    </section>
  </main>
</template>

<style scoped>
.Page.Schedule {
  display: grid;
  grid-template-columns: 1fr;
  padding: var(--p-4);
}
.Page.Schedule > section {
  margin-bottom: var(--m-12);
}
.projectTitle {
  margin-bottom: var(--m-6);
}
.EscheduleEvent a {
  color: var(--gray-300);
}
.EscheduleEvent a:hover {
  color: var(--fg);
}
.Page.Schedule > * {
  margin-bottom: var(--m-8);
}
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 600px) {
  .Page.Schedule > * {
    grid-column: 4 / -1;
    margin-bottom: var(--m-16);
  }
}
@media only screen and (min-width: 1000px) {
  .Page.Schedule {
    grid-template-columns: repeat(8, 1fr);
  }
  .Page.Schedule > * {
    grid-column: 4 / -1;
  }
}
</style>
