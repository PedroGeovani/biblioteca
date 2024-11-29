<script lang="ts">
import { Book } from "@/models/book-page.model";
import { BookService } from "./books.service";
import { defineComponent, ref } from "vue";
import LocalStorage from "@/utils/local-storage.utils";
import { AuthResponse, UserRole } from "@/models/login.model";
import { PageState } from "primevue/paginator";
import { QueryParams } from "@/models/query-params.model";
import { BookUtil } from "@/utils/books.utils";
import { BooksRest } from "@/service/rest/books.rest";
import { MessageToasts } from "@/utils/toast-messages.utils";
import { ToastService } from "@/utils/toast-service.utils";
import { take } from "rxjs";
import { ScreenSize } from "@/utils/paginator-screen.utils";

export default defineComponent({
    name: "BooksTable",
    data() {
        return {
            isVisibleFilterDialog: false,
            isVisibleDeleteDialog: false,
            quantityBooksInTable: 0,
            indexOfBook: 0,
            bookId: "",
            books: [] as Book[],
            queryBooksParams: new QueryParams(),
            userRole: UserRole,
            filter: new Book(),
            filterOptionsStatus: [
                { name: "Disponível" },
                { name: "Emprestado" },
                { name: "Indisponível" }
            ],
            groupOfSelectedFilters: {
                selectedAuthor: "",
                selectedIsbn: "",
                selectedTitle: "",
                selectedStatus: {
                    name: ""
                }
            },
            menuBook: [
                {
                    label: "Editar",
                    icon: "pi pi-pencil",
                    command: () => {
                        this.toEditBookPage(this.bookId);
                    }
                },
                {
                    label: "Deletar",
                    icon: "pi pi-trash",
                    command: () => {
                        this.openDeleteDialog(this.isVisibleDeleteDialog);
                    }
                }
            ],
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile())
        }
    },
    mounted() {
        this.addEventPaginatorResize;
        this.getPageNumber();
        this.getBooksPerPage(this.queryBooksParams);
    },
    watch: {
        "groupOfSelectedFilters.selectedStatus"(valueStatus) {
            if (this.groupOfSelectedFilters.selectedStatus === null) {
                valueStatus = "";
                this.groupOfSelectedFilters.selectedStatus = valueStatus;
            }
        },
        "$route.params.page"(newPage, oldPage) {
            if (newPage !== oldPage && this.$route.name === "books-table") {
                this.queryBooksParams.page = Number(newPage) - 1;
                this.getBooksPerPage(this.queryBooksParams);
            }
        },
    },
    computed: {
        serviceBooks(): BookService {
            return new BookService();
        },
        serviceLocalStorage() {
            return new LocalStorage();
        },
        bookUtils(): BookUtil {
            return new BookUtil();
        },
        restBooks(): BooksRest {
            return new BooksRest();
        },
        loggedUser(): AuthResponse {
            return this.serviceLocalStorage.getItem("user") as AuthResponse;
        },
        addEventPaginatorResize(): void {
            return window.addEventListener("resize", this.currentScreenSize);
        },
    },
    methods: {
        getSelectedFilters(): void {
            this.queryBooksParams.author = this.filter.author;
            this.queryBooksParams.isbn = this.filter.isbn;
            this.queryBooksParams.status = this.filter.status;
            this.queryBooksParams.title = this.filter.title;
        },
        getPageNumber(): void {
            this.queryBooksParams.page = Number(this.$route.params.page) - 1 || 0;
        },
        toEditBookPage(bookId?: string): void {
            this.$router.push(`/books/edit/${bookId}`);
        },
        getFirstElementPage(): number {
            return this.queryBooksParams.page * this.queryBooksParams.size;
        },
        isAdministrator(): boolean {
            return (this.loggedUser.role === this.userRole.ADMINISTRADOR) ? true : false;
        },
        changePage(event: PageState): void {
            this.queryBooksParams.page = event.page;
            this.$router.push(`/books/${this.queryBooksParams.page + 1}`);
        },
        getBooksPerPage(pageParams: QueryParams): void {
            this.getSelectedFilters();
            this.serviceBooks.books
                .pipe(take(1))
                .subscribe({
                    next: (response) => {
                        this.books = response.content;
                        this.quantityBooksInTable = response.total;
                        if (response.content.length === 0) {
                            this.clearFilter();
                            this.$toast.add(ToastService.error(MessageToasts.ERROR_GET_BOOKS, "Error"));
                            this.isVisibleFilterDialog = false;
                        }
                    },
                })
            this.serviceBooks.getBooksPerPage(pageParams);
        },
        showFilteredBooks(): void {
            this.openFilterDialog(this.isVisibleFilterDialog);
            this.filter = this.bookUtils.verifySelectedFilters(this.groupOfSelectedFilters);
            this.goToFirstPage();
            this.getBooksPerPage(this.queryBooksParams);
        },
        clearFilter(): void {
            this.filter.isbn = undefined;
            this.filter.author = undefined;
            this.filter.title = undefined;
            this.filter.status = undefined;
            this.groupOfSelectedFilters.selectedAuthor = "";
            this.groupOfSelectedFilters.selectedIsbn = "";
            this.groupOfSelectedFilters.selectedTitle = "";
            this.groupOfSelectedFilters.selectedStatus = { name: "" };
            this.getBooksPerPage(this.queryBooksParams);
            this.openFilterDialog(this.isVisibleFilterDialog);
        },
        deleteBook(bookId: string): void {
            this.restBooks.deleteBook(bookId).subscribe({
                next: () => {
                    this.books.splice(this.indexOfBook, 1);
                    if (this.books.length === 0) {
                        this.goToFirstPage();
                    }
                    this.getBooksPerPage(this.queryBooksParams);
                    this.showSucessToast();
                }, error: () => {
                    this.showErrorToast();
                }
            })
            this.openDeleteDialog(this.isVisibleDeleteDialog);
        },
        goToFirstPage(): void {
            this.$router.push("/books");
        },
        openDeleteDialog(isVisible: boolean): void {
            isVisible ? this.isVisibleDeleteDialog = false : this.isVisibleDeleteDialog = true;
        },
        openFilterDialog(isVisible: boolean): void {
            isVisible ? this.isVisibleFilterDialog = false : this.isVisibleFilterDialog = true;
        },
        changeBookMenuVisibility(event: Event, bookId: string, index: number): void {
            this.getId(bookId);
            this.getIndexBook(index);
            const refsMenu: any = this.$refs.menu;
            refsMenu.toggle(event);
        },
        getId(bookId: string): void {
            this.bookId = bookId;
        },
        getIndexBook(index: number): void {
            this.indexOfBook = index;
        },
        showSucessToast(): void {
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_DELETE_BOOK));
        },
        showErrorToast(): void {
            this.$toast.add(ToastService.error(MessageToasts.ERROR_DELETE_BOOK, "Error"));
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
    },
})
</script>

