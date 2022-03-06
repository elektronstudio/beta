<script setup lang="ts">
import { icons } from "@iconify-json/radix-icons";
import { useEventBySlug } from "@/utils";

const arrowLeft = icons.icons["arrow-left"].body;
const arrowRight = icons.icons["arrow-right"].body;

type Props = {
  project_slug: string;
  event_slug: string;
};
const { event_slug } = defineProps<Props>();
const event = useEventBySlug(event_slug);
</script>

<!-- <template>
  <EStack v-if="event" style="padding: var(--p-5)">
    <RouterLink :to="event.projectRoute">&larr; Back to project</RouterLink>
    <ETitle size="lg">Event: {{ event.title }}</ETitle>
    <RouterLink :to="event.liveRoute">Watch live &rarr;</RouterLink>
    <EContent v-html="event.intro" />
  </EStack>
</template> -->

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
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-html="arrowLeft"
            ></svg>
            {{ event.project.title }}
          </EButton>
        </router-link>
        <ETitle el="h2" size="lg" :title="event.title" />
      </div>
      <h4 v-if="event.authors">{{ event.authors }}</h4>

      <!-- @TODO: Add locale based conditionals -->
      <EContent
        v-if="event.description_intro"
        class="Description"
        size="lg"
        :content="event.description_intro"
      />
    </header>
    <EImageSlider v-if="event.gallery" :images="event.gallery" />
    <main>
      <EBox class="MainContent">
        <!-- @TODO: Add metadata -->
        <EDetailsList v-if="event.details" :details="event.details" />
        <EContent :content="event.description_estonian" />
      </EBox>
      <EBox
        v-if="event.upcomingEvents || event.press"
        class="SideContent"
        el="aside"
      >
        <template v-if="event.upcomingEvents">
          <ETitle el="h3" size="lg" title="Etendused" />
          <template v-for="instance in event.upcomingEvents">
            <EEventInstance
              :title="instance.title"
              :start-at="instance.formattedFromDatetime"
              layout="vertical"
              :ticket-url="instance.ticketUrl"
            >
              <template #title>
                <router-link :to="`/projektid/${event.slug}/${instance.slug}`">
                  <ETitle el="h4" size="xs">{{ instance.title }}</ETitle>
                </router-link>
              </template>
              <template #buttons>
                <router-link :to="`/projektid/${event.slug}/${instance.slug}`">
                  <EButton size="xs" el="a" color="transparent">
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      v-html="arrowRight"
                    ></svg>
                    Loe lähemalt
                  </EButton>
                </router-link>
              </template>
            </EEventInstance>
          </template>
        </template>
        <!-- @TODO: Add press -->
        <!-- <template v-if="press">
          <ETitle el="h3" size="lg">Press</ETitle>
          <EPressItems :items="press" />
        </template> -->
      </EBox>
      <EBox
        v-if="event.ticketUrl || event.liveUrl"
        class="SideContent buttons"
        el="aside"
      >
        <EButton size="xs" el="a" color="transparent" :href="event.liveRoute">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            v-html="arrowRight"
          ></svg>
          Vaata üritust
        </EButton>
        <EButton
          v-if="event.ticketUrl"
          size="xs"
          el="a"
          color="accent"
          :href="event.ticketUrl"
        >
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            v-html="arrowRight"
          ></svg>
          Osta pilet
        </EButton>
      </EBox>
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
    "description";
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
  gap: var(--gap-5);
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
      "title description description description"
      "subtitle description description description";
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
      "title title description description description description . ."
      "subtitle subtitle description description description description . .";
  }
  .Page.SingleProduction main {
    grid-template-areas: "main main main main main side side side";
  }
}
</style>
