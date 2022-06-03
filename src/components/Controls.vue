<script setup lang="ts">
type Props = {
  data: any;
};

const { data } = defineProps<Props>();
</script>

<template>
  <pre>{{ data }}</pre>
</template>
