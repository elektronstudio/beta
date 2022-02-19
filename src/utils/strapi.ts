import { computed, ref } from "vue";
import { useRange } from "elektro";
import { $fetch } from "ohmyfetch";
import { compareDesc } from "date-fns";

import { config, formatMarkdown } from ".";

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
  project.thumbnail = project.images[0]?.url;

  // TODO: Add image remapping

  project.description_intro = formatMarkdown(project.intro);
  project.description_english = formatMarkdown(project.description_english);
  project.description_estonian = formatMarkdown(project.description_estonian);

  project.events = (project.events || [])
    .map((event: any) => {
      event.description_english = formatMarkdown(event.description_english);
      event.description_estonian = formatMarkdown(event.description_estonian);
      const eventData = useRange(
        new Date(event.start_at),
        new Date(event.end_at),
      );
      return { ...event, ...eventData };
    })
    .sort(sortEvents);

  project.upcomingEvents = project.events.filter(
    (event: any) => event.urgency.value !== "past",
  );

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
    return projects.value.filter(
      (project: any) => project.upcomingEvents.length > 0,
    );
  });

  return { projects, upcomingProjects };
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
