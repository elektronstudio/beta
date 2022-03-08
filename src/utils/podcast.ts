import { ref } from "vue";
import { $fetch } from "ohmyfetch";
import Parser from "rss-parser/dist/rss-parser.js";
import { config } from ".";

export async function usePodcastRss() {
  const rss = ref<any>();
  let parser = new Parser();
  const rssSource: any = await $fetch(config.podcastRssUrl as string);
  const rssContent: any = await parser.parseString(rssSource.contents);
  rss.value = rssContent;
  return rss;
}
