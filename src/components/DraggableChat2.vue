<script setup lang="ts">
import { computed, Ref, ref, watch, watchEffect } from "vue";
import {
  debouncedWatch,
  throttledWatch,
  useDraggable,
  useWindowSize,
  useMagicKeys,
} from "@vueuse/core";
import { useMessage, safeJsonParse } from "elektro";
import type { Message } from "elektro";
import {
  userId,
  userName,
  userMessage,
  userPosition,
  draggableChatState,
} from "@/utils";

const { ws, sendMessage } = useMessage();

type DraggableChatUser = {
  userId: string;
  userName: string;
  x: number;
  y: number;
  chat: string;
};

const UPDATE_RATE_BASE = 1000;
const UPDATE_RATE_PER_USER = 200;
const ANIMATION_RATE = 500;
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
        chat: message.value.chat,
      };
      const existingUserIndex = users.value?.findIndex((u) => {
        return u.userId === user.userId;
      });
      if (users.value && existingUserIndex > -1) {
        users.value[existingUserIndex] = user;
      } else {
        users.value.push(user);
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
    initialValue: userPosition.value,
    onEnd: ({ x, y }) =>
      (userPosition.value = { x: Math.floor(x), y: Math.floor(y) }),
  });

  const { width, height } = useWindowSize();
  const center = computed(() => {
    return { x: width.value / 2, y: height.value / 2 };
  });

  const chat = ref("");

  const otherUsers = computed(() =>
    users.value.filter((u) => u.userId !== userId.value),
  );

  const debounce = computed(
    () => UPDATE_RATE_BASE + users.value.length * UPDATE_RATE_PER_USER,
  );

  debouncedWatch(
    [x, y, userMessage],
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
    },
    {
      immediate: true,
      debounce: debounce.value,
    },
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
    debounce,
  };
}

const { debounce, userRef, userStyle, otherUsers, otherUserStyle, chat } =
  useDraggableChat("draggablechat", userId, userName);
</script>

<template>
  <div v-if="draggableChatState">
    <div
      style="
        background: rgba(0, 0, 0, 0.75);
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
        :style="{ opacity: draggableChatState ? 0.5 : 0.2 }"
      />
      <div
        style="pointer-events: none; user-select: none"
        :style="{ opacity: draggableChatState ? 1 : 0 }"
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
        :style="{ opacity: draggableChatState ? 1 : 0.2 }"
      />
      <div :style="{ opacity: draggableChatState ? 1 : 0 }">
        <div style="font-size: var(--text-xs); opacity: 0.5">
          {{ userName }}
        </div>
        <div style="letter-spacing: 0.04em">{{ userMessage }}</div>
      </div>
    </div>
    <!-- <pre
      style="
        position: fixed;
        top: 100px;
        left: 0;
        pointer-events: none;
        opacity: 0.3;
      "
    >
      debounce: {{ debounce }}
      {{ otherUsers }}
    </pre> -->
  </div>
</template>
