<script setup lang="ts">
import { getAboutPage } from "../utils";
import ContentBlocks from "../components/ContentBlocks.vue";

const { data } = await getAboutPage();
</script>

<template>
  <main class="Page About">
    <ContentBlocks
      v-if="data.attributes.cards"
      :cards="data.attributes.cards"
    />
  </main>
</template>
