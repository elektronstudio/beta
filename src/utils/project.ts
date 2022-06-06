import { computed, Ref } from "vue";
import { formatMarkdown, l, processEvent, sortEvents } from ".";
import type { Image, Event } from ".";
import { filterImage, processImage } from "./image";

export type ProjectSchema = {
  id: number;
  title: string | null;
  fienta_id: string | null;
  slug: string | null;
  description_english: string | null;
  description_estonian: string | null;
  published_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  priority: number | null;
  pinned: boolean | null;
  archived: boolean | null;
  //intro: string | null;
  authors: string | null;
  details: string | null;
  intro_english: string | null;
  images: Image[];
  thumbnail: Image | null;
};

type ProjectComputed = {
  events?: Event[] | null;
  intro: Ref<string> | string | null;
  description: Ref<string>;
  upcomingEvents: Event[] | null;
  pastEvents: Event[] | null;
  details: any; // TODO: Proper typings for details
  route: string;
};

type Project = ProjectSchema & ProjectComputed;

export function sortProject(a: any, b: any) {
  return Number(b.pinned) - Number(a.pinned);
}

export function filterProject(project: any) {
  return !["kohe2022", "signal", "other"].includes(project.slug);
}

export function processProject(project: Project): Project {
  if (project.images.data) {
    project.images = project.images.data.map((i) => i.attributes);
  }
  project.images = project.images.filter(filterImage).map(processImage);

  if (project.thumbnail.data) {
    project.thumbnail = project.thumbnail.data.attributes;
  }
  if (project.thumbnail) {
    project.thumbnail = processImage(project.thumbnail);
  } else if (project.images[0]) {
    project.thumbnail = project.images[0];
  }
  if (project.thumbnail.data === null) {
    project.thumbnail = null;
  }

  const intro_english = formatMarkdown((project.intro_english as string) || "");
  const intro_estonian = formatMarkdown((project.intro as string) || "");

  project.intro = computed(() => l(intro_english, intro_estonian));

  // TODO: Remove when not needed anymore
  const description_english = formatMarkdown(project.description_english || "");
  const description_estonian = formatMarkdown(
    project.description_estonian || "",
  );

  project.description = computed(() =>
    l(description_english, description_estonian),
  );

  //@ts-ignore
  project.events = (project.events?.data || [])
    //@ts-ignore
    .map(({ attributes: event }) => {
      // In some cases, we do not have event.project
      // data, for example when fetchng events from
      // project.events. In this case we provide subsset
      // of the project data for event processing
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

  // TODO: Can we cut some verbosity here?

  const upcomingEvents = (project.events || []).filter(
    (event: any) => event.urgency && event.urgency?.value !== "past",
  );

  project.upcomingEvents = upcomingEvents.length ? upcomingEvents : null;

  const pastEvents = (project.events || []).filter(
    (event: any) => event.urgency?.value === "past",
  );

  project.pastEvents = pastEvents.length ? pastEvents : null;

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
