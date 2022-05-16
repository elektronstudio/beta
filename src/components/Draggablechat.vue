<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { randomString, EFormTextArea } from "elektro";
import { useDraggableChat } from "../utils";

const userId = useStorage("elektron_user_id", randomString());
const userName = useStorage("elektron_user_name", randomString());

const { userRef, userStyle, otherUsers, otherUserStyle, chat, _users } =
  useDraggableChat("draggablechat", userId, userName);
</script>

<template>
  <div
    v-for="user in otherUsers"
    :style="otherUserStyle(user)"
    style="position: fixed; display: flex; gap: var(--gap-2); width: 200px"
  >
    <div
      style="
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 10000px;
        flex-shrink: 0;
        opacity: 0.5;
      "
    />
    <div
      style="
        opacity: 0.5;
        letter-spacing: 0.04em;
        pointer-events: none;
        user-select: none;
      "
    >
      {{ user.chat }}
    </div>
  </div>
  <div
    ref="userRef"
    :style="userStyle"
    style="position: fixed; display: flex; gap: var(--gap-2); width: 200px"
  >
    <div
      style="
        width: 20px;
        height: 20px;
        background: rgba(255, 0, 0, 0.7);
        border-radius: 10000px;
        flex-shrink: 0;
      "
    />
    <div style="letter-spacing: 0.04em">{{ chat }}</div>
  </div>
  <div
    style="position: fixed; left: var(--p-4); bottom: var(--p-4); width: 300px"
  >
    <EFormTextArea v-model="chat" />
  </div>
</template>
