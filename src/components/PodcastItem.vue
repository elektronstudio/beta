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
      <audio class="audio" controls :src="audio" />
    </div>
  </div>
</template>

<style scoped>
.PodcastItem {
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: var(--m-6);
}
.thumbnail {
  max-width: 10rem;
  height: auto;
  justify-self: center;
  margin-bottom: var(--m-5);
}
.content h3,
.content .EContent {
  margin-bottom: var(--m-3);
}

.EContent {
  color: var(--gray-300);
  word-break: break-word;
}

.audio {
  max-width: 100%;
}

@media only screen and (min-width: 600px) {
  .PodcastItem {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-areas: "thumbnail content";
  }

  .thumbnail {
    grid-area: thumbnail;
    width: 100%;
    height: auto;
    margin: 0;
  }
  .content {
    grid-area: content;
    padding: 0 var(--p-5);
  }
}
</style>
