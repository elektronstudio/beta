<script setup lang="ts">
import IconArrowLeft from "~icons/radix-icons/arrow-left";
import IconArrowRight from "~icons/radix-icons/arrow-right";
import { useEventBySlug, l } from "@/utils";

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);
</script>

<template>
  <article v-if="event" class="Page SingleProduction">
    <header>
      <div class="title">
        <router-link
          v-if="event.project"
          custom
          :to="event.projectRoute"
          v-slot="{ href, navigate }"
        >
          <EButton
            size="xs"
            el="a"
            color="transparent"
            :href="href"
            @click="navigate"
          >
            <IconArrowLeft />
            {{ event.project.title }}
          </EButton>
        </router-link>
        <ETitle el="h2" size="lg" :title="event.title" />
      </div>
      <h4 v-if="event.authors">{{ event.authors }}</h4>

      <!-- @TODO: Add locale based conditionals -->
      <EContent
        v-if="event.intro"
        class="Description"
        size="lg"
        :content="event.intro"
      />
      <div
        v-if="
          event.live &&
          (event.ticketUrl ||
            event.liveRoute ||
            event.live_url ||
            event.userHasLiveAccess)
        "
        class="buttons"
      >
        <EButton
          v-if="event.userHasLiveAccess"
          size="sm"
          el="a"
          :color="event.urgency === 'now' ? 'accent' : ''"
          :href="event.liveRoute || event.live_url"
        >
          <IconArrowRight />
          <template v-if="event.urgency === 'now'">
            {{ l("Live!", "Live!") }}
          </template>
          <template v-else-if="event.urgency === 'soon'">
            {{ l("Event starts in: ", "Üritus algab: ") }}
            {{ event.formattedDistance }}
          </template>
          <template v-else>
            {{ l("View event", "Vaata üritust") }}
          </template>
        </EButton>
        <EButton
          v-else-if="event.userCanBuyTicket"
          size="sm"
          el="a"
          color="accent"
          :href="event.ticketUrl"
        >
          <IconArrowRight />
          {{ l("Get ticket", "Osta pilet") }}
        </EButton>
      </div>
    </header>
    <EImageSlider v-if="event.images" :images="event.images" />
    <main>
      <EBox class="MainContent">
        <!-- @TODO: Add metadata -->
        <EDetailsList v-if="event.details" :details="event.details" />
        <EContent :content="event.description" />
      </EBox>
      <!-- <EBox
        v-if="event.upcomingEvents || event.press"
        class="SideContent"
        el="aside"
      >
      </EBox> -->
    </main>
  </article>
</template>

<style scoped>
.Page.SingleProduction header,
.Page.SingleProduction main {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
  padding: var(--p-4);
  color: var(--gray-300);
}

.Page.SingleProduction header {
  grid-template-areas:
    "title"
    "subtitle"
    "description"
    "buttons";
}
.Page.SingleProduction main {
  align-content: start;
  grid-template-areas:
    "main"
    "side";
}

.Page.SingleProduction header .title {
  grid-area: title;
}

.Page.SingleProduction header h4 {
  grid-area: subtitle;
  align-self: end;
}

.Page.SingleProduction header .Description {
  grid-area: description;
}

.MainContent {
  align-self: start;
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
}
.SideContent {
  grid-area: side;
  align-self: start;
}
.SideContent h3 {
  margin-bottom: var(--m-6);
}
.SideContent h3:not(:first-child) {
  margin-top: var(--m-8);
}

.buttons {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--gap-5);
  grid-area: buttons;
}

/* @TODO: Add breakpoints system */
@media only screen and (max-width: 599px) {
  .EContent.Description :deep(p) {
    font-size: var(--text-xl);
  }
}
@media only screen and (min-width: 600px) {
  .Page.SingleProduction header,
  .Page.SingleProduction main {
    grid-template-columns: repeat(4, 1fr);
  }
  .Page.SingleProduction header {
    grid-template-areas:
      "title description description buttons"
      "subtitle description description buttons";
  }

  .Page.SingleProduction main {
    grid-template-areas: "main main main main" "side side side side";
  }
  .MainContent {
    grid-template-areas: "details content";
    grid-template-columns: 2fr 3fr;
  }
  .MainContent .EDetailsList {
    grid-area: details;
  }
  .MainContent .EContent {
    grid-area: content;
  }
}
@media only screen and (min-width: 1240px) {
  .Page.SingleProduction header,
  .Page.SingleProduction main {
    grid-template-columns: repeat(8, 1fr);
  }
  .Page.SingleProduction header {
    grid-template-areas:
      "title title description description description description buttons buttons"
      "subtitle subtitle description description description description buttons buttons";
  }
  .Page.SingleProduction main {
    grid-template-areas: "main main main main main side side side";
  }
}
</style>
