<script setup lang="ts">
import { useVideostream } from "elektro";

// TODO: Move to elektro
type Props = {
  src: string;
};
const { src } = defineProps<Props>();
const { videoRef, width, height, status } = useVideostream(src);
</script>

<template>
  <div style="position: relative">
    <video
      ref="videoRef"
      muted
      autoplay
      controls
      :width="width"
      :height="height"
      style="width: 100%"
    />
    <div style="position: absolute; top: var(--p-2); left: var(--p-2)">
      <slot />
    </div>
  </div>
</template>
