import { computed } from "vue";
import { useRange } from "elektro";
import { $fetch } from "ohmyfetch";
import { compareDesc } from "date-fns";

import { config } from ".";

// TODO: Add Event and Project typings

function sortEvents(a: any, b: any) {
  return compareDesc(new Date(b.start_at), new Date(a.start_at));
}

function sortProjects(a: any, b: any) {
  return Number(b.pinned) - Number(a.pinned);
}

function processFestival(festival: any) {
  festival.thumbnail = festival.images[0]?.url;

  // TODO: Add image remapping
  festival.events = computed(() =>
    festival.events
      .map((event: any) => {
        const eventData = useRange(
          new Date(event.start_at),
          new Date(event.end_at),
        );
        return { ...event, ...eventData };
      })
      .sort(sortEvents),
  );

  festival.upcomingEvents = computed(() =>
    festival.events.value.filter(
      (event: any) => event.urgency.value !== "past",
    ),
  );

  return festival;
}

export async function getProjects() {
  // TODO use secondary Strapi sorting for pinned first
  return $fetch(
    `${config.strapiUrl}/festivals?_sort=created_at:DESC&_limit=-1&slug_nin=kohe&slug_nin=signal&slug_nin=other"`,
  ).then((f) => f.sort(sortProjects).map(processFestival));
}

export async function getProjectsWithUpcomingEvents() {
  return getProjects().then((f) =>
    f.filter((festival: any) => festival.upcomingEvents.length > 0),
  );
}

export async function getFestival() {
  return await $fetch(`${config.strapiUrl}/festivals?slug=kohe2022`).then(
    (f) => f.map(processFestival)[0],
  );
}

export async function getPodcast() {
  return await $fetch(`${config.strapiUrl}/festivals?slug=signal`).then(
    (f) => f.map(processFestival)[0],
  );
}
