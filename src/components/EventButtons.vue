<script setup lang="ts">
import { Event, l } from "@/utils";
import IconArrowRight from "~icons/radix-icons/arrow-right";

type Props = {
  event: Event;
};

const { event } = defineProps<Props>();
</script>

<template>
  <router-link :to="event.route">
    <EButton size="xs" el="a" color="transparent">
      <IconArrowRight />
      {{ l("Read more", "Loe lähemalt") }}
    </EButton>
  </router-link>
  <EButton
    v-if="event.userCanBuyTicket"
    el="a"
    size="xs"
    color="accent"
    target="_blank"
    :href="event.ticketUrl"
  >
    <IconArrowRight />
    {{ l("Get a ticket", "Osta pilet") }}
  </EButton>
</template>
