import { useStorage } from "@vueuse/core";

// TODO: Add typings
// TODO: Consider using vue-i18n

export const lang = useStorage("elektron_lang", 0);

export const switchLang = () => (lang.value = 1 - lang.value);
