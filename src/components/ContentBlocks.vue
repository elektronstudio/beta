<script setup lang="ts">
import { formatMarkdown } from "../utils";

type Card = {
  id: number;
  __component:
    | "content.title"
    | "content.about-card"
    | "content.related-page"
    | "content.person-card"
    | "content.image-card"
    | "content.external-link";
  title: string;
  content: string;
  name?: string;
  url?: string;
  layout?: "columns1" | "columns2" | "columns3" | "columns4";
  image?: any;
  page?: {
    data: {
      attributes: {
        title: string;
        slug: string;
      };
    };
  };
};

type Props = {
  cards: Card[];
};

const { cards } = defineProps<Props>();
</script>

<template>
  <section class="ContentBlocks">
    <template v-for="item in cards">
      <ETitle
        v-if="item.__component === 'content.title'"
        el="h2"
        size="lg"
        :title="item.title"
      />
      <EAboutPageCard
        v-else-if="item.__component === 'content.about-card'"
        :layout="item.layout"
        :title="item.title"
        :content="formatMarkdown(item.content)"
      />
      <RouterLink
        v-else-if="
          item.__component === 'content.related-page' &&
          item.page?.data?.attributes.slug
        "
        :to="item.page?.data?.attributes.slug"
      >
        <ERelatedPageCard :title="item.title" />
      </RouterLink>
      <EExternallinkCard
        v-else-if="item.__component === 'content.external-link'"
        :title="item.title"
        :url="item.url"
      />
      <ETeamCard
        v-else-if="item.__component === 'content.person-card'"
        :thumbnail="
          item?.image?.data
            ? {
                sizes: Object.values(item.image.data.attributes.formats),
                alt: item.image.data.attributes.alternativeText,
              }
            : undefined
        "
        :name="item.name"
        :content="formatMarkdown(item.content)"
      />
      <EImageCard
        v-else-if="item.__component === 'content.image-card'"
        :sizes="Object.values(item.image.data.attributes.formats)"
        :alt="item.image.data.attributes.alternativeText"
      />
    </template>
  </section>
</template>

<style scoped>
.ContentBlocks {
  display: flex;
  flex-direction: column;
  gap: var(--gap-5);
  padding: var(--p-4);
  margin-bottom: var(--m-12);
}
.ContentBlocks > h2 {
  grid-column: 1 / -1;
  margin-top: var(--m-8);
}
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 600px) {
  .ContentBlocks {
    display: grid;
    grid-gap: var(--gap-5);
    grid-template-columns: repeat(2, 1fr);
  }
}
/* @TODO: Add breakpoints system */
@media only screen and (min-width: 1240px) {
  .ContentBlocks {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
