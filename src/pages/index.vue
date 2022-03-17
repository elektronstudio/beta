<script setup lang="ts">
import { useFrontPage } from "@/utils";
import { ref } from "vue";
import IconSpeakerOff from "~icons/radix-icons/speaker-off";
import IconSpeakerLoud from "~icons/radix-icons/speaker-loud";

const page = useFrontPage();

const muted = ref<boolean | undefined>(true);

const handleMute = () => {
  muted.value = !muted.value;
};
</script>
<template>
  <div class="Page">
    <ETitle
      size="lg"
      class="about"
      v-html="page?.data.attributes.description"
    />
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
    <button class="muteButton" @click="handleMute">
      <IconSpeakerOff v-if="muted" />
      <IconSpeakerLoud v-else />
    </button>
  </div>
</template>

<style scoped>
.Page {
  position: relative;
}
.about {
  position: absolute;
  padding: var(--p-5);
  z-index: 1;
  color: var(--gray-300);
  mix-blend-mode: difference;
}
.video {
  width: 100%;
  height: calc(100vh - var(--h-9) * 2);
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
  .video {
    height: calc(100vh - var(--h-9));
  }
  .muteButton {
    position: absolute;
    bottom: var(--p-3);
  }
}
</style>
