<template>
    <headerView :title-header="'Usuários'" :show-button-register="true" :show-filter="false"
        @actionButtonRegister="goToRegisterUserPage" />
    <section class="min-w-56 p-1 sm:border-black sm:border-[1px] rounded-[10px]">
        <section v-for="field in users" class="sm:hidden my-3 rounded-xl border-[1px] border-gray-600">
            <Card>
                <template #content>
                    <div class="flex flex-row gap-3  my-2 border-b-[1px] border-gray-500">
                        <span class="flex flex-wrap font-bold text-[16px] "> Nome: </span>
                        <span class="flex flex-wrap text-[16px]"> {{ field.name }} </span>
                    </div>
                    <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                        <span class="flex flex-wrap font-bold text-[16px]"> Email: </span>
                        <span class="flex flex-wrap text-[16px]"> {{ field.email }} </span>
                    </div>
                    <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                        <span class="flex flex-wrap font-bold text-[16px] "> Telefone: </span>
                        <span class="flex flex-wrap text-[16px]"> {{ field.phone }} </span>
                    </div>
                    <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                        <span class="flex flex-wrap font-bold text-[16px] "> Função: </span>
                        <span class="flex flex-wrap text-[16px]"> {{ field.role }} </span>
                    </div>
                    <div class="flex flex-flow justify-center">
                        <div class="flex text-white bg-[#984A3E] justify-center rounded-md px-10 w-full py-3"
                            :value="field.role" v-if="field.role == 'ADMINISTRATOR'">{{
                                field.role
                            }}</div>
                        <div v-else class="flex text-white bg-[#975597] justify-center rounded-md py-3 px-10 w-full"
                            :value="field.role">
                            {{ field.role }}</div>
                        <div class="card flex justify-center">
                            <Button @click="toggleMenuPopUp($event, field)" type="button" icon="pi pi-ellipsis-v"
                                class="flex items-center justify-center" unstyled aria-haspopup="true"
                                aria-controls="overlay_menu" />
                            <Menu ref="menu" id="overlay_menu" :model="itensMenuPopUp" v-bind:popup="true" />
                        </div>
                    </div>
                </template>
            </Card>
        </section>
        <section class="hidden sm:block p-2 font-inter text-[16px]">
            <DataTable class="pl-2 pr-2" :value="users" tableStyle="min-width: 50rem">
                <Column field="name" header="Nome:" style="width: 22.5%" class="select-none" />
                <Column field="email" header="Email:" style="width: 24%" class="select-none" />
                <Column field="phone" header="Telefone:" style="width: 24%" class="select-none" />
                <Column field="role" header="Função:" style="width: 24%; padding: 0;" class="select-none">
                    <template #body="slotProps">
                        <p class="text-white bg-[#984A3E] rounded-md teste pl-2 py-3 text-center select-none cursor-default"
                            :value="slotProps.data.role" v-if="slotProps.data.role == 'ADMINISTRATOR'">{{
                                slotProps.data.role
                            }}</p>
                        <p v-else
                            class="text-white bg-[#975597] rounded-md teste pl-2 py-3 text-center cursor-default select-none"
                            :value="slotProps.data.role">
                            {{ slotProps.data.role }}</p>
                    </template>
                </Column>
                <Column style="width: 4%;">
                    <template #body="slotProps">
                        <div class="flex justify-center ">
                            <Button type="button" icon="pi pi-ellipsis-v" text unstyled aria-label="options"
                                @click="toggleMenuPopUp($event, slotProps.data)" aria-haspopup="true"
                                aria-controls="overlay_menu" />
                            <Menu ref="menuPopUp" id="overlay_menu" :model="itensMenuPopUp" :popup="true"  />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </section>
        <div class="card">
            <Paginator template="PrevPageLink PageLinks NextPageLink" :rows="queryParams.size" :page="queryParams.page"
                :total-records="totalUsers" @page="changePage" :first="pageIndex">
                <template #previcon v-if="!isMobileScreen">
                    <v-icon name="bi-arrow-left" class="text-emerald-600 mr-2 text-xl" />
                    <p class="text-emerald-600">Anterior</p>
                </template>
                <template #nexticon v-if="!isMobileScreen">
                    <p class="text-emerald-600">Próximo</p>
                    <v-icon name="bi-arrow-right" class="text-emerald-600 ml-2 text-xl" />
                </template>
            </Paginator>
        </div>
    </section>
    <ConfirmDialog class="w-[556px] font-inter" />
