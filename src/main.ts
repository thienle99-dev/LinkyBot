import { createApp } from "vue";
import App from "./frontend/App.vue";
import "./frontend/styles.css";

import router from "./frontend/router";

createApp(App).use(router).mount("#app");

