<script setup lang="ts">
import { useProjectBySlug, l } from "@/utils";
import IconArrowLeft from "~icons/radix-icons/arrow-left";
import IconArrowRight from "~icons/radix-icons/arrow-right";

type Props = {
  project_slug: string;
};
const { project_slug } = defineProps<Props>();
const project = useProjectBySlug(project_slug);
</script>

<template>
  <article v-if="project" class="Page SingleProduction">
    <header>
      <div class="title">
        <router-link custom to="/projects" v-slot="{ href, navigate }">
          <EButton
            size="xs"
            el="a"
            color="transparent"
            :href="href"
            @click="navigate"
          >
            <IconArrowLeft />
            {{ l("Projects", "Projektid") }}
          </EButton>
        </router-link>
        <ETitle el="h2" size="lg" :title="project.title" />
      </div>

      <!-- @TODO: Add locale based conditionals -->
      <EContent
        v-if="project.intro"
        class="Description"
        size="lg"
        :content="project.intro"
      />
    </header>
    <EImageSlider v-if="project.gallery" :images="project.gallery" />
    <main>
      <EBox class="MainContent">
        <!-- @TODO: Add metadata -->
        <!-- @TODO: Do projects have details? -->
        <EDetailsList v-if="project.details" :details="project.details" />
        <EContent :content="project.description" />
      </EBox>
      <EBox
        v-if="project.upcomingEvents || project.press"
        class="SideContent"
        el="aside"
      >
        <template v-if="project.upcomingEvents">
          <ETitle el="h3" size="lg" :title="l('Events', 'Üritused')" />
          <template v-for="event in project.upcomingEvents">
            <EventCard
              :title="event.title"
              :start-at="event.formattedFromDatetime"
              layout="vertical"
            >
              <template #title>
                <router-link :to="event.route">
                  <ETitle el="h4" size="xs">{{ event.title }}</ETitle>
                </router-link>
              </template>
              <template #buttons>
                <router-link :to="event.route">
                  <EButton size="xs" el="a" color="transparent">
                    <IconArrowRight />
                    {{ l("Read more", "Loe lähemalt") }}
                  </EButton>
                </router-link>
                <EButton
                  el="a"
                  size="xs"
                  color="accent"
                  target="_blank"
                  :href="event.ticketUrl"
                >
                  <IconArrowRight />
                  {{ l("Get a ticket", "Osta pilet") }}
                </EButton>
              </template>
            </EventCard>
          </template>
        </template>
        <!-- @TODO: Add press -->
        <!-- <template v-if="press">
          <ETitle el="h3" size="lg">Press</ETitle>
          <EPressItems :items="press" />
        </template> -->
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
