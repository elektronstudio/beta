<script setup lang="ts">
import { ref } from "vue";

const url = new URLSearchParams(window.location.search);
const urlCode = url.get("code");

const redirect = (code: string) => {
  // window.location.href = `https://live.elektron.art/fienta?code=${code}`
  window.location.href = "https://live.elektron.art/saveukraine";
};

if (urlCode) {
  redirect(urlCode);
}

const code = ref(urlCode || "");

const onSubmit = () => {
  if (code.value) {
    redirect(code.value);
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
