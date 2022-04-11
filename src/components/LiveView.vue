<script setup lang="ts">
import { Draggable, useLive, breakpoints } from "elektro";
import { ref } from "vue";
import DraggableContent from "@/components/DraggableContent.vue";
import IconArrowLeft from "~icons/radix-icons/arrow-left";
import { computed } from "@vue/reactivity";
import { useIdle } from "@vueuse/core";

type Props = {
  data: Draggable[];
  // @TODO Proper type
  event: any;
};

const { data, event } = defineProps<Props>();

const draggablesState = ref<Draggable[]>(data);

const { updateDraggablesDesktop, updateDraggablesMobile } = useLive({
  data,
  draggablesState,
});

const mobile = breakpoints.smaller("large");

const draggableMaximised = computed(
  () => !!draggablesState.value.find((draggable) => draggable.isMaximised),
);
const { idle } = useIdle(3000); // 3 seconds idle
</script>

<template>
  <EBreadBoard>
    <RouterLink
      v-if="event"
      :to="event.route"
      :class="{ idle: idle }"
      class="backToEvent"
    >
      <IconArrowLeft />
      Back to event
    </RouterLink>
    <template v-if="mobile">
      <template
        v-for="draggable in draggablesState"
        :key="draggable.draggableId"
      >
        <EDraggableMobile
          :draggable="draggable"
          @update-draggables="updateDraggablesMobile"
        >
          <DraggableContent
            v-if="draggable.contentType"
            :content-type="draggable.contentType"
            :data="draggable.data"
          />
        </EDraggableMobile>
      </template>
    </template>
    <template v-else>
      <template
        v-for="draggable in draggablesState"
        :key="draggable.draggableId"
      >
        <EDraggable
          :draggable="draggable"
          @update-draggables="updateDraggablesDesktop"
        >
          <DraggableContent
            v-if="draggable.contentType"
            :content-type="draggable.contentType"
            :data="draggable.data"
          />
        </EDraggable>
      </template>
    </template>

    <EDraggablesDock
      v-if="mobile"
      :idle="idle"
      :draggable-maximised="draggableMaximised"
      :draggables="draggablesState"
      @update-draggables="updateDraggablesMobile"
    />
    <EDraggablesDock
      v-else
      :idle="idle"
      :draggable-maximised="draggableMaximised"
      :draggables="draggablesState"
      @update-draggables="updateDraggablesDesktop"
    />
  </EBreadBoard>
</template>

<style scoped>
.backToEvent {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  z-index: 1;
  display: flex;
  align-items: center;
}
.backToEvent svg {
  margin-right: var(--m-1);
  width: 1em;
  height: 1em;
}

@media only screen and (max-width: 899px) {
  .backToEvent {
    width: 100%;
    height: var(--h-6);
    background-color: var(--bg);
    border-bottom: 1px solid var(--gray-500);
    padding-left: var(--p-2);
    padding-right: var(--p-6);
  }
}
@media only screen and (min-width: 900px) {
  .backToEvent {
    position: fixed;
    top: var(--p-2);
    left: var(--p-2);
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    color: var(--gray-300);
  }
  .backToEvent.idle {
    opacity: 0;
  }
}
</style>
