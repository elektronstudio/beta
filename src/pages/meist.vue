<script setup lang="ts">
import { ref } from "vue";
import { getAboutPage } from "../utils";
import ContentBlocks from "../components/ContentBlocks.vue";

const cards = ref<any>(null);
const data = await getAboutPage();
console.log(data);
cards.value = data.data.attributes.cards;
</script>

<template>
  <main class="Page About">
    <ContentBlocks v-if="cards" :cards="cards" />
  </main>
</template>
