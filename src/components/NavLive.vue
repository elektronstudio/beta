<script setup lang="ts">
import { computed } from "vue";
import { useProjects } from "../utils";

const { firstUpcomingProject } = useProjects();
const event = computed(() => firstUpcomingProject.value);
// @TODO: Maybe this should come from elektro useDate
const formattedDistance = computed(() =>
  event.value?.urgency === "now" ? "LIVE NOW!" : event.value?.formattedDistance,
);
</script>

<template>
  <RouterLink
    class="NavLive"
    :to="event.route"
    :class="{ isLive: event?.urgency === 'now' }"
    v-if="event"
  >
    {{ formattedDistance }}: <span class="eventTitle">{{ event.title }}</span>
  </RouterLink>
</template>

<style scoped>
.menuItem.NavLive {
  display: inline;
}
.NavLive {
  display: inline;
  overflow: hidden;
  background-color: var(--bg);
  margin-top: calc(var(--border-DEFAULT) * -1);
}

.eventTitle {
  color: var(--fg);
}
.NavLive.isLive {
  color: var(--bg);
  background-color: var(--gray-200);
}
.NavLive.isLive:hover {
  background-color: var(--gray-100);
}
.NavLive.isLive .eventTitle {
  color: var(--bg);
}
@media only screen and (max-width: 599px) {
  .NavLive {
    border-top: none;
    width: 100%;
    order: 99;
  }
}
@media only screen and (min-width: 600px) {
  .NavLive {
    width: 20rem;
    padding: var(--p-1);
    margin-top: 0;
  }
}
@media only screen and (min-width: 1000px) {
  .NavLive {
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
}
@media only screen and (min-width: 1240px) {
  .NavLive {
    width: 32rem;
  }
}
</style>
