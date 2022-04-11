<script setup lang="ts">
import { ref } from "vue";
import { getTicketableStatus, processEvent, validateTicket } from "@/utils";
import { useRouter } from "vue-router";

const router = useRouter();

const url = new URLSearchParams(window.location.search);
const urlCode = url.get("code");
const code = ref(urlCode);

const onValidate = () => {
  // TODO: Remove temporary fallback
  // window.location.href = `https://live.elektron.art/fienta?code=${urlCode}`;
  if (code.value) {
    validateTicket(code.value).then((event: any) => {
      if (event) {
        console.log(getTicketableStatus([event, event.festival]));
        // TODO: Remove festival rename when on strapi4
        event.project = event.festival;
        event.festival = null;
        const { liveRoute } = processEvent(event);
        router.push(liveRoute);
      }
    });
    // TODO: Handle invalid ticket code
  }
};

// If there is a ?code parameter on page load, validate and redirect
if (code.value) {
  onValidate();
}
</script>

<template>
  <div class="fienta">
    <div>
      <ETitle size="lg">Validate your ticket</ETitle>
      <EContent>
        There is a <b>ticket code</b> in your Fienta email, just below the
        "Sisene üritusele / Enter event" blue button.<br /><br />Copy-paste the
        code to the box below:
      </EContent>
      <EFormText v-model="code" label="Ticket code" />
      <EButton color="accent" size="sm" @click="onValidate">
        Submit ticket code
      </EButton>
    </div>
  </div>
</template>

<style scoped>
.fienta {
  display: grid;
  justify-content: center;
  align-content: center;
  min-height: 80vh;
}
.fienta > div {
  width: 50vw;
  display: grid;
  gap: var(--gap-4);
}
.fienta .EButton {
  justify-self: flex-start;
}
@media only screen and (max-width: 600px) {
  .fienta {
    align-content: flex-start;
  }
  .fienta > div {
    width: 100%;
  }
}
</style>
