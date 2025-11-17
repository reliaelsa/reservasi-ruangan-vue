import { createApp } from "vue"
import { createPinia } from "pinia"
import axios from "axios"

import App from "./App.vue"
import router from "./router"
import "./style.css"

// =============================
// 🔥 IMPORT KOMPONEN KALENDER
// =============================
// (Tidak perlu app.use, karena dia BUKAN plugin, tapi komponen)
import VueCalendar from "@kodeglot/vue-calendar"
import "@kodeglot/vue-calendar/style.css"

// =============================
// 🔧 CONFIG AXIOS
// =============================
axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common["Accept"] = "application/json"

// =============================
// 🚀 CREATE APP
// =============================
const app = createApp(App)

// =============================
// 🔧 REGISTER PINIA & ROUTER
// =============================
app.use(createPinia())
app.use(router)

// =============================
// 🔧 REGISTER KOMPONEN GLOBAL
// =============================
// wajib! karena VueCalendar bukan plugin
app.component("VueCalendar", VueCalendar)

// =============================
// 🔧 GLOBAL AXIOS
// =============================
app.provide("axios", axios)
app.config.globalProperties.$axios = axios

// =============================
// 🚀 MOUNT APLIKASI
// =============================
app.mount("#app")
