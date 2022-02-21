<script setup lang="ts">
import { useProjectBySlug } from "../utils";
const about = `Transdistsiplinaarne etenduskunsti platvorm,<br />mis liidab kaasaegse
      kunsti, teaduse ja<br />tehnloogia otsingulisi tegevusi`;
</script>
<template>
  <div class="Page">
    <ETitle size="lg" class="about" v-html="about" />
    <video
      class="video"
      src="https://fra1.digitaloceanspaces.com/elektron/strapi/360a11d9f1f67714207c413e56b6e711.mp4"
      muted
      autoplay
      loop
    />
  </div>
</template>

<style scoped>
.Page {
  position: relative;
}
.about {
  position: absolute;
  top: var(--p-5);
  left: var(--p-5);
}
.video {
  width: 100%;
  height: calc(100vh - var(--h-9));
  object-fit: cover;
  opacity: 0.25;
}
</style>
