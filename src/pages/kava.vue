<script setup lang="ts">
import { useProjects } from "../utils";
import { useRange } from "elektro";

const { upcomingProjects } = useProjects();
console.log(upcomingProjects);

const isUpcoming = (start_at: string, end_at: string) => {
  const { urgency } = useRange(new Date(start_at), new Date(end_at));
  return urgency.value === "future";
};
</script>

<template>
  <main class="Page Projects">
    <template
      v-if="upcomingProjects.length > 0"
      v-for="project in upcomingProjects"
    >
      <EScheduleEvent
        :title="project.title"
        :description="project.intro"
        :path="''"
      >
        <!-- @TODO: Remove this once router is figured out -->
        <ETitle size="lg" :title="project.title" />
        <template v-if="project.events" v-for="event in project.events">
          <EEventInstance
            client:only
            v-if="isUpcoming(event.start_at, event.end_at)"
            :start-at="event.formattedFromDatetime"
            :end-at="event.formattedDistance"
            :ticket-url="event.liveUrl"
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
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 1240px) {
  .Page.Projects {
    grid-template-columns: repeat(8, 1fr);
  }
  .Page.Projects > section {
    grid-column: 4 / -1;
    margin-bottom: var(--m-24);
  }
}
</style>
