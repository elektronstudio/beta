<!-- @TODO: temporary component, remove this -->
<script setup lang="ts">
import { computed, ref } from "vue";
import NavLive from "./NavLive.vue";
import { lang } from "@/utils";

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
      <RouterLink to="/" class="menuItem homeButton" @click="navState = false">
        <ELogo el="span" />
      </RouterLink>
    </div>
    <nav class="menu" :class="{ navActive: navState }">
      <RouterLink
        v-for="item in navItems"
        class="menuItem"
        :key="item.name"
        :to="item.path"
        @click="navState = false"
      >
        {{ [item.name_english, item.name_estonian][lang] }}
      </RouterLink>
    </nav>
    <NavLive />
    <button class="toggleNav" @click="navState = !navState">
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
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
  position: relative;
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
  color: var(--gray-300);
  width: var(--w-7);
  margin: var(--p-1) var(--p-3);
}

.topBar {
  margin-left: calc(var(--border-DEFAULT) * -1);
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
