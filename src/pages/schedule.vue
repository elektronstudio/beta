<script setup lang="ts">
import IconArrowRight from "~icons/radix-icons/arrow-right";
import { useProjects, l } from "@/utils";

const { upcomingProjects } = useProjects();
</script>

<template>
  <main class="Page Projects">
    <template
      v-if="upcomingProjects?.length > 0"
      v-for="project in upcomingProjects"
    >
      <EScheduleEvent :description="project.intro" :path="''">
        <!-- @TODO: Remove this once router is figured out -->
        <template #title>
          <RouterLink :to="project.route">
            <ETitle size="lg" :title="project.title" class="projectTitle" />
          </RouterLink>
        </template>
        <template
          v-if="project.upcomingEvents"
          v-for="instance in project.upcomingEvents"
        >
          <EEventInstance
            :start-at="instance.formattedFromDatetime"
            :end-at="instance.formattedDistance"
            :ticket-url="instance.ticketUrl"
          >
            <template #title>
              <router-link :to="`/projektid/${project.slug}/${instance.slug}`">
                <ETitle el="h4" size="xs" class="eventTitle">{{
                  instance.title
                }}</ETitle>
              </router-link>
            </template>
            <template #buttons>
              <router-link :to="`/projektid/${project.slug}/${instance.slug}`">
                <EButton size="xs" el="a" color="transparent">
                  <IconArrowRight />
                  {{ l("Read more", "Loe lähemalt") }}
                </EButton>
              </router-link>
            </template>
          </EEventInstance>
        </template>
      </EScheduleEvent>
    </template>
    <section v-else>
      <!-- TODO: Differentiate between data not -->
      <!-- yet loaded and data fetching failed  -->
      -->
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

.projectTitle {
  margin-bottom: var(--m-2);
}
.EscheduleEvent a {
  color: var(--gray-300);
}
.EscheduleEvent a:hover {
  color: var(--fg);
}
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 600px) {
  .Page.Projects > section {
    grid-column: 4 / -1;
    margin-bottom: var(--m-24);
  }
}
@media only screen and (min-width: 1000px) {
  .Page.Projects {
    grid-template-columns: repeat(8, 1fr);
  }
  .Page.Projects > section {
    grid-column: 4 / -1;
  }
}
</style>
