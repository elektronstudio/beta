<script setup lang="ts">
// TODO: Remove this page when done testing
import { computed, ref } from "vue";
import { validateTicket, Ticketable, getTicketableStatus } from "elektro";
import { processEvent } from "@/utils";
import { useRouter } from "vue-router";

const code = ref("");
const router = useRouter();

const onSubmit = () => {
  if (code.value) {
    validateTicket(code.value).then((event: any) => {
      if (event) {
        // TODO: Remove this temporary festival -> project rename
        event.project = event.festival;
        event.festival = null;
        const { hiddenLiveRoute } = processEvent(event);
        router.push(hiddenLiveRoute);
      }
    });
  }
};
</script>

<template>
  <div class="Fienta">
    <ETitle size="lg">Fienta test page</ETitle>
    <EFormText v-model="code" label="Ticket code" />
    <EButton @click="onSubmit">Check ticket</EButton>
  </div>
</template>

<style scoped>
.Fienta {
  padding: var(--p-4);
}
</style>
