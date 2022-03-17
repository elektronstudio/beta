<!-- @TODO: Move to Elektro -->
<script setup lang="ts">
import { l } from "@/utils";
import IconArrowRight from "~icons/radix-icons/arrow-right";
import IconCross1 from "~icons/radix-icons/cross-1";

type Props = {
  project: any;
};

const { project } = defineProps<Props>();

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
        <ETitle el="h3">{{ project.title }}</ETitle>
        <EContent :content="project.intro" />
      </header>
      <footer>
        <router-link :to="`/projects/${project.slug}`">
          <EButton size="xs" el="a" color="transparent">
            <IconArrowRight />
            {{ l("View project", "Vaata projekti") }}
          </EButton>
        </router-link>
      </footer>
    </aside>
    <img :src="project.thumbnail" />
  </div>
</template>

<style scoped>
.ELivePreview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--gray-300);
  border-radius: var(--rounded-3xl);
  overflow: hidden;
  aspect-ratio: 2 / 1;
  z-index: 10;
  background-color: var(--bg);
  width: 100%;
  max-width: 36rem;
}
.ELivePreview .ETitle {
  margin-bottom: var(--m-2);
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
}

.closeButton {
  position: absolute;
  right: var(--gap-2);
  top: var(--gap-2);
}
</style>
