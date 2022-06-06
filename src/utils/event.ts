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
  live: boolean | null;
  live_url: string | null;
};

type EventComputed = {
  project: { slug?: string; fienta_id?: string };
  thumbnail: Image | null;
  intro: Ref<string> | string | null;
  description: Ref<string>;
  ticketUrl: string | null;
  // TODO: Remove when new live page is ahem, live
  liveUrl: string;
  projectRoute: string;
  route: string;
  liveRoute: string;
  details: string | null;
  videostreams: ReturnType<typeof processStreamkey> | null;
  ticketableStatus: ReturnType<typeof getTicketableStatus>;
  userHasLiveAccess: boolean;
  userCanBuyTicket: boolean;
} & ReturnType<typeof useRange>;

export type Event = EventSchema & EventComputed;

export function sortEvents(a: Event, b: Event) {
  if (a.start_at && b.start_at) {
    return compareDesc(new Date(b.start_at), new Date(a.start_at));
  }
  return 0; // Keep original sort order if no data for sorting
}

export function processEvent(event: Event): Event {
  if (event.images?.data == null) {
    event.images = null;
  } else if (event.images.data) {
    event.images = event.images.data.map((e) => e.attributes);
  }

  event.images = event.images
    ? event.images.filter(filterImage).map(processImage)
    : null;

  if (event.thumbnail?.data == null) {
    event.thumbnail = null;
  } else if (event.thumbnail.data) {
    event.thumbnail = event.thumbnail.data.attributes;
  }

  event.thumbnail = event.thumbnail ? processImage(event.thumbnail) : null;

  const intro_english = formatMarkdown(event.intro_english || "");
  const intro_estonian = formatMarkdown((event.intro as string) || "");

  event.intro = computed(() => l(intro_english, intro_estonian));

  const description_english = formatMarkdown(event.description_english || "");
  const description_estonian = formatMarkdown(event.description_estonian || "");

  event.description = computed(() =>
    l(description_english, description_estonian),
  );
  // TODO: Fix typings
  //@ts-ignore
  event.details = event.details
    ? event.details.split("\n").map((item: any) => {
        const [key, value] = item.split(": ");
        return {
          detail: key,
          value,
        };
      })
    : null;

  // TODO: Handle missing values better
  const eventDates = event.start_at
    ? useRange(
        event.start_at ? new Date(event.start_at) : new Date(),
        event.end_at ? new Date(event.end_at) : new Date(),
      )
    : undefined;

  const project = event.projects ? event.projects.data[0].attributes : null;

  const fientaId = event.fienta_id
    ? event.fienta_id
    : project?.fienta_id
    ? project.fienta_id
    : null;

  let ticketUrl = null;

  if (fientaId) {
    ticketUrl = config.fientaTicketUrl;
    ticketUrl = replaceTokens(config.fientaTicketUrl as string, {
      fientaId,
    });
  }

  const routes = {
    projectRoute: `/projects/${project?.slug}`,
    route: `/projects/${project?.slug}/${event.slug}`,
    liveRoute: `/projects/${project?.slug}/${event.slug}/live`,
  };

  const videostreams = event.streamkey
    ? processStreamkey(event.streamkey)
    : null;

  let ticketableStatus = null;
  let userHasLiveAccess = null;
  let userCanBuyTicket = null;

  if (project) {
    const ticketableStatus = getTicketableStatus([event, project]);

    const userHasLiveAccess =
      ticketableStatus === "FREE" || ticketableStatus === "HAS_TICKET";

    const userCanBuyTicket: boolean =
      !!ticketUrl &&
      ticketableStatus !== "HAS_TICKET" &&
      eventDates?.urgency.value !== "past";
  }
  return {
    ...event,
    ...eventDates,
    ticketUrl,
    ...routes,
    videostreams,
    //@ts-ignore
    ticketableStatus,
    //@ts-ignore
    userHasLiveAccess,
    //@ts-ignore
    userCanBuyTicket,
  };
}
