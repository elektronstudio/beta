<script setup lang="ts">
const navItems = [
  {
    name: "Kava",
    path: "/kava",
  },
  {
    name: "Festival?",
    path: "/festival",
  },
  {
    name: "Projektid",
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
  <router-view />
  <EWindowBorder />
</template>
