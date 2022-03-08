import { useStorage } from "@vueuse/core";

// TODO: Add typings
// TODO: Consider using vue-i18n

export const lang = useStorage("elektron_lang", 0);

export function switchLang() {
  lang.value = 1 - lang.value;
}

export function l(str: string, ...rest: string[]) {
  const strs = [...arguments];
  return strs[lang.value];
}
