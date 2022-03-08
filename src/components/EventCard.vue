<script setup lang="ts">
type Props = {
  title?: string;
  startAt: string;
  layout?: "vertical" | "horizontal";
};

const { startAt, layout = "horizontal" } = defineProps<Props>();
</script>

<template>
  <div class="EventCard" :class="layout">
    <header>
      <time :datetime="startAt">{{ startAt }}</time>
      <slot name="title" />
    </header>
    <section>
      <slot name="buttons" />
      <!-- TODO: Bring buttons here and use event.ticketableStatus -->
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
