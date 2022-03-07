<script setup lang="ts">
import { useAboutPage } from "../utils";
import ContentBlocks from "../components/ContentBlocks.vue";
const page = useAboutPage();
</script>

<template>
  <main class="Page About" v-if="page?.data.attributes.cards">
    <ContentBlocks :cards="page.data.attributes.cards" />
  </main>
</template>
