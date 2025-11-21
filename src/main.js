import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import "./style.css"; // tailwind + custom style

// =============================
// FULLCALENDAR (versi aman untuk Vue 3)
// =============================
import FullCalendar from "@fullcalendar/vue3";

// CSS FULLCALENDAR
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

// =============================
// KALENDER KODEGLOT (opsional)
// =============================
import VueCalendar from "@kodeglot/vue-calendar";
import "@kodeglot/vue-calendar/style.css";

// =============================
// CONFIG AXIOS
// =============================
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common["Accept"] = "application/json";

// =============================
// CREATE APP
// =============================
const app = createApp(App);

app.use(createPinia());
app.use(router);

// REGISTER GLOBAL COMPONENT
app.component("FullCalendar", FullCalendar);
app.component("VueCalendar", VueCalendar);

// GLOBAL AXIOS
app.provide("axios", axios);
app.config.globalProperties.$axios = axios;

app.mount("#app");
