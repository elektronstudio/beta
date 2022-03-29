<script setup lang="ts">
// TODO: Move to elektro
import IconMuted from "~icons/radix-icons/speaker-off";
import IconUnmuted from "~icons/radix-icons/speaker-loud";
import { useVideostream } from "elektro";
import { ref } from "vue";

type Props = {
  src: string;
};
const { src } = defineProps<Props>();
const { videoRef, width, height, status } = useVideostream(src);
const muted = ref(false);
</script>

<template>
  <div style="position: relative">
    <video
      ref="videoRef"
      :muted="muted"
      autoplay
      controls
      :width="width"
      :height="height"
      style="width: 100%"
    />
    <div style="position: absolute; top: var(--p-4); left: var(--p-4)">
      <slot />
    </div>
    <div style="position: absolute; top: var(--p-4); right: var(--p-4)">
      <EButton
        v-if="muted"
        size="xs"
        color="transparent"
        @click="muted = !muted"
      >
        <IconMuted />
        Click to unmute
      </EButton>
    </div>
  </div>
</template>
