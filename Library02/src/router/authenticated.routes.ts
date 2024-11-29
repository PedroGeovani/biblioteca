import { UserRole } from "@/models/login.model";
import { Views } from "@/views/index";
import { RouteRecordRaw } from "vue-router";
export const authenticatedRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "user",
    redirect: {
      path: "/user/1",
    },
    children: [
      {
        path: "user/:page",
        name: "userList",
        component: Views.User,
      },
      {
        path: "user/register",
        name: "register",
        component: Views.Register,
        meta: { role: [UserRole.ADMINISTRADOR], hasSideBar: true },
      },
      {
        path: "user/edit/:id",
        name: "edit",
        component: Views.Edit,
        meta: { role: [UserRole.ADMINISTRADOR], hasSideBar: true },
      },
    ],
    meta: {
      role: [UserRole.ADMINISTRADOR],
      hasSideBar: true,
    },
  },
  {
    path: "/categories",
    name: "categories",
    component: Views.Categories,
    meta: {
      role: [UserRole.ADMINISTRADOR],
      hasSideBar: true,
    },
  },
  {
    path: "/books",
    name: "books",
    redirect: {
      path: "/books/1",
    },
    meta: {
      role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
      hasSideBar: true,
    },
    children: [
      {
        path: "/books/:page",
        name: "books-table",
        component: Views.Books,
        meta: {
          role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
          hasSideBar: true,
        },
      },
      {
        path: "/books/registry",
        name: "registry-book",
        component: Views.RegistryBook,
        meta: {
          role: [UserRole.ADMINISTRADOR],
          hasSideBar: true,
        },
      },
      {
        path: "/books/edit/:id",
        name: "edit-book",
        component: Views.EditBook,
        meta: {
          role: [UserRole.ADMINISTRADOR],
          hasSideBar: true,
        },
      },
    ],
  },
  {
    path: "/rents",
    redirect: { path: "/rents/1" },
    name: "rents",
    children: [
      {
        path: "/rents/:page",
        name: "page-rent",
        component: () => import("@/views/Rent/index.vue"),
        meta: {
          role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
          hasSideBar: true,
        },
      },
      {
        path: "/rents/register",
        name: "page-rent-register",
        component: () => import("@/views/Rent/Register/register.vue"),
        meta: {
          role: [UserRole.ADMINISTRADOR],
          hasSideBar: true,
        },
      },
      {
        path: "/rents/detail/:idRent",
        name: "page-rent-detail",
        component: () => import("@/views/Rent/Detail/detail.vue"),
        meta: {
          role: [UserRole.ADMINISTRADOR],
          hasSideBar: true,
        },
      },
    ],
    meta: {
      role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
      hasSideBar: true,
    },
  },
  {
    path: "/reserves",
    name: "reserves",
    component: Views.Reserve,
    meta: {
      role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
      hasSideBar: true
    },
  },
  {
    path: "/reserves/create",
    name: "reservesCreate",
    component: Views.ReserveCreate,
    meta: {
      role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
      hasSideBar: true
    },
  },
  {
    path: "/reserves/details/:id",
    name: "reserveDetails",
    component: Views.ReserveDetails,
    meta: {
      role: [UserRole.ADMINISTRADOR, UserRole.ESTUDANTE],
      hasSideBar: true
    },
  },
  {
    path: '/stock',
    name: 'stock',    
    component: Views.Stock,
    meta: {
      role: [ UserRole.ADMINISTRADOR],
      hasSideBar: true
    },  
  },  
    
];

    
