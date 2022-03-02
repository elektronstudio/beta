<script setup lang="ts">
import { useRoute } from "vue-router";
import { useEventData } from "../../utils";
import { icons } from "@iconify-json/radix-icons";
const arrowLeft = icons.icons["arrow-left"].body;
const arrowRight = icons.icons["arrow-right"].body;

const { params } = useRoute();
const { data } = await useEventData(params.slug);
console.log(data.value.ticketUrl, data.value.liveUrl);
</script>

<template>
  <article class="Page SingleProduction">
    <header>
      <div class="title">
        <router-link
          v-if="data.project"
          custom
          :to="'/projektid/' + data.project.slug"
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
            {{ data.project.title }}
          </EButton>
        </router-link>
        <ETitle el="h2" size="lg" :title="data.title" />
      </div>
      <h4 v-if="data.authors">{{ data.authors }}</h4>

      <!-- @TODO: Add locale based conditionals -->
      <EContent
        v-if="data.description_intro"
        class="Description"
        size="lg"
        :content="data.description_intro"
      />
    </header>
    <EImageSlider v-if="data.gallery" :images="data.gallery" />
    <main>
      <EBox class="MainContent">
        <!-- @TODO: Add metadata -->
        <EDetailsList v-if="data.details" :details="data.details" />
        <EContent :content="data.description_estonian" />
      </EBox>
      <EBox
        v-if="data.upcomingEvents || data.press"
        class="SideContent"
        el="aside"
      >
        <template v-if="data.upcomingEvents">
          <ETitle el="h3" size="lg" title="Etendused" />
          <template v-for="instance in data.upcomingEvents">
            <EEventInstance
              :title="instance.title"
              :start-at="instance.formattedFromDatetime"
              layout="vertical"
              :ticket-url="instance.ticketUrl"
            >
              <template #title>
                <router-link :to="`/projektid/${data.slug}/${instance.slug}`">
                  <ETitle el="h4" class="eventTitle">{{
                    instance.title
                  }}</ETitle>
                </router-link>
              </template>
              <template #buttons>
                <router-link :to="`/projektid/${data.slug}/${instance.slug}`">
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
        v-if="data.ticketUrl || data.liveUrl"
        class="SideContent buttons"
        el="aside"
      >
        <EButton
          v-if="data.liveUrl"
          size="xs"
          el="a"
          color="transparent"
          :href="data.liveUrl"
        >
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
          v-if="data.ticketUrl"
          size="xs"
          el="a"
          color="accent"
          :href="data.ticketUrl"
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

.eventTitle {
  margin-bottom: var(--m-2);
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
