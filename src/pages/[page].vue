<script setup lang="ts">
import { useRoute } from "vue-router";
import { getPage } from "../utils";
import { formatMarkdown } from "../utils";

const { params } = useRoute();

const data = await getPage(params.page as string);
const { attributes } = data.value;
</script>

<template>
  <article class="Page PageTemplate">
    <header>
      <ETitle el="h1" size="lg" :title="attributes.title" />
    </header>
    <main>
      <EBox class="MainContent">
        <EContent :content="formatMarkdown(attributes.content)" />
      </EBox>
    </main>
  </article>
</template>

<style scoped>
.Page.PageTemplate {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: var(--gap-5);
  padding: var(--p-4);
  color: var(--gray-300);
}

@media only screen and (min-width: 600px) {
  .Page.PageTemplate {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media only screen and (min-width: 1240px) {
}
</style>
