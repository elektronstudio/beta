<script setup lang="ts">
import IconArrowRight from "~icons/radix-icons/arrow-right";
import { Event, l } from "@/utils";

type Props = {
  event: Event;
  layout?: "vertical" | "horizontal";
};

const { event, layout = "horizontal" } = defineProps<Props>();
</script>

<template>
  <div class="EventCard" :class="layout">
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
      <router-link :to="event.route">
        <EButton size="xs" el="a" color="transparent">
          <IconArrowRight />
          {{ l("Read more", "Loe lähemalt") }}
        </EButton>
      </router-link>
      <!-- TODO: use event.hasTicket -->
      <EButton
        v-if="event.ticketUrl && event.ticketableStatus !== 'HAS_TICKET'"
        el="a"
        size="xs"
        color="accent"
        target="_blank"
        :href="event.ticketUrl"
      >
        <IconArrowRight />
        {{ l("Get a ticket", "Osta pilet") }}
      </EButton>
    </section>
  </div>
</template>

<style scoped>
.EventCard {
  display: flex;
  padding: var(--p-3) 0;
  border-top: 1px solid var(--gray-500);
  flex-direction: column;
  align-items: flex-start;
}
.EventCard header {
  display: flex;
  flex-direction: column;
}
.EventCard.vertical {
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
  .EventCard.horizontal {
    flex-direction: row;
    justify-content: space-between;
  }

  .EventCard section {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
