<script setup lang="ts">
import { computed } from "vue";
import { useProjects } from "../utils";

const { firstUpcomingProject } = useProjects();
const event = computed(() => firstUpcomingProject.value?.upcomingEvents?.[0]);
</script>

<template>
  <RouterLink
    class="NavLive"
    :class="{ isLive: event?.urgency === 'now' }"
    to="/"
  >
    <a :href="event.liveUrl" target="_blank" v-if="event">
      {{ event.title }} {{ event.formattedDistance }}
    </a>
  </RouterLink>
</template>

<style scoped>
.NavLive {
  display: inline-flex;
  height: var(--h-9);
  padding: var(--p-1) var(--p-3);
  border: var(--border-DEFAULT) solid var(--gray-500);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--gray-300);
}
.NavLive.isLive {
  color: var(--bg);
  background-color: var(--gray-200);
}
@media only screen and (max-width: 599px) {
  .NavLive {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
@media only screen and (min-width: 600px) {
  .NavLive {
    margin-left: auto;
    width: 20rem;
    padding: var(--p-1);
  }
}
@media only screen and (min-width: 1000px) {
  .NavLive {
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
}
@media only screen and (min-width: 1240px) {
  .NavLive {
    width: 30rem;
  }
}
</style>
