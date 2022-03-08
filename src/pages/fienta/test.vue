<script setup lang="ts">
// TODO: Remove this page when done testing
import { computed, ref } from "vue";
import { validateTicket, Ticketable, getTicketableStatus } from "elektro";

const code = ref("");
const ticketable = ref<Ticketable | null>(null);

const onSubmit = () => {
  if (code.value) {
    validateTicket(code.value).then((t) => {
      ticketable.value = t;
    });
  }
};

const ticketableStatus = computed(() => {
  if (ticketable.value) {
    const ticketables: Ticketable[] = [
      ticketable.value,
      ticketable.value.festival,
    ];
    return getTicketableStatus(ticketables);
  }
});
</script>

<template>
  <div class="Fienta">
    <EStack>
      <ETitle size="lg">Fienta test page</ETitle>
      <EFormText v-model="code" label="Ticket code" />
      <EButton @click="onSubmit">Check ticket</EButton>
    </EStack>
    <EStack>
      <pre>{{ ticketableStatus }}</pre>
      <pre>{{ ticketable }}</pre>
    </EStack>
  </div>
</template>

<style scoped>
.Fienta {
  display: grid;
  gap: var(--gap-4);
  grid-template-columns: 1fr 5fr;
  padding: var(--p-4);
}
</style>
