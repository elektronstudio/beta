<!-- @TODO: Move to Elektro -->
<script setup lang="ts">
import { l } from "@/utils";
import IconCross1 from "~icons/radix-icons/cross-1";
import EventButtons from "./EventButtons.vue";
import IconArrowRight from "~icons/radix-icons/arrow-right";
import { computed, ref } from "vue";

type Props = {
  event: any;
  dialogState: boolean;
  isEvent: boolean;
};

const { event, isEvent } = defineProps<Props>();
// @TODO: Consider using more solid comparison for pinned event
const label = computed(() => {
  if (isEvent && event?.value?.urgency === "soon") {
    return l("tulemas", "tulemas");
  } else if (isEvent && event?.value?.urgency === "now") {
    return l("live", "live");
  } else {
    return l("new", "uus");
  }
});
const emit = defineEmits<{
  (e: "close-dialog"): void;
}>();
</script>
<template>
  <EDialog
    v-if="event"
    class="ELivePreview"
    :title="label"
    :dialog-state="dialogState"
    @close-dialog="emit('close-dialog')"
  >
    <aside>
      <header>
        <ETitle v-if="isEvent && event.formattedDistance" el="h6" size="sm">
          {{ event.formattedDistance }}
        </ETitle>
        <ETitle el="h3" v-html="event.title" />
        <EContent :content="event.intro" el="div" />
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
    <EImage v-if="event.images?.[0]" :sizes="event.images[0].sizes" />
  </EDialog>
</template>

<style scoped>
.ELivePreview {
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
  width: 100%;
  max-width: 40rem;
}
.ELivePreview :deep(article) {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
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
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1;
}
.closeButton {
  position: absolute;
  right: var(--gap-2);
  top: var(--gap-2);
  z-index: 1;
  color: var(--gray-300);
}
.closeButton:hover {
  opacity: var(--opacity-60);
}

@media only screen and (min-width: 600px) {
  .ELivePreview :deep(article) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
