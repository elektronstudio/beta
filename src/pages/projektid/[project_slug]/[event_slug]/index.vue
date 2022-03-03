<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <pre>Event</pre>
  <pre>{{ route }}</pre>
</template>
