<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProjectBySlug } from "../../../utils";
import SingleEvent from "../../../components/SingleEvent.vue";

const { params } = useRoute();
const { project } = useProjectBySlug(params.slug as string);
</script>

<template>
  <SingleEvent :data="project" />
</template>
