import { computed, ref } from "vue";
import { $fetch } from "ohmyfetch";
import merge from "lodash.merge";

import { config, lang, l, sortProject, processProject, processEvent } from ".";

export function useProjects() {
  const projects = ref<any>([]);
  // TODO use more of Strapi sorting and filtering
  $fetch(
    `${config.strapiUrl}/festivals?_sort=created_at:DESC&_limit=-1&slug_nin=kohe2022&slug_nin=signal&slug_nin=other`,
  ).then((f) => {
    projects.value = f.sort(sortProject).map(processProject);
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

  const firstUpcomingProject = computed(() => {
    if (!upcomingEvents.value) {
      return null;
    }

    return upcomingEvents.value[0];
  });

  return { projects, upcomingProjects, firstUpcomingProject };
}

export function useProjectBySlug(slug: string) {
  const project = ref<any>();
  $fetch(`${config.strapiUrl}/festivals?slug=${slug}`).then(
    (f) => (project.value = f.map(processProject)[0]),
  );
  return project;
}

export function useEventBySlug(slug: string) {
  const event = ref<any>();
  $fetch(`${config.strapiUrl}/events?slug=${slug}`).then((res) => {
    // Temporarily rename event.festival to event.project
    // TODO: Remove it when migrating data to v4
    const e = {
      ...res[0],
      project: processProject(res[0].festival),
      festival: null,
    };
    event.value = processEvent(e);
  });
  return event;
}

// TODO: Rearchitect to use reactive data
export async function getPodcast() {
  return await $fetch(`${config.strapiUrl}/festivals?slug=signal`).then(
    (f) => f.map(processProject)[0],
  );
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
