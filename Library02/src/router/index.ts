import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { unauthentitcatedRoutes } from "./unauthenticated.routes";
import { authenticatedRoutes } from "./authenticated.routes";
import { guardsTo } from "./guards/auth.guards";
import { Views } from "@/views";

const routes: Array<RouteRecordRaw> = [
  ...authenticatedRoutes,
  ...unauthentitcatedRoutes,
  { path: "/:pathMatch(.*)*", component: Views.NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  guardsTo(to, from, next);
});

export default router;
