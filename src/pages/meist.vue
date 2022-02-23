<script setup lang="ts">
import { getAboutPage } from "../utils";
import ContentBlocks from "../components/ContentBlocks.vue";
import dataJson from "../data/about.json";
// const { data } = await getAboutPage();
const { data } = dataJson;
</script>

<template>
  <main class="Page About">
    <ContentBlocks
      v-if="data.attributes.cards"
      :cards="data.attributes.cards"
    />
  </main>
</template>
