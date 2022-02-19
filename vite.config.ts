import { defineConfig } from "vite";
import ViteVue from "@vitejs/plugin-vue";
import VitePages from "vite-plugin-pages";
import ViteComponents from "unplugin-vue-components/vite";
import ViteIcons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteVue(),
    VitePages(),
    ViteComponents({
      resolvers: [
        (name) => {
          if (name.startsWith("E"))
            return { importName: name, path: "elektro" };
        },
      ],
    }),
    ViteIcons({ autoInstall: true }),
  ],
});
