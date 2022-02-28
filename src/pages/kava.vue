<script setup lang="ts">
import { useProjects } from "../utils";

const { upcomingProjects } = useProjects();
</script>

<template>
  <main class="Page Projects">
    <template
      v-if="upcomingProjects && upcomingProjects.length > 0"
      v-for="project in upcomingProjects"
    >
      <EScheduleEvent :description="project.description_intro" :path="''">
        <!-- @TODO: Remove this once router is figured out -->
        <template #title>
          <RouterLink :to="`/projektid/${project.slug}`">
            <ETitle size="lg" :title="project.title" />
          </RouterLink>
        </template>
        <template
          v-if="project.upcomingEvents"
          v-for="event in project.upcomingEvents"
        >
          <EEventInstance
            :start-at="event.formattedFromDatetime"
            :end-at="event.formattedDistance"
            :ticket-url="event.ticketUrl"
          />
        </template>
      </EScheduleEvent>
    </template>
    <section v-else>
      <ETitle>Tulevaid sündmusi ei leitud</ETitle>
    </section>
  </main>
</template>

<style scoped>
.Page.Projects {
  display: grid;
  grid-template-columns: 1fr;
  padding: var(--p-4);
}
.Page.Projects > section {
  margin-bottom: var(--m-12);
}

.EscheduleEvent .ETitle {
  margin-bottom: var(--m-6);
}
.EscheduleEvent a {
  color: var(--gray-300);
}
.EscheduleEvent a:hover {
  color: var(--fg);
}
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 600px) {
  .Page.Projects {
    grid-template-columns: repeat(8, 1fr);
  }
  .Page.Projects > section {
    grid-column: 4 / -1;
    margin-bottom: var(--m-24);
  }
}
</style>
