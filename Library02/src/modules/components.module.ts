import deleteCategory from "@/views/Category/Modal/delete-category.vue";
import deleteDialog from "@/components/Dialogs/delete-dialog.vue";
import editCategory from "@/views/Category/Modal/edit-category.vue";
import headerSubView from "@/components/HeaderSubView/header-sub-view.vue";
import headerView from "@/components/HeaderView/header-view.vue";
import logoutDialog from "@/components/Navbar/Modal/logout-dialog.vue";
import navbar from "@/components/Navbar/navbar.vue";
 
import { App } from "vue";

export function setComponents(app: App) {
  app.component("deleteCategory", deleteCategory);
  app.component("deleteDialog", deleteDialog);
  app.component("editCategory", editCategory);
  app.component("headerSubView", headerSubView);
  app.component("headerView", headerView);
  app.component("logoutDialog", logoutDialog);
  app.component("navbar", navbar);
}