<script setup lang="ts">
// TODO: Move back to elektro
import { useStorage } from "@vueuse/core";
import { EButton, randomString, useChat } from "elektro";
import { randomName, l } from "@/utils";

type Props = {
  channel: string;
};

const userId = useStorage("elektron_user_id", randomString());
const userName = useStorage("elektron_user_name", randomName());

const { channel } = defineProps<Props>();

const {
  chatMessages,
  newChatMessage,
  onNewChatMessage,
  scrollRef,
  textareaRef,
  //@ts-ignore
} = useChat(channel, userId, userName);

const onUserNameChange = () => {
  const newName = window.prompt("Enter your name", userName.value);
  if (newName) {
    userName.value = newName;
  }
};
</script>

<template>
  <div class="EChat">
    <div class="messages" ref="scrollRef">
      <template v-for="message in chatMessages">
        <div v-if="message.value" class="message">
          <p v-if="message.userName" class="username">{{ message.userName }}</p>
          <p>{{ message.value }}</p>
        </div>
      </template>
    </div>
    <div class="messageBox">
      <!-- TODO: Make it work with ref -->
      <textarea
        class="chatTextarea"
        v-model="newChatMessage"
        ref="textareaRef"
        resize="none"
      />
      <EButton size="xs" color="accent" @click="onNewChatMessage">
        Saada
      </EButton>
    </div>
    <p class="name">{{ l("I am", "Nimi:") }} {{ userName }}</p>
    <EButton size="xs" color="transparent" el="a" @click="onUserNameChange">
      {{ l("Change", "Muuda") }}
    </EButton>
  </div>
</template>

<style scoped>
.EChat {
  display: flex;
  flex-direction: column;
  padding: var(--p-2);
  background-color: var(--bg);
  /* @TODO: Is this too much? */
  width: 100%;
  height: 100%;
}

.messages {
  flex-grow: 1;
  overflow-y: scroll;
}

.message {
  padding: var(--p-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.username {
  color: var(--gray-400);
}

/* TODO: add admin message class modifier */
.message:nth-child(4) {
  background-color: var(--accent);
}
.message:nth-child(4) p {
  color: var(--bg);
}
.message:nth-child(4) {
  background-color: var(--accent);
}

.messageBox {
  flex-shrink: 0;
  margin-bottom: 0;
  /* height: 2rem; */
  display: flex;
  align-items: flex-end;
}

.chatTextarea {
  flex-grow: 1;
  margin-right: var(--p-2);
  background-color: var(--bg);
  padding: 0 var(--p-3);
  resize: none;
  height: 1.6rem;
  border: 1px solid var(--gray-300);
  width: 100%;
}

.chatTextarea:focus {
  outline: none;
  border-color: var(--fg);
}
.chatTextarea:not(:disabled):hover {
  background-color: rgba(250, 250, 250, 0.1);
}

/* .chatTextarea:hover {
  outline: 1px solid var(--gray-500);
}
.chatTextarea:focus {
  outline: none;
  background-color: var(--gray-500);
} */

.EButton {
  /* margin-bottom: var(--m-2); */
}
.name {
  padding: var(--p-2) 0 0 var(--p-1);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gray-400);
}
.name-change {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--gray-400);
  text-decoration: underline;
}
</style>
