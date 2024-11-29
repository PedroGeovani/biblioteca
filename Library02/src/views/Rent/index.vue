<script lang="ts">
import { defineComponent, ref } from "vue";
import { RentService } from "../Rent/rent.service";
import { PageToRent, StatusRent } from "@/models/rent.model";
import { QueryParams } from "@/models/query-params.model";
import { AuthResponse, UserRole } from "@/models/login.model";
import LocalStorage from "@/utils/local-storage.utils";
import { RentRest } from "@/service/rest/rent.rest";
import { ToastService } from "@/utils/toast-service.utils";
import { MessageToasts } from "@/utils/toast-messages.utils";
import { ScreenSize } from "@/utils/paginator-screen.utils";

export default defineComponent({
    name: "Rent",
    data() {
        return {
            pageRentPerPage: new PageToRent(),
            pageAllRent: new PageToRent(),
            pageFilterRents: new PageToRent(),
            queryParams: new QueryParams(),
            selectedRentStatus: {
                name: ""
            },
            visibleModals: false as boolean,
            visibleDeleteDialog: false as boolean,
            visibleReturnDialog: false as boolean,
            totalRents: 1,
            statusRentInactive: StatusRent.INACTIVE,
            userRole: UserRole,
            idRent: "",
            indexRent: 0,
            inputTitle: "",
            inputUser: "",
            columns: [
                { field: "book.title", header: "Título do livro:" },
                { field: "user.name", header: "Usuário" },
                { field: "rentDate", header: "Iniciado em:" },
                { field: "rentFinalDate", header: "Finaliza em:" },
            ],
            statusOption: [
                { name: "Ativo" },
                { name: "Inativo" }
            ],
            itemsMenu: [
                {
                    label: "Devolver",
                    icon: "pi pi-pencil",
                    command: () => {
                        this.openReturnDialog(this.visibleReturnDialog);
                    }
                },
                {
                    label: "Deletar",
                    icon: "pi pi-trash",
                    command: () => {
                        this.openDeleteDialog(this.visibleDeleteDialog);
                    }
                },
            ],
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile())
        };
    },
    mounted() {
        this.addEventPaginatorResize;
        this.getPageByRoute();
        this.getRentsPerPage(this.queryParams);
    },
    watch: {
        "selectedRentStatus"(valueStatus) {
            if (this.selectedRentStatus === null) {
                valueStatus = "";
                this.selectedRentStatus = valueStatus;
                this.pageFilterRents.content = [];
                this.queryParams.status = undefined;
            }
        },
    },
    methods: {
        getAllRents(params: QueryParams): void {
            this.service.rentAll.subscribe({
                next: (response) => {
                    this.pageAllRent = response;
                }
            });
            this.service.getAllRents(params);
        },
        getRentsPerPage(params: QueryParams): void {
            this.service.rent.subscribe({
                next: (response) => {
                    this.pageRentPerPage = response;
                    this.totalRents = response.total;
                }
            });
            this.service.getRentsPerPage(params);
        },
        getRentsFilter(params: QueryParams): void {
            this.service.rent.subscribe({
                next: (response) => {
                    this.pageFilterRents = response;
                    this.getAllRents({ page: 0, size: this.totalRents || 1 } as QueryParams);
                }
            });
            this.service.getRentsPerPage(params);
        },
        returnRent(): void {
            this.rentRest
                .returnRent(this.idRent)
                .subscribe({
                    next: () => {
                        this.getRentsPerPage(this.queryParams);
                        return this.$toast.add(ToastService.success(MessageToasts.SUCCESS_RETURN_RENT));
                    },
                    error: () => {
                        return this.$toast.add(ToastService.error(MessageToasts.ERROR_RETURN_RENT, "ERRO"));
                    }
                })
        },
        getId(id: string): void {
            this.idRent = id;
        },
        chooseIndexRent(index: number): void {
            this.indexRent = index;
        },
        changeRentalMenuVisibility(event: Event, id: string, index: number): void {
            const refsMenu: any = this.$refs.menu;
            refsMenu.toggle(event);
            this.getId(id);
            this.chooseIndexRent(index);
        },
        deleteRent(): void {
            this.rentRest
                .deleteRent(this.idRent)
                .subscribe({
                    next: () => {
                        this.visibleDeleteDialog = false;
                        this.getRentsPerPage(this.queryParams);
                        return this.$toast.add(ToastService.success(MessageToasts.SUCCESS_DELETE_RENT));
                    },
                    error: () => {
                        return this.$toast.add(ToastService.error(MessageToasts.ERROR_DELETE_RENT, "Não foi possível deletar o aluguel"));
                    }
                })
        },
        statusFilter(): void {
            if (this.selectedRentStatus.name === "Inativo") {
                this.queryParams.status = "INACTIVE";
                this.getRentsFilter({ page: this.queryParams.page, size: this.queryParams.size, status: "INACTIVE" } as QueryParams);
            } else if (this.selectedRentStatus.name === "Ativo") {
                this.queryParams.status = "ACTIVE";
                this.getRentsFilter({ page: this.queryParams.page, size: this.queryParams.size, status: "ACTIVE" } as QueryParams);
            }
        },
        titleUserFilter(): void {
            const filterContent = this.pageAllRent.content?.filter(content => {
                const filterTitle = content.book?.title?.toLowerCase().includes(this.inputTitle.toLowerCase());
                const filterUser = content.user?.name?.toLowerCase().includes(this.inputUser.toLowerCase());
                return filterTitle && filterUser;
            });
            this.pageFilterRents.content = filterContent;
        },
        filterRents(): void {
            if (this.inputTitle === "" && this.inputUser === "" && this.selectedRentStatus.name === undefined) {
                this.clearFilter();
            } else {
                this.statusFilter();
                this.titleUserFilter();
            }
        },
        clearFilter(): void {
            this.inputTitle = "";
            this.inputUser = "";
            this.selectedRentStatus = {
                name: ""
            };
            this.pageFilterRents.content = undefined;
            this.queryParams.status = undefined;
            this.getRentsPerPage(this.queryParams);
        },
        handlePageChange(event: any): void {
            if (this.pageFilterRents !== null) {
                this.$router.push("/rents/1");
            }
            this.queryParams.page = event.page;
            this.$router.push(`/rents/${this.queryParams.page + 1}`);
            this.getRentsPerPage(this.queryParams);
        },
        getIdByEvent(event: any): void {
            if (this.isAdministrator) {
                this.$router.push(`/rents/detail/${event}`);
            }
        },
        getPageByRoute(): void {
            this.queryParams.page = Number(this.$route.params.page) - 1 || 0;
        },
        backToFirstPage(): void {
            this.$router.push("/rents/1");
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
        openDeleteDialog(isVisible: boolean): void {
            isVisible ? this.visibleDeleteDialog = false : this.visibleDeleteDialog = true;
        },
        openReturnDialog(isVisible: boolean): void {
            isVisible ? this.visibleReturnDialog = false : this.visibleReturnDialog = true;
        },
    },
    computed: {
        service(): RentService {
            return new RentService();
        },
        isEmptyFilter(): boolean {
            return this.inputTitle === "" && this.inputUser === "";
        },
        serviceLocalStorage() {
            return new LocalStorage();
        },
        userAuthentication(): AuthResponse {
            return this.serviceLocalStorage.getItem("user") as AuthResponse;
        },
        rentRest(): RentRest {
            return new RentRest();
        },
        isAdministrator(): boolean {
            return (this.userAuthentication.role === this.userRole.ADMINISTRADOR);
        },
        firstElementPage(): number {
            return this.queryParams.page * this.queryParams.size;
        },
        showerData(): any {
            return this.isEmptyFilter ? this.pageRentPerPage.content : this.pageFilterRents.content;
        },
        addEventPaginatorResize(): void {
            return window.addEventListener("resize", this.currentScreenSize);
        },
    }
});
</script>
<template>
    <main class="font-inter">
        <headerView :title-header="'Empréstimo'" :show-button-register="true" :show-filter="true"
            @actionButtonRegister="$router.push({ path: '/rents/register' })"
            @actionButtonFilter="visibleModals = true, getAllRents({ page: 0, size: totalRents } as QueryParams)" />
        <div class="flex flex-row ms-[6px]">
            <Dialog v-model:visible="visibleModals" modal class="w-4/5 md:w-3/5 px-0 lg:px-[1%]"
                pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]">
                <template #header>
                    <span class="text-3xl font-semibold">Filtrar</span>
                </template>
                <section class="flex flex-col lg:flex-row gap-[2%]">
                    <div class="w-full items-center">
                        <label for="isbn" class="w-24">Usuário</label>
                        <IconField class="w-full">
                            <InputText id="user" class="block w-full" placeholder="Buscar por Usuário"
                                autocomplete="off" v-model="inputUser" />
                            <InputIcon class="pi pi-search" />
                        </IconField>
                    </div>

                    <div class="w-full items-center pt-[4%] lg:pt-0">
                        <label for="isbn" class="w-24">Título</label>
                        <IconField class="w-full">
                            <InputText id="author" class="block w-full" placeholder="Buscar por Título"
                                autocomplete="off" v-model="inputTitle" />
                            <InputIcon class="pi pi-search" />
                        </IconField>
                    </div>

                    <div class="items-center w-full block pt-[4%] lg:pt-0">
                        <label for="status" class="w-24">
                            Status
                        </label>
                        <Select id="status" show-clear v-model="selectedRentStatus" :options="statusOption"
                            optionLabel="name" placeholder="Selecione o status" class="w-full h-auto" />
                    </div>
                </section>
                <div class="flex justify-end gap-4 lg:gap-6 pt-[9%] lg:pt-[4%]">
                    <Button type="button"
                        class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 md:w-[25%] active:scale-95"
                        severity="danger" text label="Cancelar" aria-label="Cancelar a filtragem"
                        @click="visibleModals = false, clearFilter()" />
                    <Button type="button"
                        class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 md:w-[25%] active:scale-95"
                        label="Buscar" aria-label="Confirmar a busca" @click="visibleModals = false, filterRents()" />
                </div>
            </Dialog>
        </div>
        <section class="min-w-56 p-1 sm:border-black sm:border-[1px] rounded-[10px]">
            <section v-for="(field, index) in showerData"
                class="sm:hidden my-3 rounded-xl border-[1px] border-gray-600">
                <Card >
                    <template #content>
                        <div @click=getIdByEvent(field.id)>
                            <div class="flex flex-row gap-3  my-2 border-b-[1px] border-gray-500">
                                <span class="flex flex-wrap font-bold text-[16px] "> Titulo: </span>
                                <span class="flex flex-wrap text-[16px]"> {{ field.book.title }} </span>
                            </div>
                            <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                                <span class="flex flex-wrap font-bold text-[16px]"> Usuário: </span>
                                <span class="flex flex-wrap text-[16px]"> {{ field.user.name }} </span>
                            </div>
                            <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                                <span class="flex flex-wrap font-bold text-[16px] "> Iniciado em: </span>
                                <span class="flex flex-wrap text-[16px]"> {{ field.rentDate }} </span>
                            </div>
                            <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                                <span class="flex flex-wrap font-bold text-[16px] "> Finalizado em: </span>
                                <span class="flex flex-wrap text-[16px]"> {{ field.rentFinalDate }} </span>
                            </div>
                        </div>
                            <div class="flex my-2">
                                <span v-if="field.status === 'ACTIVE'"
                                class="flex flex-wrap bg-emerald-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">Ativo</span>
                                <span v-if="field.book?.status === 'INACTIVE'"
                                class="flex flex-wrap bg-amber-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">Inativo</span>
                            <div class="card flex justify-center" v-if="isAdministrator">
                                <Button @click="changeRentalMenuVisibility($event, field.id, index)" type="button"
                                    icon="pi pi-ellipsis-v" class="flex items-center justify-center" unstyled
                                    aria-haspopup="true" aria-controls="overlay_menu" />
                                <Menu ref="menu" id="overlay_menu" :model="itemsMenu" v-bind:popup="true" />
                            </div>
                        </div>
                    </template>
                </Card>
            </section>
            <section class="hidden sm:block p-2 font-inter text-[16px]">
                <DataTable :value="showerData" tableStyle="min-width: 50rem datatable.row.color"
                    :metaKeySelection="false" @row-click="getIdByEvent($event.data.id)">
                    <template #paginatornextpagelinkicon>
                        <p class="text-emerald-600">Próximo</p>
                        <v-icon name="bi-arrow-right" class="text-emerald-600 ml-2 text-xl"></v-icon>
                    </template>
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" />
                    <Column field="status" header="Status" ref="status" class="text-xl">
                        <template #body="slotProps">
                            <div>
                                <div v-if="slotProps.data.status === 'INACTIVE'"
                                    class="bg-red-700 justify-center text-center py-3 w-[15rem] rounded-lg text-white text-lg">
                                    Inativo
                                </div>
                                <div v-else
                                    class="flex justify-center bg-emerald-600 text-center py-3 w-[15rem] rounded-lg text-white text-lg">
                                    Ativo
                                </div>
                            </div>
                        </template>
                    </Column>
                    <Column v-if="isAdministrator">
                        <template #body="slotProps">
                            <Button type="button" icon="pi pi-ellipsis-v"
                                @click="changeRentalMenuVisibility($event, slotProps.data.id, slotProps.index)"
                                aria-haspopup="true" severity="secondary" text aria-label="options"
                                aria-controls="overlay_menu" />
                            <Menu ref="menu" id="overlay_menu" :model="itemsMenu" :popup="true"></Menu>
                        </template>
                    </Column>
                </DataTable>
                <deleteDialog :visible="visibleDeleteDialog" title="aluguel" description="este aluguel?"
                    @cancel-dialog="visibleDeleteDialog = false" @confirm-delete="deleteRent"></deleteDialog>

                <Dialog v-model:visible="visibleReturnDialog" modal pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]"
                    class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]">
                    <template #header>
                        <span class="text-3xl font-semibold">Devolver aluguel</span>
                    </template>
                    <span class="block mb-8">Deseja realmente devolver este aluguel?</span>
                    <div class="flex justify-end gap-4 lg:gap-6 pt-[3%]">
                        <Button type="button"
                            class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                            severity="danger" text label="Cancelar" aria-label="Cancelar a devolução"
                            @click="visibleReturnDialog = false" />
                        <Button type="button"
                            class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                            label="Confirmar" aria-label="Confirmar a devolução" @click="returnRent" />
                    </div>
                </Dialog>
            </section>
        </section>
        <div>
            <Paginator template="PrevPageLink PageLinks NextPageLink" :rows="queryParams.size" :always-show="false"
                :page="queryParams.page"
                :total-records="isEmptyFilter ? pageRentPerPage.total : pageFilterRents.content?.length"
                @page="handlePageChange" :first="firstElementPage">
                <template #previcon v-if="!isMobileScreen">
                    <v-icon name="bi-arrow-left" class="text-emerald-600 mr-2 text-xl"></v-icon>
                    <p class="text-emerald-600">Anterior</p>
                </template>
                <template #nexticon v-if="!isMobileScreen">
                    <p class="text-emerald-600">Próximo</p>
                    <v-icon name="bi-arrow-right" class="text-emerald-600 ml-2 text-xl"></v-icon>
                </template>
            </Paginator>
        </div>
        <ConfirmDialog />
    </main>
</template>
<style>
.p-datatable-column-title {
    font-size: 20px;
}
</style>