<template>
    <main class="w-full h-full flex flex-col justify-around font-inter">
        <headerView :title-header="'Livros'" :show-button-register="isAdministrator()" :show-filter="true"
            @actionButtonRegister="$router.push({ path: '/books/registry' })"
            @actionButtonFilter="openFilterDialog(isVisibleFilterDialog)" />
        <section class="min-w-56 p-1 sm:border-black sm:border-[1px] rounded-[10px]">
            <section v-for="(field, index) in books" class="sm:hidden my-3 rounded-xl border-[1px] border-gray-600">
                <Card>
                    <template #content>
                        <div class="flex flex-row gap-3  my-2 border-b-[1px] border-gray-500">
                            <span class="flex flex-wrap font-bold text-[16px] "> Titulo: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.title }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px]"> Autor: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.author }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px] "> Isbn: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.isbn }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px] "> Quantidade: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.publisher }} </span>
                        </div>
                        <div class="flex my-2">
                            <span v-if="field.status === 'AVAILABLE'"
                                class="flex flex-wrap bg-emerald-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                Disponivel </span>
                            <span v-if="field.status === 'LOANED'"
                                class="flex flex-wrap bg-amber-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                Indisponível </span>
                            <span v-if="field.status === 'UNAVAILABLE'"
                                class="flex flex-wrap bg-red-700 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                Emprestado </span>
                            <div v-if="isAdministrator()" class="card flex justify-center">
                                <Button @click="changeBookMenuVisibility($event, String(field.id), index)" type="button"
                                    icon="pi pi-ellipsis-v" class="flex items-center justify-center" unstyled
                                    aria-haspopup="true" aria-controls="overlay_menu" />
                                <Menu ref="menu" id="overlay_menu" :model="menuBook" v-bind:popup="true" />
                            </div>
                        </div>
                    </template>
                </Card>
            </section>
            <section class="hidden sm:block p-2 font-inter text-[16px]">
                <DataTable :value="books" class="w-full h-full">
                    <Column field="title" header="Titulo:" header-class="text-xl"
                        class="w-1/5 !text-black text-lg select-none cursor-default" />
                    <Column field="author" header="Autor:" header-class="text-xl"
                        class="w-1/5 !text-black text-lg select-none cursor-default" />
                    <Column field="isbn" header="Isbn:" header-class="text-xl"
                        class="w-1/5 !text-black text-lg select-none cursor-default" />
                    <Column field="publisher" header="Editora:" header-class="text-xl"
                        class="w-1/5 !text-black text-lg select-none cursor-default" />
                    <Column header="Status:" header-class="text-xl select-none cursor-default"
                        class="w-1/5 !text-black text-lg">
                        <template #body="slotProps">
                            <div class="text-white text-center select-none cursor-default">
                                <span v-if="slotProps.data.status === 'AVAILABLE'"
                                    class="flex bg-emerald-600 rounded-md h-[49px] items-center justify-center ">
                                    Disponível
                                </span>
                                <span v-else-if="slotProps.data.status === 'UNAVAILABLE'"
                                    class="bg-red-700 rounded-md h-[49px] items-center justify-center flex">
                                    Indisponível
                                </span>
                                <span v-else class="bg-amber-600 rounded-md h-[49px] items-center justify-center flex">
                                    Emprestado
                                </span>
                            </div>
                        </template>
                    </Column>
                    <Column v-if="isAdministrator()" headerStyle="text-align: end"
                        bodyStyle="text-align: end; width: 0px">
                        <template #body="slotProps">
                            <Button type="button" icon="pi pi-ellipsis-v"
                                @click="changeBookMenuVisibility($event, slotProps.data.id, slotProps.index)"
                                aria-haspopup="true" aria-controls="overlay_menu" text unstyled
                                aria-label="options" class="flex items-center justify-center"></Button>
                            <Menu ref="menu" id="overlay_menu" :model="menuBook" :popup="true"></Menu>
                        </template>
                    </Column>
                </DataTable>
            </section>
            <Paginator template="PrevPageLink PageLinks NextPageLink"
                :first="getFirstElementPage()" :rows="queryBooksParams.size" :page="queryBooksParams.page"
                :total-records="quantityBooksInTable" @page="changePage">
                <template #previcon v-if="!isMobileScreen">
                    <v-icon name="bi-arrow-left" class="text-emerald-600 mr-2 text-xl"></v-icon>
                    <span class="text-emerald-600">Anterior</span>
                </template>
                <template #nexticon v-if="!isMobileScreen">
                    <span class="text-emerald-600">Próximo</span>
                    <v-icon name="bi-arrow-right" class="text-emerald-600 ml-2 text-xl"></v-icon>
                </template>
            </Paginator>
        </section>
    </main>
    <Dialog                                                                                                                                                                                                                                                                 v-model:visible="isVisibleFilterDialog" modal class="w-4/5 md:w-3/5 px-0 lg:px-[1%]"
        pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]">
        <template #header>
            <span class="text-3xl text-black font-semibold">Filtrar</span>
        </template>
        <section class="w-full flex flex-col lg:flex-row gap-[2%]">

            <div class="w-full items-center">
                <label for="author">Autor:</label>
                <IconField>
                    <InputText id="author" type="text" class="w-full rounded-lg" placeholder="Buscar por Autor"
                        v-model="groupOfSelectedFilters.selectedAuthor" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>

            <div class="w-full items-center pt-[4%] lg:pt-0">
                <label for="isbn">Isbn:</label>
                <IconField>
                    <InputText id="isbn" type="text" class="w-full rounded-lg" placeholder="Buscar por Isbn"
                        v-model="groupOfSelectedFilters.selectedIsbn" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>                                                                                                                                                                      

            <div class="w-full items-center pt-[4%] lg:pt-0">
                <label for="title">Titulo:</label>
                <IconField>
                    <InputText id="title" type="text" class="w-full rounded-lg" placeholder="Buscar por Título"
                        v-model="groupOfSelectedFilters.selectedTitle" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>

            <div class="w-full items-center pt-[4%] lg:pt-0">
                <label for="status">Status:</label>
                <Select id="status" v-model="groupOfSelectedFilters.selectedStatus" :options="filterOptionsStatus"
                    showClear optionLabel="name" placeholder="Buscar por Status" class="w-full !rounded-lg" />
            </div>
        </section>

        <div class="flex justify-end gap-4 lg:gap-6 pt-[9%] lg:pt-[4%]">
            <Button type="button"
                class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 md:w-[25%] active:scale-95"
                severity="danger" text label="Cancelar" aria-label="Cancelar a filtragem" @click="clearFilter()" />
            <Button type="button"
                class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 md:w-[25%] active:scale-95"
                label="Buscar" aria-label="Confirmar a busca" @click="showFilteredBooks()" />
        </div>
    </Dialog>

    <deleteDialog :visible="isVisibleDeleteDialog" title="livro" description="este livro?"
        @cancel-dialog="openDeleteDialog(isVisibleDeleteDialog)" @confirm-delete="deleteBook(bookId)"></deleteDialog>
</template>