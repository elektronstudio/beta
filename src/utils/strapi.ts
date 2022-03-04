import { computed, ref } from "vue";
import { useRange } from "elektro";
import { $fetch } from "ohmyfetch";
import { compareDesc } from "date-fns";

import { config, formatMarkdown, processStreamkey, replaceTokens } from ".";

// TODO: Add Event and Project typings

function sortProject(a: any, b: any) {
  return Number(b.pinned) - Number(a.pinned);
}

function filterProject(project: any) {
  return !["kohe2022", "signal", "other"].includes(project.slug);
}

function sortEvents(a: any, b: any) {
  return compareDesc(new Date(b.start_at), new Date(a.start_at));
}

function processEvent(event: any) {
  // @TODO: THIS could be more DRY and optimised
  event.images = event.images
    .filter((image: any) => image.mime !== "video/mp4")
    .map((image: any) => {
      const imageData = {
        sizes: Object.values(image.formats),
        alt: image.alternativeText,
        caption: image.caption,
      };
      return { ...image, ...imageData };
    });

  event.gallery = event.images.length > 1 ? event.images.slice(1) : null;

  event.description_intro = formatMarkdown(event.intro);

  // Convert Markdown to HTML
  event.description_english = formatMarkdown(event.description_english);
  event.description_estonian = formatMarkdown(event.description_estonian);

  // Augment events with reactive event data
  const eventData = useRange(new Date(event.start_at), new Date(event.end_at));

  const liveUrl = replaceTokens(config.liveUrl as string, {
    projectSlug: event.project.slug,
    eventSlug: event.slug,
  });

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

  const route = `/projects/${event.project.slug}/${event.slug}`;
  const liveRoute = `/projects/${event.project.slug}/${event.slug}/live`;

  const streamkeys = processStreamkey(event.streamkey);

  return {
    ...event,
    ...eventData,
    liveUrl,
    ticketUrl,
    route,
    liveRoute,
    ...streamkeys,
  };
}

function processProject(project: any) {
  // Augment image data
  project.images = project.images
    .filter((image: any) => image.mime !== "video/mp4")
    .map((image: any) => {
      const imageData = {
        sizes: Object.values(image.formats),
        alt: image.alternativeText,
        caption: image.caption,
      };
      return { ...image, ...imageData };
    });

  project.gallery = project.images.length > 1 ? project.images.slice(1) : null;
  project.thumbnail = project.images[0]?.url;

  // Convert Markdown to HTML
  project.description_intro = formatMarkdown(project.intro);
  project.description_english = formatMarkdown(project.description_english);
  project.description_estonian = formatMarkdown(project.description_estonian);

  project.events = (project.events || [])
    .map((event: any) => {
      if (!event.project) {
        event = {
          ...event,
          project: {
            slug: project.slug,
            fienta_id: project.fienta_id,
          },
        };
      }
      return processEvent(event);
    })
    .sort(sortEvents);

  const p = project.events.filter(
    (event: any) => event.urgency.value !== "past",
  );

  project.upcomingEvents = p.length ? p : null;
  project.details = project.details
    ? project.details.split("\n").map((item: any) => {
        const [key, value] = item.split(": ");
        return {
          detail: key,
          value,
        };
      })
    : null;

  project.route = `/projects/${project.slug}`;

  return project;
}

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

import projectData from "../data/saveucraine.json";

export function useProjectBySlug(slug: string) {
  const project = ref<any>();
  // $fetch(`${config.strapiUrl}/festivals?slug=${slug}`).then(
  //   (f) => (project.value = f.map(processProject)[0]),
  // );
  project.value = projectData.map(processProject)[0];
  return project;
}

export function useEventBySlug(slug: string) {
  const event = ref<any>();
  // $fetch(`${config.strapiUrl}/events?slug=${slug}`).then((res) => {
  //   const e = {
  //     ...res[0],
  //     project: processProject(res[0].festival),
  //     festival: null,
  //   };
  //   event.value = processEvent(e);
  // });
  event.value = projectData
    .map(processProject)[0]
    .events.filter((e: any) => e.slug === slug)[0];
  return event;
}

export async function getPodcast() {
  return await $fetch(`${config.strapiUrl}/festivals?slug=signal`).then(
    (f) => f.map(processProject)[0],
  );
}

export async function getAboutPage() {
  return await $fetch(
    `${config.strapiV4Url}/api/about?populate%5Bcards%5D%5Bpopulate%5D=*`,
  );
}

export async function getFrontPage() {
  return await $fetch(
    `${config.strapiV4Url}/api/about?populate%5Bcards%5D%5Bpopulate%5D=*`,
  );
}

export async function getPage(slug: string) {
  const page = ref<any>();
  await $fetch(
    `${config.strapiV4Url}/api/pages?filters%5Bslug%5D=${slug}`,
  ).then((f) => (page.value = f.data[0]));
  return page;
}
