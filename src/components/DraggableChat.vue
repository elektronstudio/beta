<script setup lang="ts">
// TODO: Move to elektro

import { computed, Ref, ref, watchEffect } from "vue";
import { debouncedWatch, useDraggable, useWindowSize } from "@vueuse/core";
import { useMessage, safeJsonParse, EFormTextArea } from "elektro";
import type { Message } from "elektro";
import { useMagicKeys } from "@vueuse/core";
import { userId, userName, userMessage } from "@/utils";

const { ws, sendMessage } = useMessage();

type DraggableChatUser = {
  userId: string;
  userName: string;
  x: number;
  y: number;
  chat: string;
};

const UPDATE_RATE = 600; // TODO: Make it a function of user count
const ANIMATION_RATE = 300;
// https://cubic-bezier.com/#.48,.76,.78,.95
const ANIMATION_EASING = "cubic-bezier(.48,.76,.78,.95)";

function useDraggableChat(
  channel: string,
  userId: Ref<string>,
  userName: Ref<string>,
) {
  const users = ref<DraggableChatUser[]>([]);

  ws.addEventListener("message", ({ data }) => {
    const message = safeJsonParse(data);
    if (message.channel === channel && message.type === "DRAGGABLECHAT") {
      const user = {
        userId: message.userId,
        userName: message.userName,
        x: message.value.x,
        y: message.value.y,
        chat: userMessage.value,
      };
      const existingUserIndex = users.value?.findIndex((u) => {
        return u.userId === user.userId;
      });
      if (users.value && existingUserIndex > -1) {
        users.value[existingUserIndex] = user;
      } else {
        users.value = [...users.value, user];
      }
    }
  });

  const userRef = ref<HTMLElement | null>(null);

  const {
    x,
    y,
    style: userStyle,
  } = useDraggable(userRef, {
    // TODO: Initialize with random values
    initialValue: { x: 100, y: 100 },
  });

  const { width, height } = useWindowSize();
  const center = computed(() => {
    return { x: width.value / 2, y: height.value / 2 };
  });

  const chat = ref("");

  debouncedWatch(
    [x, y, chat],
    () => {
      const message: Message = {
        channel,
        type: "DRAGGABLECHAT",
        userId: userId.value,
        userName: userName.value,
        value: {
          x: x.value - center.value.x,
          y: y.value - center.value.y,
          chat: userMessage.value,
        },
      };
      sendMessage(message);
      // TODO: Store user locaction locally?
    },
    {
      immediate: true,
      debounce: UPDATE_RATE,
    },
  );

  const otherUsers = computed(() =>
    users.value.filter((u) => u.userId !== userId.value),
  );

  const otherUserStyle = (user: DraggableChatUser) => {
    const x = user.x + center.value.x;
    const y = user.y + center.value.y;
    return {
      top: `${y}px`,
      left: `${x}px`,
      transition: `all ${ANIMATION_RATE}ms ${ANIMATION_EASING}`,
    };
  };
  // TODO: Remove _users when done debugging
  return {
    center,
    userRef,
    userStyle,
    otherUsers,
    otherUserStyle,
    chat,
    _users: users,
  };
}

const { userRef, userStyle, otherUsers, otherUserStyle, chat } =
  useDraggableChat("draggablechat", userId, userName);

// @TODO: Remove then launch
const enabled = ref(false);

const active = ref(true);

const { shift, a, c } = useMagicKeys();
watchEffect(() => {
  if (shift.value && c.value) {
    enabled.value = !enabled.value;
  }
  if (shift.value && a.value) {
    active.value = !active.value;
  }
});
</script>

<template>
  <div v-if="enabled" style="transition: opacity linear 0.2">
    <div
      v-if="active"
      style="
        background: rgba(0, 0, 0, 0.8);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      "
    />
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
        "
        :style="{ opacity: active ? 0.5 : 0.1 }"
      />
      <div
        style="pointer-events: none; user-select: none"
        :style="{ opacity: active ? 1 : 0 }"
      >
        <div style="font-size: var(--text-xs); opacity: 0.3">
          {{ user.userName }}
        </div>
        <div style="opacity: 0.6">{{ user.chat }}</div>
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
          background: red;
          border-radius: 10000px;
          flex-shrink: 0;
        "
        :style="{ opacity: active ? 1 : 0.2 }"
      />
      <div :style="{ opacity: active ? 1 : 0 }">
        <div style="font-size: var(--text-xs); opacity: 0.5">
          {{ userName }}
        </div>
        <div style="letter-spacing: 0.04em">{{ userMessage }}</div>
      </div>
    </div>
  </div>
</template>
