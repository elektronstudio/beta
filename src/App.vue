<script setup lang="ts">
import { useIdle } from "@vueuse/core";
import { onMounted, watch } from "vue";
import UserInfo from "./components/UserInfo.vue";
import { useWindowSize } from "@vueuse/core";

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

watch(
  height,
  (newHeight) => {
    document.documentElement.style.setProperty(
      "--app-height",
      `${newHeight}px`,
    );
  },
  { immediate: true },
);
</script>
<template>
  <main :class="{ idle: idle }">
    <Nav :navItems="navItems" />
    <!-- Wrap into <Suspense> if you want to use -->
    <!-- toplevel await it script setup -->
    <Suspense>
      <router-view :key="$route.fullPath" />
    </Suspense>
    <UserInfo />

    <EWindowBorder />
  </main>
</template>
