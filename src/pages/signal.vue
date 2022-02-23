<script setup lang="ts">
import { $fetch } from "ohmyfetch";
import Parser from "rss-parser/dist/rss-parser.js";
import { useProjectBySlug } from "../utils";
import PodcastItem from "../components/PodcastItem.vue";

// TODO move to /logic and use env variable

const { project } = useProjectBySlug("signal");

const rssUrl =
  "https://api.allorigins.win/get?url=https://elektronsignal.captivate.fm/rssfeed";
let parser = new Parser();
const rssSource: any = await $fetch(rssUrl);
const rss = await parser.parseString(rssSource.contents);
</script>

<template>
  <div class="signal">
    <!-- TODO: Remove style when elektro gets updated -->
    <EBox class="content">
      <ETitle el="h1" size="lg">Elektron Signal</ETitle>

      <!-- TODO: Add susbcribe buttons -->
      <!-- https://github.com/elektronstudio/art/blob/master/src/pages/Signal.vue#L36 -->
      <EContent v-html="project?.description_estonian" />
      <EContent v-html="project?.description_english" />
    </EBox>
    <EStack>
      <ETitle>Latest episodes</ETitle>
      <PodcastItem
        v-for="episode in rss.items"
        :title="episode.title"
        :description="episode['content:encoded']"
        :thumbnail="episode.itunes.image"
        :audio="episode?.enclosure.url"
      />
    </EStack>
  </div>
</template>

<style scoped>
.signal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: var(--gap-5);
  padding: var(--gap-5);
  grid-auto-rows: auto;
}
/* @TODO: Add breakpoints system */
@media only screen and (max-width: 800px) {
  .signal {
    grid-template-columns: 1fr;
  }
}

.content h1 {
  margin-bottom: var(--m-3);
}
</style>