</template>

<script lang="ts">

import { defineComponent, ref } from "vue";
import { UserService } from "./users.service";
import { User } from "@/models/user.model";
import { PageState } from "primevue/paginator";
import LocalStorage from "@/utils/local-storage.utils";
import { QueryParams } from "@/models/query-params.model";
import { ScreenSize } from "@/utils/paginator-screen.utils";
import { AuthResponse } from "@/models/login.model";
import DeleteDialog from '@/components/Dialogs/delete-dialog.vue';

export default defineComponent({
    name: "User",
    data() {
        return {
            users: [] as User[],
            queryParams: new QueryParams(),
            totalUsers: 0,
            selectedUser: {} as User,
            visibleDeleteDialog: false as boolean,
            itensMenuPopUp: [
                {
                    icon: "pi pi-pencil",
                    label: "Editar",
                    command: () => this.editUser()
                },
                {
                    icon: "pi pi-trash",
                    label: "Deletar",
                    command: () => this.openDeleteDialog(this.visibleDeleteDialog)
                }
            ],
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile()),
            userId: "" as string
        }
    },
    computed: {
        service(): UserService {
            return new UserService()
        },
        pageIndex(): number {
            return ((this.queryParams.page - 1) * this.queryParams.size)
        },
        pageRouter(): number {
            return Number(this.$route.params.page)
        },
        localStorage(): LocalStorage<AuthResponse> {
            return new LocalStorage()
        },
        addEventPaginatorResize(): void {
            return window.addEventListener("resize", this.currentScreenSize);
        },
    },
    methods: {
        getAllUsers(params?: {}): void {
            this.service.user.pipe().subscribe({
                next: (response) => {
                    this.users = response.content
                    this.queryParams = {
                        page: response?.page + 1,
                        size: 5
                    }
                    this.totalUsers = response?.total
                }
            })
            this.service.getAllUsers(params)
        },
        deleteUser(): void {
            this.userId = this.selectedUser.id as string;
            this.visibleDeleteDialog = false;
        },
        editUser(): void {
            this.localStorage.setItem("edit", this.selectedUser)
            this.$router.push({ path: `/user/edit/${this.selectedUser.id}` })
        },
        goToRegisterUserPage(): void {
            this.$router.push("/user/register")
        },
        changePage(event: PageState): void {
            const newPage = event.page + 1
            this.queryParams.page = event.page
            this.$router.push({ params: { page: newPage } })
            this.getAllUsers({ page: this.queryParams.page, size: this.queryParams.size })
        },
        toggleMenuPopUp(event: Event, user: User): void {
            const ref = this.$refs.menuPopUp as any
            this.selectedUser = user as User
            ref.toggle(event);
        },
        showToast(value: string): void {
            switch (value) {
                case "ACCEPT":
                    this.$toast.add({ severity: "success", summary: "Deletado", detail: "Usuário deletado com sucesso", life: 3000 });
                    break
                case "REJECT":
                    this.$toast.add({ severity: "error", summary: "Cancelado", detail: "", life: 3000 });
                    break
            }
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
        openDeleteDialog(isVisible: boolean): void {
            isVisible ? this.visibleDeleteDialog = false : this.visibleDeleteDialog = true;
        },

    },
    mounted() {
        this.addEventPaginatorResize;
        this.getAllUsers({ page: this.pageRouter - 1, size: 5 });
    },
    created() {
        this.$watch(
            () => this.pageRouter,
            (newPage: string, oldPage: string) => {
                if (newPage !== oldPage && this.$route.name === "userList") {
                    this.getAllUsers({ page: this.pageRouter - 1, size: 5 });
                }
            }
        )
    },
}
)
</script>