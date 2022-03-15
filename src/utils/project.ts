import { computed } from "vue";
import { formatMarkdown, l, processEvent, sortEvents } from ".";

// TODO: Add typings
export type Project = {};

export function sortProject(a: any, b: any) {
  return Number(b.pinned) - Number(a.pinned);
}

export function filterProject(project: any) {
  return !["kohe2022", "signal", "other"].includes(project.slug);
}

export function processProject(project: any) {
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

  // For backward compatability
  // TODO: Remove
  project.description_intro = formatMarkdown(project.intro);

  // TODO: Remove when not needed anymore
  project.intro_english = formatMarkdown(project.intro_english);
  project.intro_estonian = formatMarkdown(project.intro);

  project.intro = computed(() =>
    l(project.intro_english, project.intro_estonian),
  );

  // TODO: Remove when not needed anymore
  project.description_english = formatMarkdown(project.description_english);
  project.description_estonian = formatMarkdown(project.description_estonian);

  project.description = computed(() =>
    l(project.description_english, project.description_estonian),
  );

  project.events = (project.events || [])
    .map((event: any) => {
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

  const p = (project.events || []).filter(
    (event: any) => event.urgency?.value !== "past",
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
