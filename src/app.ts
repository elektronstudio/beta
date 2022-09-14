import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";
import App from "./App.vue";
import "elektro/style.css";
import { config } from "elektro";
import { initStats, plausible } from "@/utils";

// TODO: Move to createConfig() function and unify with art config

config.wsUrl = import.meta.env.VITE_WS_URL as string;
config.messagesUrl = import.meta.env.VITE_MESSAGES_URL as string;
config.strapiUrl = import.meta.env.VITE_STRAPI_URL as string;
config.fientaUrl = import.meta.env.VITE_FIENTA_URL as string;
config.fientaToken = import.meta.env.VITE_FIENTA_TOKEN as string;
config.fientaTicketUrl = import.meta.env.VITE_FIENTA_TICKET_URL as string;

plausible.enableAutoPageviews();
// initStats();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);

app.mount("#app");
