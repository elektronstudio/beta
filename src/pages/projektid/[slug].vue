<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProjectBySlug } from "../../utils";

const { params } = useRoute();
const { project } = useProjectBySlug(params.slug as string);
</script>

<template>
  <div class="Page">
    <EStack layout="horizontal" :cols="2" v-if="project">
      <EStack>
        <ETitle size="lg" v-html="project.title" />
        <EContent v-html="project.description_estonian" />
        <EContent v-html="project.description_english" />
      </EStack>
      <!-- TODO: Remove style when elektro gets updated -->
      <EStack v-if="project.upcomingEvents" style="grid-auto-rows: min-content">
        <ETitle>Upcoming events</ETitle>
        <template v-for="event in project.upcomingEvents">
          <ETitle v-html="event.title" />
          <p>
            {{ event.formattedFromDatetime }} / {{ event.formattedDistance }}
          </p>
        </template>
      </EStack>
    </EStack>
  </div>
</template>

<style scoped>
.Page {
  padding: var(--p-5);
}
</style>
