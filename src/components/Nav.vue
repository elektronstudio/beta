<!-- @TODO: temporary component, remove this -->
<script setup lang="ts">
import { computed, ref } from "vue";
import NavLive from "./NavLive.vue";
type Props = {
  navItems: {
    name: string;
    path: string;
  }[];
};
const { navItems } = defineProps<Props>();

const navState = ref(false);
const menuItemsLength = computed(() => (navItems ? navItems.length : 0));
</script>

<template>
  <header class="Nav">
    <div class="topBar">
      <RouterLink to="/" class="homeButton">
        <ELogo el="span" />
      </RouterLink>
    </div>
    <nav class="menu" :class="{ navActive: navState }">
      <RouterLink
        v-for="item in navItems"
        class="menuItem"
        :key="item.name"
        :to="item.path"
      >
        {{ item.name }}
      </RouterLink>
    </nav>
    <NavLive />
    <!-- @TODO: Add proper icon you html hacker :) -->
    <button class="toggleNav" @click="navState = !navState">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<style scoped>
.Nav {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--h-9);
  border: var(--border-DEFAULT) solid var(--gray-500);
  background-color: var(--bg);
}
.menu {
  display: none;
  flex-direction: column;
  background-color: var(--bg);
}
.menuItem {
  display: inline-flex;
  height: var(--h-9);
  padding: var(--p-1) var(--p-3);
  border: var(--border-DEFAULT) solid var(--gray-500);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--gray-300);
}

.menuItem:not(:first-child) {
  margin-top: calc(var(--border-DEFAULT) * -1);
}
.homeButton {
  display: inline-block;
  color: var(--gray-300);
  padding: var(--p-1) var(--p-3);
}
.toggleNav {
  display: grid;
  row-gap: 4px;
  width: var(--w-7);
  margin: var(--p-1) var(--p-3);
}
.toggleNav span {
  width: 100%;
  height: 2px;
  background-color: var(--gray-300);
}

/* @TODO: Add breakpoints system */
@media only screen and (max-width: 599px) {
  .menu.navActive {
    display: flex;
  }
}
@media only screen and (max-width: 999px) {
  .menu.navActive {
    display: grid;
    position: fixed;
    top: var(--h-9);
    width: 100%;
    margin-top: calc(var(--border-DEFAULT) * -1);
    z-index: 100;
  }
}
@media only screen and (min-width: 600px) {
  .homeButton {
    min-width: 8rem;
  }
  .menuItem {
    padding: var(--p-1);
  }
  .menuItem:not(:first-child) {
    margin-top: 0;
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
  .menuItem.router-link-active,
  .menuItem:hover {
    border-image: url("/images/bg-texture-xs.gif") 1;
    z-index: 2;
  }
}
@media only screen and (min-width: 1000px) {
  .Nav {
    display: flex;
  }
  .menu {
    display: grid;
    --menu-items-count: v-bind(menuItemsLength);
    grid-template-columns: repeat(var(--menu-items-count), 1fr);
    flex-grow: 1;
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
  .homeButton {
    min-width: 10rem;
  }
  .toggleNav {
    display: none;
  }
}
</style>
