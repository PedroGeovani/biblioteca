import { RouteRecordRaw } from "vue-router";
import { Views } from "@/views/index";
export const unauthentitcatedRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Views.Login,
    meta: {
      hasSideBar: false
    }
  },
];
