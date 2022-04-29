import { useStorage } from "@vueuse/core";
import { computed } from "vue";

// TODO: Add typings
// TODO: Consider using vue-i18n

export const lang = useStorage("elektron_lang", 0);

export const locale = computed(() => {
  const locales = ["en", "et"];
  return locales[lang.value];
});

export function switchLang() {
  lang.value = 1 - lang.value;
}

export function l(str: string, ...rest: string[]) {
  const strs = [...arguments];
  return strs[lang.value];
}
