// TODO: Bring processEvent here from ./strapi.ts

import { compareDesc } from "date-fns";
import { getTicketableStatus, useRange } from "elektro";
import { computed, Ref } from "vue";
import {
  config,
  filterImage,
  formatMarkdown,
  l,
  processImage,
  processStreamkey,
  replaceTokens,
} from ".";
import type { Image } from ".";

// TODO: Unify optional data typings;
type EventSchema = {
  id: number;
  title: string | null;
  slug: string | null;
  start_at: string | null;
  end_at: string | null;
  streamkey: string | null;
  fienta_id?: string;
  description_english: string | null;
  festival: number | null;
  description_estonian: string | null;
  published_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  chat: boolean | null;
  priority: number | null;
  controls: string | null;
  //intro: string | null;
  intro_english: string | null;
  images: Image[] | null;
};

type EventComputed = {
  project: { slug?: string; fienta_id?: string };
  gallery: Image[] | null;
  intro: Ref<string> | string | null;
  description: Ref<string>;
  ticketUrl: string | null;
  liveUrl: string;
  projectRoute: string;
  route: string;
  hiddenLiveRoute: string;
  videostreams: ReturnType<typeof processStreamkey> | null;
  ticketableStatus: ReturnType<typeof getTicketableStatus>;
} & ReturnType<typeof useRange>;

export type Event = EventSchema & EventComputed;

export function sortEvents(a: Event, b: Event) {
  if (a.start_at && b.start_at) {
    return compareDesc(new Date(b.start_at), new Date(a.start_at));
  }
  return 0; // Keep original sort order if no data for sorting
}

export function processEvent(event: Event): Event {
  event.images = event.images.filter(filterImage).map(processImage);
  event.thumbnail = event.thumbnail ? processImage(event.thumbnail) : null;

  //event.gallery = event.images.length > 1 ? event.images.slice(1) : null;

  const intro_english = formatMarkdown(event.intro_english || "");
  const intro_estonian = formatMarkdown((event.intro as string) || "");

  event.intro = computed(() => l(intro_english, intro_estonian));

  const description_english = formatMarkdown(event.description_english || "");
  const description_estonian = formatMarkdown(event.description_estonian || "");

  event.description = computed(() =>
    l(description_english, description_estonian),
  );

  // TODO: Handle missing values better
  const eventDates =
    event.start_at && event.end_at
      ? useRange(
          event.start_at ? new Date(event.start_at) : new Date(),
          event.end_at ? new Date(event.end_at) : new Date(),
        )
      : undefined;

  const fientaId = event.fienta_id
    ? event.fienta_id
    : event.project.fienta_id
    ? event.project.fienta_id
    : null;

  let ticketUrl = null;

  if (fientaId) {
    ticketUrl = config.fientaTicketUrl;
    ticketUrl = replaceTokens(config.fientaTicketUrl as string, {
      fientaId,
    });
  }

  const routes = {
    projectRoute: `/projects/${event.project.slug}`,
    route: `/projects/${event.project.slug}/${event.slug}`,
    hiddenLiveRoute: `/projects/${event.project.slug}/${event.slug}/live`,
  };

  const liveUrl = replaceTokens(config.liveUrl as string, {
    projectSlug: event.project.slug || "",
    eventSlug: event.slug || "",
  });

  const videostreams = event.streamkey
    ? processStreamkey(event.streamkey)
    : null;

  const ticketableStatus = getTicketableStatus([event, event.project]);

  return {
    ...event,
    ...eventDates,
    ticketUrl,
    liveUrl, // TODO Remove when live page is ready
    ...routes,
    videostreams,
    ticketableStatus,
  };
}
