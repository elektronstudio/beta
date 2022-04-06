<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { randomName, l } from "@/utils";
import { ref, watch } from "vue";
import EDialog from "./EDialog.vue";

const userName = useStorage("elektron_user_name", randomName());
const setUserName = ref<string>(userName.value);
const dialogState = ref<boolean>(false);

watch(setUserName, (newName) => {
  userName.value = newName;
});
</script>

<template>
  <Transition name="dialog">
    <EDialog
      v-if="dialogState"
      class="UserInfo"
      :title="l('Your username', 'Sinu kasutajanimi')"
      :dialog-state="dialogState"
      @close-dialog="dialogState = false"
    >
      <EInput v-model="setUserName" />
    </EDialog>
  </Transition>
  <EDraggableTitlebar
    :title="userName"
    class="userTab"
    @click="dialogState = !dialogState"
  >
    <span class="userIndicator" />
  </EDraggableTitlebar>
</template>

<style scoped>
.UserInfo {
  position: fixed;
  bottom: var(--gap-7);
  right: var(--gap-2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  transform: scale(1);
  transform-origin: bottom right;
}
.UserInfo :deep(article) {
  padding: var(--p-4);
}
.UserInfo :deep(.EInput) {
  margin-bottom: 0;
}
.EDraggableTitlebar.userTab {
  position: fixed;
  bottom: 0;
  width: var(--dock-item-size);
  right: var(--gap-3);
  z-index: 1000;
  border: 1px solid var(--gray-500);
  border-bottom: 0;
  cursor: pointer;
}
.userIndicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: var(--gap-1);
  display: block;
  width: var(--w-3);
  height: var(--h-3);
  border-radius: var(--rounded-full);
  background-color: var(--accent);
}
.dialog-enter-active,
.dialog-leave-active {
  transition: 0.4s ease-in-out;
  border: 1px solid var(--gray-500);
}

.dialog-enter-from,
.dialog-leave-to {
  transform: scale(0);
}

.dialog-enter-active :deep(*),
.dialog-leave-active :deep(*) {
  opacity: 0;
}
</style>
