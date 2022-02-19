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
  <Suspense><router-view /></Suspense>
  <EWindowBorder />
</template>
