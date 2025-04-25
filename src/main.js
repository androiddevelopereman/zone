import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import VCalendar from "v-calendar";

// import * as bootstrap from 'bootstrap';
// window.bootstrap = bootstrap;

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

const app = createApp(App);
app.use(VueApexCharts);
app.use(VCalendar, {
  componentPrefix: "Vc", // إضافة بادئة اختيارية للمكونات
});
app.use(i18n);
app.use(router);
app.mount("#app");
