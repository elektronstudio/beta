<!-- @TODO: Move to Elektro -->
<script setup lang="ts">
import { l } from "@/utils";
import { computed } from "vue";
import IconCross1 from "~icons/radix-icons/cross-1";
import EventButtons from "./EventButtons.vue";
import IconArrowRight from "~icons/radix-icons/arrow-right";

type Props = {
  event: any;
  isEvent: boolean;
};

const { event, isEvent } = defineProps<Props>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();
</script>
<template>
  <div class="ELivePreview">
    <button class="closeButton" @click="emit('closeModal')">
      <IconCross1 />
    </button>

    <aside>
      <header>
        <ETitle v-if="event.formattedDistance" el="h6" size="sm">
          {{ event.formattedDistance }}
        </ETitle>
        <ETitle el="h3">{{ event.title }}</ETitle>
        <EContent :content="event.intro" />
      </header>
      <footer>
        <EventButtons v-if="isEvent" :event="event" />
        <template v-else>
          <router-link :to="`/projects/${event.slug}`">
            <EButton size="xs" el="a" color="transparent">
              <IconArrowRight />
              {{ l("View project", "Vaata projekti") }}
            </EButton>
          </router-link>
        </template>
      </footer>
    </aside>
    <img :src="event.thumbnail" />
  </div>
</template>

<style scoped>
.ELivePreview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column-reverse;
  border: 1px solid var(--gray-300);
  border-radius: var(--rounded-3xl);
  overflow: hidden;
  z-index: 10;
  background-color: var(--bg);
  width: calc(100% - var(--gap-3) * 2);
  max-width: 40rem;
}
.ELivePreview .ETitle {
  margin-bottom: var(--m-3);
}
.ELivePreview aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--p-3);
  color: var(--gray-300);
}
.ELivePreview aside header {
  font-family: font-title-regular, sans-serif;
  font-size: var(--text-3xl);
}
.ELivePreview aside header p span {
  color: var(--gray-300);
  width: 42%;
  display: inline-block;
}
.ELivePreview aside footer {
  display: flex;
  gap: var(--gap-5);
}
.ELivePreview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1;
}
.closeButton {
  position: absolute;
  right: var(--gap-2);
  top: var(--gap-2);
}

@media only screen and (min-width: 600px) {
  .ELivePreview {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
