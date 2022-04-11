<script setup lang="ts">
import { useFrontPage, useProjects } from "@/utils";
import { computed, ref, watch } from "vue";
import IconSpeakerOff from "~icons/radix-icons/speaker-off";
import IconSpeakerLoud from "~icons/radix-icons/speaker-loud";
import EventPreview from "../components/EventPreview.vue";

const page = useFrontPage();

const muted = ref<boolean | undefined>(true);

const handleMute = () => {
  muted.value = !muted.value;
};

// @TODO: Get this value from Strapi
const pinnedEvent = "unusta";

const modalActive = ref<boolean>(true);
const { projects, firstUpcomingProject } = useProjects();

const upcomingEventSoon = computed(() => {
  if (
    firstUpcomingProject?.value?.urgency === "soon" ||
    firstUpcomingProject?.value?.urgency === "now"
  ) {
    return firstUpcomingProject.value;
  } else {
    return null;
  }
});

const pinnedProject = computed(() => {
  if (projects.value && pinnedEvent) {
    return projects.value.find((project: any) => project.slug === pinnedEvent);
  } else {
    return null;
  }
});
</script>
<template>
  <div class="Page">
    <div class="videoWrapper" :class="{ modalActive: modalActive }">
      <Transition>
        <ETitle
          v-if="!modalActive"
          size="lg"
          class="about"
          v-html="page?.data.attributes.description"
        />
      </Transition>
      <video
        v-if="page"
        class="video"
        :src="page.data.attributes.background.data.attributes.url"
        :muted="muted"
        autoplay
        playsinline
        webkit-playsinline
        preload="auto"
        loop
      />
      <Transition>
        <button v-if="!modalActive" class="muteButton" @click="handleMute">
          <IconSpeakerOff v-if="muted" />
          <IconSpeakerLoud v-else />
        </button>
      </Transition>
      <EventPreview
        v-if="modalActive"
        :key="upcomingEventSoon ? upcomingEventSoon.slug : pinnedProject?.slug"
        :event="upcomingEventSoon ? upcomingEventSoon : pinnedProject"
        :is-event="upcomingEventSoon ? true : false"
        @closeModal="modalActive = false"
      />
    </div>
  </div>
</template>

<style scoped>
.Page {
  position: relative;
}
.videoWrapper {
  /* @TODO: Add global navbutton size variable for consistency */
  height: calc(100vh - var(--h-9) * 2);
  overflow-y: auto;
  display: grid;
  place-content: center;
  overflow-y: auto;
  padding: var(--p-3);
}
.videoWrapper.modalActive > *:not(.ELivePreview) {
  filter: blur(8px);
  opacity: 0.6;
}
.about {
  position: absolute;
  top: 0;
  left: 0;
  /* @TODO: Add global gutter variables system for consistency */
  padding: var(--p-3);
  z-index: 1;
  color: var(--gray-300);
  mix-blend-mode: difference;
}
.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  touch-action: none;
}

.muteButton {
  position: fixed;
  right: var(--p-3);
  bottom: calc(var(--p-3) + var(--h-9));
}

@media only screen and (min-width: 600px) {
  .about {
    padding: var(--p-5);
  }
  .videoWrapper {
    height: calc(100vh - var(--h-9));
  }
  .muteButton {
    position: absolute;
    bottom: var(--p-3);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
