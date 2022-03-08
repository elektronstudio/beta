<script setup lang="ts">
// TODO: Find better UI / place for language switcher

import { watchEffect } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { switchLang } from "@/utils";

const { shift, l } = useMagicKeys();

watchEffect(() => {
  if (shift.value && l.value) {
    switchLang();
  }
});
</script>

<template>
  <EButton class="Lang" size="xs" color="transparent" @click="switchLang"
    >eng / est</EButton
  >
</template>

<style scoped>
.Lang {
  position: fixed;
  bottom: var(--p-1);
  left: var(--p-1);
}
</style>
