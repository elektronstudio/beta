<script setup lang="ts">
import { watchEffect } from "vue";
import { useProjectBySlug } from "../utils";
const { project } = useProjectBySlug("kohe2022");
</script>
<template>
  <div class="Page PageTemplate">
    <header>
      <ETitle size="lg" v-html="project.title" />
    </header>
    <main class="MainContent">
      <EBox>
        <!-- TODO use the project.intro field in Strapi-->
        <EContent v-html="project.description_estonian" />
      </EBox>
      <EBox>
        <EContent v-html="project.description_english" />
      </EBox>
    </main>
  </div>
</template>

<style scoped>
.Page.PageTemplate {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
  padding: var(--p-4);
  color: var(--gray-300);
}

.MainContent {
  display: grid;
  grid-gap: var(--gap-5);
}

@media only screen and (min-width: 600px) {
  .Page.PageTemplate {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media only screen and (min-width: 1240px) {
}
</style>
