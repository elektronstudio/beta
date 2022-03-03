<script setup lang="ts">
const navItems = [
  {
    name: "Schedule",
    path: "/kava",
  },
  // {
  //   name: "KVF 2022",
  //   path: "/festival",
  // },
  {
    name: "Projects",
    path: "/projektid",
  },
  {
    name: "WTF Elektron",
    path: "/meist",
  },
  {
    name: "Podcast",
    path: "/signal",
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
  <EWindowBorder />
</template>
