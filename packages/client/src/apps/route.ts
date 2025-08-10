import { createMemoryHistory, createRouter } from "vue-router";
import Home from "./home/Home.vue";
import Login from "./login/Login.vue";
import Register from "./register/Register.vue";
// import HomeView from "./HomeView.vue";
// import AboutView from "./AboutView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
