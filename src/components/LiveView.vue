<script setup lang="ts">
import { Draggable, useLive, breakpoints } from "elektro";
import { ref } from "vue";
import DraggableContent from "@/components/DraggableContent.vue";

type Props = {
  data: Draggable[];
};

const { data } = defineProps<Props>();

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
