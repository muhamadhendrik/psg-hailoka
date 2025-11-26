import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";

const pinia = createPinia();

// createApp(App).mount('#app')
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false, // disables dark variant
        },
    },
});

// app.use(PrimeVue);
// app.use(PrimeVue, { unstyled: true });
app.mount("#app");
