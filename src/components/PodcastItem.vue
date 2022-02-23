<!-- @TODO: Move to Elektro -->
<script setup lang="ts">
type Props = {
  thumbnail?: string;
  title: string;
  description: string;
  audio: string;
};

const { thumbnail, title, description, audio } = defineProps<Props>();
</script>

<template>
  <div class="PodcastItem">
    <img v-if="thumbnail" :src="thumbnail" class="thumbnail" />
    <div class="content">
      <ETitle el="h3" v-html="title" />
      <EContent :content="description" />
      <audio controls :src="audio" />
    </div>
  </div>
</template>

<style scoped>
.PodcastItem {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-areas: "thumbnail content";
  margin-bottom: var(--m-6);
}
.thumbnail {
  grid-area: thumbnail;
  width: 100%;
  height: auto;
}
.content {
  grid-area: content;
  padding: 0 var(--p-5);
}
.content h3,
.content .EContent {
  margin-bottom: var(--m-3);
}

.EContent {
  color: var(--gray-300);
}
</style>
