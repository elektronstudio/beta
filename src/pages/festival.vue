<script setup lang="ts">
import { useProjectBySlug } from "../utils";
const { project } = useProjectBySlug("kohe2022");
</script>
<template>
  <div class="Page">
    <EStack v-if="project">
      {{ project }}
      <ETitle size="lg" v-html="project.title" />
      <EContent v-html="project.description_estonian" />
      <EContent v-html="project.description_english" />
    </EStack>
  </div>
</template>

<style scoped>
.Page {
  padding: var(--p-5);
}
</style>
