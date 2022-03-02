<script setup lang="ts">
import { useProjects } from "../utils";
import { icons } from "@iconify-json/radix-icons";
const arrowRight = icons.icons["arrow-right"].body;

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
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    v-html="arrowRight"
                  ></svg>
                  Loe lähemalt
                </EButton>
              </router-link>
            </template>
          </EEventInstance>
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

.projectTitle {
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
