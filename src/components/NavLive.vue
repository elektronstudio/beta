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
  <a
    class="NavLive"
    :href="event.route"
    :class="{ isLive: event?.urgency === 'now' }"
    v-if="event"
  >
    {{ formattedDistance }}: <span class="eventTitle">{{ event.title }}</span>
  </a>
</template>

<style scoped>
.NavLive {
  height: var(--h-9);
  padding: var(--p-1) var(--p-3);
  border: var(--border-DEFAULT) solid var(--gray-500);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background-color: var(--bg);
  text-transform: uppercase;
  color: var(--gray-300);
  line-height: 1;
  overflow: hidden;
}

.NavLive:hover {
  border-image: url("/images/bg-texture-xs.gif") 1;
  z-index: 2;
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
    width: 100%;
    order: 10;
    border-top: none;
  }
}
@media only screen and (min-width: 600px) {
  .NavLive {
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
    width: 32rem;
  }
}
</style>
