<script setup lang="ts">
import { computed, Ref, ref, watch, watchEffect } from "vue";
import {
  debouncedWatch,
  throttledWatch,
  useDraggable,
  useWindowSize,
  useMagicKeys,
  useNow,
} from "@vueuse/core";
import { safeJsonParse } from "elektro";
import type { Message } from "elektro";
import {
  userId,
  userName,
  userMessage,
  userPosition,
  draggableChatState,
  remap,
  useMessage,
} from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { differenceInSeconds } from "date-fns";
const router = useRouter();
const route = useRoute();

const { ws, sendMessage } = useMessage();

type DraggableChatUser = {
  userId: string;
  userName: string;
  x: number;
  y: number;
  chat: string;
  datetime: Date;
  idle?: number | undefined;
  opacity?: number | undefined;
};

const UPDATE_RATE_BASE = 1000;
const UPDATE_RATE_PER_USER = 200;
const USER_IDLE_LIMIT = 1000 * 60 * 5; // 5 min to fade out
const USER_IDLE_UPDATE_RATE = 1000 * 10; // 10 sec for each idleness check

const ANIMATION_RATE = 500;
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
        datetime: message.datetime,
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
    preventDefault: true,
    onEnd: ({ x, y }) =>
      (userPosition.value = { x: Math.floor(x), y: Math.floor(y) }),
  });

  const { width, height } = useWindowSize();
  const center = computed(() => {
    return { x: width.value / 2, y: height.value / 2 };
  });

  const chat = ref("");

  const now = useNow({ interval: USER_IDLE_UPDATE_RATE });

  const otherUsers = computed(() =>
    users.value
      .map((u) => {
        u.idle = differenceInSeconds(now.value, new Date(u.datetime));
        u.opacity = remap(u.idle, 0, USER_IDLE_LIMIT / 1000, 1, 0);
        return u;
      }) //
      .filter((u) => {
        // TODO: Consider filtering out the idle ones
        // u.idle >= (USER_IDLE_LIMIT / 1000)
        return u.userId !== userId.value;
      }),
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
  <div
    class="DraggableChat"
    :class="{
      livePage: route.name === 'projects-project_slug-event_slug-live',
      chatActive: draggableChatState,
    }"
  >
    <div
      v-if="draggableChatState"
      :chat="{
        chatActive: draggableChatState,
      }"
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
      :style="{ ...otherUserStyle(user), opacity: user.opacity }"
      style="position: fixed; display: flex; gap: var(--gap-2); width: 200px"
    >
      <div class="userIndicator" :class="{ chatActive: draggableChatState }" />
      <div
        class="userContent"
        style="pointer-events: none; user-select: none"
        :style="{ opacity: draggableChatState ? 1 : 0 }"
      >
        <span class="userName">
          {{ user.userName }}
        </span>
        <span>{{ user.chat }}</span>
        <!-- <span>Idle for: {{ user.idle }}s</span>
        <span>Opacity: {{ user.opacity }}</span> -->
      </div>
    </div>
    <div
      ref="userRef"
      :style="userStyle"
      style="
        position: fixed;
        display: flex;
        gap: var(--gap-2);
        width: 200px;
        touch-action: none;
      "
    >
      <div
        class="userIndicator draggable"
        :class="{ chatActive: draggableChatState }"
      />
      <div class="userContent" :style="{ opacity: draggableChatState ? 1 : 0 }">
        <span class="userName">
          {{ userName }}
        </span>
        <span>{{ userMessage }}</span>
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
    </pre>-->
  </div>
</template>

<style scoped>
.DraggableChat {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
.DraggableChat.livePage:not(.chatActive) {
  opacity: 0;
}
.userIndicator {
  width: var(--w-4);
  height: var(--h-4);
  flex-shrink: 0;
  border-radius: 999999px;
  background-color: var(--gray-300);
}
.userIndicator.chatActive {
  pointer-events: none;
}
.userIndicator:not(.chatActive) {
  /* filter: blur(5px);
  opacity: 1;
  transform: scale(2); */
  background-color: transparent;
  border: 1px solid var(--accent);
}
.userContent {
  /* margin-top: -0.1em; */
}
.userContent span {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 1.2;
  display: block;
}
.userName {
  color: var(--gray-300);
}
.userIndicator.draggable:not(.chatActive) {
  pointer-events: none;
}
.userIndicator.draggable.chatActive {
  background-color: var(--accent);
}
</style>
