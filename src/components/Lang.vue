<script setup lang="ts">
// TODO: Find better UI / place for language switcher

import { watchEffect } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { switchLang, lang, l } from "@/utils";

const { shift, l: lKey } = useMagicKeys();

watchEffect(() => {
  if (shift.value && lKey.value) {
    switchLang();
  }
});

console.log(lang.value);
</script>

<template>
  <button @click="switchLang">
    {{ l("EST", "ENG") }}
  </button>
</template>

<style scoped>
.Lang {
  position: fixed;
  bottom: var(--p-1);
  left: var(--p-1);
}
</style>
