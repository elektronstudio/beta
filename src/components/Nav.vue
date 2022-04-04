<!-- @TODO: temporary component, remove this -->
<script setup lang="ts">
import { computed, ref } from "vue";
import IconHamburgerMenu from "~icons/radix-icons/hamburger-menu";
import NavLive from "./NavLive.vue";
import { l } from "@/utils";

type Props = {
  navItems: {
    name_english: string;
    name_estonian: string;
    path: string;
  }[];
};
const { navItems } = defineProps<Props>();

const navState = ref(false);
const menuItemsLength = computed(() => (navItems ? navItems.length + 1 : 0));
</script>

<template>
  <Transition appear>
    <header v-if="!$route.fullPath.endsWith('/live')" class="Nav">
      <RouterLink to="/" class="menuItem homeButton" @click="navState = false">
        <ELogo el="span" />
      </RouterLink>
      <nav class="menu" :class="{ navActive: navState }">
        <RouterLink
          v-for="item in navItems"
          class="menuItem"
          :key="item.path"
          :to="item.path"
          @click="navState = false"
        >
          {{ l(item.name_english, item.name_estonian) }}
        </RouterLink>
        <!-- @TODO: Consider using client-side mediaQuery component -->
        <Lang class="menuItem languageSwitcher largeScreen" />
      </nav>
      <Lang class="menuItem languageSwitcher smallScreen" />
      <NavLive />
      <button class="toggleNav" @click="navState = !navState">
        <IconHamburgerMenu />
      </button>
    </header>
  </Transition>
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
  /* @TODO: This does not animate */
  /* transform does not allow position fixed children to position correctly */
  transform: none;
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
.languageSwitcher {
  margin-left: auto;
  width: 4rem;
}
.languageSwitcher.smallScreen {
  margin-right: calc(var(--border-DEFAULT) * -1);
}
.languageSwitcher.largeScreen {
  display: none;
}
.homeButton {
  display: inline-block;
  color: var(--gray-300);
  padding: var(--p-1) var(--p-3);
  border: var(--border-DEFAULT) solid var(--gray-500);
  margin-left: calc(var(--border-DEFAULT) * -1);
}
.toggleNav {
  border-left: var(--border-DEFAULT) solid var(--gray-500);
  display: grid;
  place-content: center;
  height: 100%;
  padding: var(--p-3);
}
.toggleNav svg {
  color: var(--gray-300);
  width: var(--w-7);
  height: var(--h-7);
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

  .menu > .menuItem:not(:first-child) {
    margin-top: calc(var(--border-DEFAULT) * -1);
  }
}
@media only screen and (min-width: 600px) {
  .homeButton {
    min-width: 8rem;
  }
  .menuItem {
    padding: var(--p-1);
  }
  .menuItem.router-link-active,
  .menuItem:hover {
    border-image: url("/images/bg-texture-xs.gif") 1;
    z-index: 2;
  }
  .languageSwitcher {
    margin-right: calc(var(--border-DEFAULT) * -1);
    margin-right: 0;
  }
  .toggleNav {
    border-left: 0;
  }
}
@media only screen and (min-width: 1000px) {
  .Nav {
    display: flex;
    transform: translateY(0);
    transition: transform 0.2s ease;
  }
  .menu {
    display: grid;
    flex-grow: 1;
    --menu-items-count: v-bind(menuItemsLength);
    grid-template-columns: repeat(var(--menu-items-count), 1fr);
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
  .menuItem {
    width: var(--menu-item-width);
  }
  .menu > .menuItem:not(:first-child) {
    margin-left: calc(var(--border-DEFAULT) * -1);
  }
  .languageSwitcher {
    margin-left: calc(var(--border-DEFAULT) * -1);
    margin-right: 0;
  }
  .homeButton {
    min-width: 10rem;
  }
  .toggleNav {
    display: none;
  }
  .languageSwitcher.smallScreen {
    display: none;
  }
  .languageSwitcher.largeScreen {
    display: inline-flex;
  }
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-100%);
}
</style>
