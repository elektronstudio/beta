<script setup lang="ts">
import { Event, Image, l } from "@/utils";
import EventButtons from "./EventButtons.vue";

type Props = {
  event: Event;
  projectThumbnail?: Image;
  layout?: "vertical" | "horizontal";
};

const { event, projectThumbnail, layout = "horizontal" } = defineProps<Props>();
</script>

<template>
  <article class="EventCard" :class="layout">
    <figure>
      <EImage v-if="event.thumbnail" :sizes="event.thumbnail.sizes" />
      <EImage v-if="projectThumbnail" :sizes="projectThumbnail?.sizes" />
    </figure>
    <div class="content">
      <header>
        <time v-if="event.start_at" :datetime="event.start_at">
          {{ event.formattedFromDatetime }}
        </time>
        <router-link :to="event.route">
          <ETitle el="h4" size="xs" class="eventTitle">
            {{ event.title }}
          </ETitle>
        </router-link>
      </header>
      <section>
        <EventButtons :event="event" />
      </section>
    </div>
  </article>
</template>

<style scoped>
.EventCard {
  display: flex;
  padding: var(--p-3) 0;
  border-top: 1px solid var(--gray-500);
}
.EventCard:last-child {
  /* border-bottom: 1px solid var(--gray-500); */
}

.EventCard figure {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: var(--rounded-md);
  background-color: var(--gray-500);
  overflow: hidden;
}
.EventCard figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.EventCard .content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.EventCard header {
  display: flex;
  flex-direction: column;
}
.EventCard,
.EventCard.vertical .content {
  gap: var(--gap-3);
}
.EventCard.vertical section > *:first-child {
  order: 2;
}
.EventCard section {
  display: flex;
  gap: var(--gap-3);
  flex-shrink: 0;
}
.EventCard time {
  color: var(--gray-300);
}
.eventTitle {
  color: var(--fg);
}
/* @TODO: Add breakpoints system */
@media only screen and (max-width: 599px) {
  .EventCard section {
    margin-top: var(--m-3);
  }
}

@media only screen and (min-width: 600px) {
  .EventCard.horizontal .content {
    flex-grow: 1;
    flex-direction: row;
    justify-content: space-between;
  }

  .EventCard section {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
