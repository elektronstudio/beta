<script setup lang="ts">
import UserInfo from "./components/UserInfo.vue";

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
</script>
<template>
  <Nav :navItems="navItems" />
  <!-- Wrap into <Suspense> if you want to use -->
  <!-- toplevel await it script setup -->
  <Suspense>
    <router-view :key="$route.fullPath" />
  </Suspense>
  <UserInfo />

  <EWindowBorder />
</template>
