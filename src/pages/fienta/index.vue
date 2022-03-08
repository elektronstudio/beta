<script setup lang="ts">
import { ref } from "vue";
import { validateTicket } from "elektro";

const url = new URLSearchParams(window.location.search);
const urlCode = url.get("code");

const validate = (code: string) => {
  validateTicket(code).finally(() => {
    window.location.href = `https://live.elektron.art/fienta?code=${code}`;
  });
};

if (urlCode) {
  validate(urlCode);
}

const code = ref("");

const onSubmit = () => {
  if (code.value) {
    validate(code.value);
  }
};
</script>

<template>
  <div class="fienta">
    <div>
      <ETitle size="lg">Validate your ticket</ETitle>
      <EContent>
        There is a <b>ticket code</b> in your Fienta email, just below the
        "Sisene üritusele / Enter event" blue button. Copy-paste it to the box
        below:
      </EContent>
      <EFormText v-model="code" label="Ticket code" />
      <EButton color="accent" size="sm" @click="onSubmit">
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
