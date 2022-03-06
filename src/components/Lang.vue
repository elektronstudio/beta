<script setup lang="ts">
// TODO: Add actual UI

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

<template></template>
