import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { router } from "./apps/route";

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount("#app");

console.log("Pinia 状态管理已启用 ✅");
