<script setup lang="ts">
// TODO: Move to elektro

import { computed, Ref, ref, watch, watchEffect } from "vue";
import IconMuted from "~icons/radix-icons/speaker-off";
import IconUnmuted from "~icons/radix-icons/speaker-loud";
import IconEnterFullscreen from "~icons/radix-icons/enter-full-screen";
import IconExitFullscreen from "~icons/radix-icons/exit-full-screen";
import IconViewers from "~icons/radix-icons/eye-open";
// Radix does not have PIP icons so we have to borrow them from Phospor set
import IconEnterPip from "~icons/ph/picture-in-picture";
import IconExitPip from "~icons/ph/picture-in-picture-fill";
import { debouncedWatch, useFullscreen } from "@vueuse/core";
import { useMessage, useVideostream } from "elektro";
import { plausible, usePip, stats, statsSynced } from "@/utils";

const { sendMessage } = useMessage();

type Props = {
  streamurl: any;
  streamkey: any;
  viewers: any;
};
const { streamurl, streamkey } = defineProps<Props>();

const viewers = computed(() => {
  const stat = stats.value.find((s: any) => (s.streamkey = streamkey));
  //@ts-ignore
  return stat && stat.viewers ? stat.viewers : null;
});

const viewersSynced = computed(() => {
  const stat = statsSynced.value.find((s: any) => (s.streamkey = streamkey));
  //@ts-ignore
  return stat && stat.viewers ? stat.viewers : null;
});

const sync = ref(1);
const syncStat = () => {
  sendMessage({
    type: "STATS_SYNC",
    channel: "elektron",
    value: `${streamkey}: ${sync.value}`,
  });
};

debouncedWatch(sync, () => syncStat(), { debounce: 100 });

const { videoRef, width, height, status } = useVideostream(streamurl);
const { isPipAvailable, isPip, enterPip, exitPip } = usePip(videoRef);
const videoWindowRef = ref<HTMLElement | null>(null);
const {
  isFullscreen,
  enter: enterFullscreen,
  exit: exitFullscreen,
} = useFullscreen(videoWindowRef);

const muted = ref(true);
const volume = ref(0.8);

watch(volume, () => {
  if (videoRef.value) {
    videoRef.value.volume = volume.value;
    if (videoRef.value.volume === 0) {
      muted.value = true;
    }
    if (videoRef.value.volume > 0) {
      muted.value = false;
    }
  }
});

const trackedEnterPip = () => {
  enterPip();
  plausible.trackEvent("user_video_pip");
};

const trackedEnterFullscreen = () => {
  enterFullscreen();
  plausible.trackEvent("user_video_fullscreen");
};
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
    <div
      style="
        position: absolute;
        bottom: var(--p-4);
        left: var(--p-4);
        display: flex;
        gap: var(--gap-2);
        align-items: center;
        font-size: 0.8em;
        opacity: 0.5;
      "
    >
      <IconViewers v-if="viewers" />
      <div>{{ viewers }}</div>
      <slot />
    </div>
    <div class="controls">
      <EButton
        v-if="muted"
        size="xs"
        color="transparent"
        @click="muted = !muted"
      >
        <IconMuted />
        Click to unmute
      </EButton>
      <EButton
        v-if="!muted"
        size="xs"
        color="transparent"
        @click="muted = !muted"
      >
        <IconUnmuted />
      </EButton>
      <EFormRange v-if="!muted" v-model="volume" :max="1" step="any" />
      <EButton
        v-if="status === 'playing' && isPipAvailable && !isPip"
        size="xs"
        color="transparent"
        @click="trackedEnterPip"
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
        @click="trackedEnterFullscreen"
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

<style scoped>
.controls {
  position: absolute;
  bottom: var(--p-4);
  right: var(--p-4);
  display: flex;
  gap: var(--gap-2);
  opacity: 1;
  transition: 0.3s ease-in-out;
}
.idle .isMaximised .controls {
  opacity: 0;
}
.isMaximised .controls {
  bottom: var(--p-8);
  right: var(--p-4);
}
</style>
