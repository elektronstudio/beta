<script setup lang="ts">
const navItems = [
  {
    name: "elektro",
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
    name: "Signal podcast",
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
