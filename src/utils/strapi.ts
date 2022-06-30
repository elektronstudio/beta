import { computed, ref } from "vue";
import { $fetch } from "ohmyfetch";
import merge from "lodash.merge";
import qs from "qs";

import {
  config,
  lang,
  l,
  sortProject,
  processProject,
  processEvent,
  filterProject,
} from ".";
import { useIntervalFn } from "@vueuse/core";

export function useProjects() {
  const projects = ref<any>([]);
  // TODO use more of Strapi sorting and filtering
  const q = qs.stringify(
    {
      populate: [
        "localizations",
        "images",
        "thumbnail",
        "events",
        "events.images",
        "events.thumbnail",
      ],
      sort: ["createdAt:desc"],
      pagination: { limit: -1 },
    },
    {
      encodeValuesOnly: true,
    },
  );

  const url = `${config.strapiV4Url}/api/projects?${q}`;

  $fetch(url).then((f) => {
    projects.value = f.data
      .map((p) => p.attributes)
      .sort(sortProject)
      .filter(filterProject)
      .map(processProject);
  });

  const upcomingProjects = computed(() => {
    const p = projects.value.filter((project: any) => project.upcomingEvents);
    return p.length ? p : null;
  });

  const upcomingEvents = computed(() => {
    if (!upcomingProjects.value) {
      return null;
    }

    const events = [] as any[];

    upcomingProjects.value.forEach((project: any) => {
      project.upcomingEvents.forEach((event: any) => {
        events.push(event);
      });
    });

    const sortByDate = events.sort(
      (event1: any, event2: any) =>
        new Date(event1.start_at).getTime() -
        new Date(event2.start_at).getTime(),
    );

    return sortByDate;
  });

  const upcomingLiveEvents = computed(() => {
    if (!upcomingEvents.value) {
      return null;
    }
    return upcomingEvents.value.filter((e) => e.live !== false);
  });

  const firstUpcomingLiveEvent = computed(() => {
    if (!upcomingLiveEvents.value) {
      return null;
    }
    return upcomingLiveEvents.value[0];
  });

  return {
    projects,
    upcomingProjects,
    upcomingLiveEvents,
    firstUpcomingLiveEvent,
  };
}

export function useProjectBySlug(slug: string) {
  const project = ref<any>();

  const q = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: [
        "localizations",
        "images",
        "thumbnail",
        "events",
        "events.images",
        "events.thumbnail",
        "events.projects",
      ],
    },
    {
      encodeValuesOnly: true,
    },
  );
  const url = `${config.strapiV4Url}/api/projects?${q}`;
  $fetch(url).then((res) => {
    project.value = processProject(res.data[0].attributes);
  });
  return project;
}

export function useEventBySlug(slug: string) {
  const event = ref<any>();

  const q = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: ["localizations", "images", "thumbnail", "projects"],
    },
    {
      encodeValuesOnly: true,
    },
  );
  const url = `${config.strapiV4Url}/api/events?${q}`;

  $fetch(url).then((res) => {
    event.value = processEvent(res.data[0].attributes);
  });
  return event;
}

const UPDATE_RATE = 1000 * 60 * 5; // 5 minutes

export function useUpdatingEventBySlug(slug: string) {
  const event = ref<any>();
  useIntervalFn(
    () => {
      // TODO: Avoid fetch code duplication
      const q = qs.stringify(
        {
          filters: {
            slug: { $eq: slug },
          },
          populate: ["localizations", "images", "thumbnail", "projects"],
        },
        {
          encodeValuesOnly: true,
        },
      );
      const event = ref<any>();
      const url = `${config.strapiV4Url}/api/events?${q}`;

      $fetch(url).then((res) => {
        event.value = processEvent(res.data[0].attributes);
      });
    },
    UPDATE_RATE,
    { immediateCallback: true },
  );
  return event;
}

// TODO: Rearchitect to use reactive data
export async function getPodcast() {
  return await $fetch(
    `${config.strapiUrl}/festivals?slug=signal&populate=*`,
  ).then((f) => f.map(processProject)[0]);
}

export function useAboutPage() {
  // TODO: I was not able to get all the locales on one go usig
  // ?lang=all -- hence this complex fetching. Simplify it.
  const pageLangs = ref<any>([null, null]);
  Promise.all(
    ["en", "et"].map((langcode) =>
      $fetch(
        `${config.strapiV4Url}/api/about?populate[cards][populate]=*&locale=${langcode}`,
      ),
    ),
  ).then((res) => (pageLangs.value = res));
  return computed(() => l(pageLangs.value[0], pageLangs.value[1]));
}

// TODO: Not needed any more?
export async function getAboutPage() {
  return await $fetch(
    `${config.strapiV4Url}/api/about?populate%5Bcards%5D%5Bpopulate%5D=*`,
  );
}

export function useFrontPage() {
  const pageLangs = ref<any>([null, null]);
  // Was able to fetch both languages in one query,
  // wondering why does it not work on useAboutPage?
  $fetch(`${config.strapiV4Url}/api/frontpage?populate=*`).then((res) => {
    res.data.attributes.background.data.attributes.url = `https://${res.data.attributes.background.data.attributes.url}`;
    pageLangs.value = [
      merge({}, res, {
        data: {
          attributes: res.data.attributes.localizations.data[0].attributes,
        },
      }),
      // et
      res,
    ];
  });
  return computed(() => pageLangs.value[lang.value]);
}

export async function getPage(slug: string) {
  const page = ref<any>();
  await $fetch(`${config.strapiV4Url}/api/pages?filters[slug]=${slug}`).then(
    (f) => {
      page.value = f.data[0];
    },
  );
  return page;
}
