<script setup lang="ts">
import { Draggable, useLive, breakpoints } from "elektro";
import { ref } from "vue";
import DraggableContent from "@/components/DraggableContent.vue";
import IconArrowLeft from "~icons/radix-icons/arrow-left";

type Props = {
  data: Draggable[];
  // @TODO Proper type
  event: any;
};

const { data, event } = defineProps<Props>();

const draggablesState = ref<Draggable[]>(data);
const minimisedDraggables = ref<Draggable[]>([]);

const { updateDraggablesDesktop, updateDraggablesMobile } = useLive({
  data,
  draggablesState,
  minimisedDraggables,
});

const mobile = breakpoints.smaller("large");
</script>

<template>
  <EBreadBoard>
    <RouterLink v-if="event" :to="event.route" class="eventNav">
      <EButton size="xs" color="transparent" el="a">
        <IconArrowLeft />
        Back to event
      </EButton>
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
      :draggables="minimisedDraggables"
      @update-draggables="updateDraggablesMobile"
    />
    <EDraggablesDock
      v-else
      :draggables="minimisedDraggables"
      @update-draggables="updateDraggablesDesktop"
    />
  </EBreadBoard>
</template>

<style scoped>
.eventNav {
  z-index: 1000;
}
@media only screen and (max-width: 899px) {
  .eventNav {
    width: 100%;
    height: var(--h-6);
    background-color: var(--bg);
    border-bottom: 1px solid var(--gray-500);
  }
}
@media only screen and (min-width: 900px) {
  .eventNav {
    position: fixed;
    top: var(--p-2);
    left: var(--p-2);
  }
}
</style>
