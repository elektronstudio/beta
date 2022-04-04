<script setup lang="ts">
// TODO: Move to elektro

import { ref } from "vue";
import IconMuted from "~icons/radix-icons/speaker-off";
import IconUnmuted from "~icons/radix-icons/speaker-loud";
import IconEnterFullscreen from "~icons/radix-icons/enter-full-screen";
import IconExitFullscreen from "~icons/radix-icons/exit-full-screen";
// Radix does not have PIP icons so we have to borrow them from Phospor set
import IconEnterPip from "~icons/ph/picture-in-picture";
import IconExitPip from "~icons/ph/picture-in-picture-fill";
import { useFullscreen } from "@vueuse/core";
import { useVideostream } from "elektro";
import { usePip } from "@/utils";

type Props = {
  src: string;
};
const { src } = defineProps<Props>();
const { videoRef, width, height, status } = useVideostream(src);
const { isPipAvailable, isPip, enterPip, exitPip } = usePip(videoRef);
// TODO: move to a Draggable feature
const videoWindowRef = ref<HTMLElement | null>(null);
const {
  isFullscreen,
  enter: enterFullscreen,
  exit: exitFullscreen,
} = useFullscreen(videoWindowRef);

const muted = ref(true);
</script>

<template>
  <div style="position: relative" ref="videoWindowRef" class="videoStream">
    <video
      ref="videoRef"
      :muted="muted"
      autoplay
      playsinline
      :width="width"
      :height="height"
      style="width: 100%"
    />
    <div style="position: absolute; bottom: var(--p-4); left: var(--p-4)">
      <slot />
    </div>
    <div
      style="
        position: absolute;
        bottom: var(--p-4);
        right: var(--p-4);
        display: flex;
        gap: var(--gap-2);
      "
    >
      <EButton
        v-if="muted"
        size="xs"
        color="transparent"
        @click="muted = !muted"
      >
        <IconMuted />
        Click to unmute
      </EButton>
      <EButton v-else size="xs" color="transparent" @click="muted = !muted">
        <IconUnmuted />
      </EButton>

      <EButton
        v-if="status === 'playing' && isPipAvailable && !isPip"
        size="xs"
        color="transparent"
        @click="enterPip"
      >
        <IconEnterPip />
      </EButton>
      <EButton
        v-if="status === 'playing' && isPipAvailable && isPip"
        size="xs"
        color="transparent"
        @click="exitPip"
      >
        <IconExitPip />
      </EButton>

      <EButton
        v-if="!isFullscreen"
        size="xs"
        color="transparent"
        @click="enterFullscreen"
      >
        <IconEnterFullscreen />
      </EButton>
      <EButton
        v-if="isFullscreen"
        size="xs"
        color="transparent"
        @click="exitFullscreen"
      >
        <IconExitFullscreen />
      </EButton>
    </div>
  </div>
</template>
