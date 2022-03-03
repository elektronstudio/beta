<script setup lang="ts">
import { useRoute } from "vue-router";
import SingleEvent from "../../../components/SingleEvent.vue";
import { useEventBySlug } from "../../../utils";

const { params } = useRoute();
const { event } = await useEventBySlug(params.event as string);
</script>

<template>
  <SingleEvent :data="event" />
</template>
