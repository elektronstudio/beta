<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { EButton, randomString, useChat } from "elektro";
import { randomName, l } from "@/utils";

const userId = useStorage("elektron_user_id", randomString());
const userName = useStorage("elektron_user_name", randomName());
</script>

<template>
  <nav class="UserInfo">
    <span class="userName">{{ userName }}</span>
    <span class="userIndicator"></span>
  </nav>
</template>

<style scoped>
.UserInfo {
  position: fixed;
  bottom: var(--gap-2);
  right: var(--gap-2);
  z-index: 1000;
  display: flex;
  align-items: center;
}
.UserInfo:hover .userName {
  opacity: 1;
  pointer-events: auto;
}
.userIndicator {
  display: block;
  width: var(--w-4);
  height: var(--h-4);
  border-radius: var(--rounded-full);
  background-color: var(--accent);
}

.userName {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--gray-300);
  margin-right: var(--gap-2);
  line-height: 1;
  pointer-events: none;
  opacity: 0;
  /* @TODO: Add transition variables */
  transition: opacity 0.3s ease-in-out;
}
</style>
