<template>
  <nav
    class="hidden md:flex fixed md:top-0 md:left-0 lg:w-1/4 md:w-1/3 w-1/5 h-screen flex-col justify-between items-center bg-emerald-600 text-white md:px-6 md:p-10 pl-2 pt-10 font-inter z-50">
    <Menu id="overlay_menu" :model="mainRoutes" class="flex flex-col text-xl flex-grow w-full" unstyled>
      <template #start></template>
      <template #item="{ item }">
        <div v-if="checkUserRole(item)">
          <router-link :to="item.path"
            class="flex items-center p-3 my-1 w-4/5 md:w-full transition duration-300 transform hover:-translate-y-1 active:scale-95"
            :active-class="'bg-emerald-100 text-emerald-600 rounded-full md:rounded-lg -translate-y-1'"
            :class="isCurrentPage(item.path) ? 'bg-emerald-100 text-emerald-600 rounded-full md:rounded-lg -translate-y-1' : 'hover:bg-gray-200 hover:bg-opacity-50 hover:text-white hover:text-opacity-100 rounded-full md:rounded-lg'">
            <v-icon :name="item.icon" scale="2" class="mr-6" />
            <span class="hidden md:block">{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </Menu>
    <div class="flex items-center md:justify-center w-full">
      <Button
        class="flex items-center justify-start w-4/5 md:w-full p-3 transition duration-300 transform hover:-translate-y-1 active:scale-95 hover:bg-gray-200 hover:bg-opacity-50 rounded-full md:rounded-lg"
        unstyled @click="visibleLogoutDialog = true">
        <v-icon name="io-power" scale="2" class="mr-6" />
        <span class="text-xl hidden md:block">Sair</span>
      </Button>
    </div>
  </nav>

  <section class="md:hidden relative pt-6 pl-5">
    <Button @click="onToggleMenu" size="large" icon="pi pi-bars" text rounded
      class="!rounded-full !text-emerald-600  hover:!bg-emerald-100 z-40 scale-110" />
  </section>

  <section v-if="isMobileScreen">
    <Drawer v-model:visible="isToggleOpen" :block-scroll="true" class="!bg-emerald-600 !border-none !w-7/10">
      <template #container="{ closeCallback }">
        <section class="flex flex-col h-full">
          <div class="flex align-items-center justify-content-between px-5 pt-6 flex-shrink-0">
            <span>
              <Button size="large" type="button" @click="closeCallback" icon="pi pi-times" text rounded
                class="h-2rem w-2rem !text-white hover:!bg-emerald-500 scale-110"></Button>
            </span>
          </div>
          <section class="flex align-items-center justify-content-between px-5 pt-6 flex-shrink-0">
            <Menu :model="mainRoutes" class="pt-4 flex flex-col flex-grow text-xl w-full" unstyled>
              <template #item="{ item }">
                <div v-if="checkUserRole(item)">
                  <router-link :to="item.path"
                    class="flex items-center p-3 my-1 w-4/5 transition duration-300 transform hover:-translate-y-1 active:scale-95"
                    :active-class="'bg-emerald-100 !text-emerald-600 rounded-full md:rounded-lg -translate-y-1'"
                    @click="onToggleMenu"
                    :class="isCurrentPage(item.path) ? 'bg-emerald-100 text-emerald-600 rounded-full -translate-y-1' : 'hover:bg-gray-200 hover:bg-opacity-50 text-white hover:text-white hover:text-opacity-100 rounded-full'">
                    <v-icon :name="item.icon" scale="2" class="mr-6" />
                    <span>{{ item.label }}</span>
                  </router-link>
                </div>
              </template>
            </Menu>
            <div class="w-4/5 items-center mb-3 fixed bottom-0">
              <Button
                class="!text-white flex items-center justify-start w-full p-3 transition duration-300 transform hover:-translate-y-1 active:scale-95 hover:bg-gray-200 hover:bg-opacity-50 rounded-full"
                unstyled @click="visibleLogoutDialog = true">
                <v-icon name="io-power" scale="2" class="mr-6" />
                <span class="text-xl">Sair</span>
              </Button>
            </div>
          </section>
        </section>
      </template>
    </Drawer>
  </section>

  <logoutDialog :visible="visibleLogoutDialog" @cancel-dialog="visibleLogoutDialog = false"
    @user-logout="logoutClickHandler"></logoutDialog>
</template>

<script lang="ts">
import { AuthResponse, UserRole } from "@/models/login.model";
import { authenticatedRoutes } from "@/router/authenticated.routes";
import { getUserRole, removeUser } from "@/utils/user-storage.utils";
import LocalStorage from "@/utils/local-storage.utils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  data() {
    return {
      mainRoutes: [
        { label: "Usuários", path: "/", icon: "pr-users" },
        { label: "Livros", path: "/books", icon: "ri-book-line" },
        { label: "Empréstimo", path: "/rents", icon: "fa-regular-bookmark" },
        { label: "Estoque", path: "/stock", icon: "ri-stack-line" },
        { label: "Reserva", path: "/reserves", icon: "bi-check2-square" },
        { label: "Categorias", path: "/categories", icon: "bi-list-ul" },
      ],
      isToggleOpen: false as boolean,
      toggleIcon: '' as string,
      visibleLogoutDialog: false as boolean,
      isMobileScreen: true as boolean
    };
  },
  methods: {
    navigateTo(path: string): void {
      this.$router.push(path);
    },
    logoutClickHandler(): void {
      this.localStorage.clearLocalStorage();
      removeUser();
      this.$router.push("/login");
    },
    isCurrentPage(path: string): boolean {
      return this.$route.fullPath === path;
    },
    checkUserRole(item: any): boolean {
      const routeAuthenticate = authenticatedRoutes.filter(route => route.path === item.path)[0];
      if (routeAuthenticate) {
        const userRole = getUserRole() as UserRole;
        const role = routeAuthenticate.meta?.role as UserRole[];
        return role.includes(userRole);
      }
      return false;
    },
    onToggleMenu(): void {
      this.isToggleOpen = !this.isToggleOpen;
    },
    verifyScreenSize(): boolean {
      if (screen.width > 767) return this.isMobileScreen = false;
      else return this.isMobileScreen = true;
    }
  },
  computed: {
    addEventResize(): void {
      return window.addEventListener("resize", this.verifyScreenSize);
    },
    localStorage(): LocalStorage<AuthResponse> {
      return new LocalStorage();
    }
  },
  mounted() {
    this.addEventResize;
  }
});
</script>