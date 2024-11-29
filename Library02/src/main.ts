import { createApp } from "vue";
import { setComponents } from "./modules/components.module";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import setIcons from "./modules/icons.module";
import ToastService from 'primevue/toastservice';
import "./index.css";
import Aura from "@primevue/themes/aura";
import 'primeicons/primeicons.css';
import { setPrimeVueComponents } from "./modules/primevue.module";
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "white",
      cssLayer: false,
    },
  },
});
setIcons(app);
setPrimeVueComponents(app);
setComponents(app);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.mount("#app");

export default app;