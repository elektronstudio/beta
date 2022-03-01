import { computed, ref } from "vue";
import { useRange } from "elektro";
import { $fetch } from "ohmyfetch";
import { compareDesc } from "date-fns";

import { config, formatMarkdown, replaceTokens } from ".";

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
      // Convert Markdown to HTML
      event.description_english = formatMarkdown(event.description_english);
      event.description_estonian = formatMarkdown(event.description_estonian);
      // Augment events with reactive event data
      const eventData = useRange(
        new Date(event.start_at),
        new Date(event.end_at),
      );
      const liveUrl = replaceTokens(config.liveUrl as string, {
        projectSlug: project.slug,
        eventSlug: event.slug,
      });

      const fientaId = event.fienta_id
        ? event.fienta_id
        : project.fienta_id
        ? project.fienta_id
        : null;

      let ticketUrl = null;

      if (fientaId) {
        ticketUrl = config.fientaTicketUrl;
        ticketUrl = replaceTokens(config.fientaTicketUrl as string, {
          fientaId,
        });
      }

      return { ...event, ...eventData, liveUrl, ticketUrl };
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

export function useProjectBySlug(slug: string) {
  const project = ref<any>();
  $fetch(`${config.strapiUrl}/festivals?slug=${slug}`).then(
    (f) => (project.value = f.map(processProject)[0]),
  );
  return { project };
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
