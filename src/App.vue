<script setup lang="ts">
const navItems = [
  {
    name: "elektron",
    path: "/",
  },
  {
    name: "Kava",
    path: "/kava",
  },
  {
    name: "Festival 2022",
    path: "/festival",
  },
  {
    name: "Projektid",
    path: "/projektid",
  },
  {
    name: "Meist",
    path: "/meist",
  },
  {
    name: "Podcast",
    path: "/signal",
  },
  {
    name: "Live (todo)",
    path: "",
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
