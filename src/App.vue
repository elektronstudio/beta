<script setup lang="ts">
import { useCssVar, useIdle } from "@vueuse/core";
import { onMounted, watch } from "vue";
import UserInfo from "./components/UserInfo.vue";
import { useWindowSize } from "@vueuse/core";
import Draggablechat from "./components/Draggablechat.vue";

const navItems = [
  {
    name_english: "Schedule",
    name_estonian: "Kava",
    path: "/schedule",
  },
  // {
  //   name: "KVF 2022",
  //   path: "/festival",
  // },
  {
    name_english: "Projects",
    name_estonian: "Projektid",
    path: "/projects",
  },
  {
    name_english: "WTF elektron",
    name_estonian: "Meist",
    path: "/about",
  },
  {
    name_english: "Podcast",
    name_estonian: "Podcast",
    path: "/podcast",
  },
];

const { idle } = useIdle(3000); // 3 seconds idle
const { height } = useWindowSize();
const appHeight = useCssVar("--app-height");
watch(height, (newHeight) => (appHeight.value = `${newHeight}px`), {
  immediate: true,
});
</script>
<template>
  <main :class="{ idle: idle }">
    <Nav :navItems="navItems" />
    <Suspense>
      <router-view :key="$route.fullPath" />
    </Suspense>
    <!-- <UserInfo /> -->
    <EWindowBorder />
    <!-- <DraggableChat /> -->
  </main>
</template>
