<template>
    <main>
        <headerView :title-header="'Estoque'" :show-button-register="true"
            @actionButtonRegister="resetFields(), isVisibleDialogRegister = true" />
        <Dialog :close-on-escape="false" ref="register" v-model:visible="isVisibleDialogRegister" modal
            header="Cadastrar Estoque" :style="{ width: '32rem' }">
            <span class="flex text-surface-500 text-[16px] mb-2">Livro:</span>
            <div class="card flex justify-center my-4">
                <InputMask class="flex !rounded-r-none text-[16px]" fluid v-model="query.isbn" mask="999-9-999-99999-9"
                    placeholder="Digite o Isbn: 000-0-000-000000-0" :invalid="query.isbn === ''" />
                <Button type="button" icon="pi pi-search" class="!rounded-l-none" @click="searchBook()" />
            </div>
            <section v-if="isVisibleBookIsbn" class="fixed z-10 max-w-max me-5">
                <Card>
                    <template #content>
                        <div class="flex gap-4 flex-wrap sm:w-[27rem]"
                            @click="disableQuantityInput = false, isVisibleBookIsbn = false">
                            <div>
                                <p>
                                    <span class="font-bold"> Título: </span>
                                    <span> {{ BookFoundByIsbnSearch[0].title }} </span>
                                </p>
                                <p>
                                    <span class="font-bold">Autor: </span>
                                    <span> {{ BookFoundByIsbnSearch[0].author }} </span>
                                </p>
                            </div>
                            <div>
                                <span v-if="String(BookFoundByIsbnSearch[0].status) === 'AVAILABLE'"
                                    class="flex p-2 bg-emerald-600 rounded-lg text-white w-fit"> {{
                                        bookUtil.translateStatusToPTBR(String(BookFoundByIsbnSearch[0].status))
                                    }} </span>
                                <span v-if="String(BookFoundByIsbnSearch[0].status) === 'LOANED'"
                                    class="flex p-2 bg-amber-600 rounded-lg text-white w-fit"> {{
                                        bookUtil.translateStatusToPTBR(String(BookFoundByIsbnSearch[0].status))
                                    }} </span>
                                <span v-if="String(BookFoundByIsbnSearch[0].status) === 'UNAVAILABLE'"
                                    class="flex p-2 bg-red-700 rounded-lg text-white w-fit"> {{
                                        bookUtil.translateStatusToPTBR(String(BookFoundByIsbnSearch[0].status))
                                    }} </span>
                            </div>
                        </div>
                    </template>
                </Card>
            </section>
            <span class="text-surface-500 block mb-2"> Quantidade:</span>
            <div class="flex items-center gap-4 mb-4 text-[16px]">
                <InputNumber v-model="query.totalQuantity" :disabled="disableQuantityInput" inputId="minmax-buttons"
                    mode="decimal" showButtons :min="1" :max="100" fluid />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="isVisibleDialogRegister = false" />
                <Button type="button" label="Cadastrar" @click="createNewItemStock()" />
            </div>
        </Dialog>
        <section class="min-w-56 p-1 sm:border-black sm:border-[1px] rounded-[10px]">
            <section v-for="field in contentStock" class="sm:hidden my-3 rounded-xl border-[1px] border-gray-600">
                <Card>
                    <template #content>
                        <div class="flex flex-row gap-3  my-2 border-b-[1px] border-gray-500">
                            <span class="flex flex-wrap font-bold text-[16px] "> Titulo: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.book?.title }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px]"> Autor: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.book?.author }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px] "> Isbn: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.book?.isbn }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px] "> Quantidade: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.availableQuantity }} </span>
                        </div>
                        <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                            <span class="flex flex-wrap font-bold text-[16px] "> Total: </span>
                            <span class="flex flex-wrap text-[16px]"> {{ field.totalQuantity }} </span>
                        </div>
                        <div class="flex my-2">
                            <span v-if="field.book?.status === 'AVAILABLE'"
                                class="flex flex-wrap bg-emerald-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                {{ bookUtil.translateStatusToPTBR(field.book?.status) }} </span>
                            <span v-if="field.book?.status === 'LOANED'"
                                class="flex flex-wrap bg-amber-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                {{ bookUtil.translateStatusToPTBR(field.book?.status) }} </span>
                            <span v-if="field.book?.status === 'UNAVAILABLE'"
                                class="flex flex-wrap bg-red-700 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                                {{ bookUtil.translateStatusToPTBR(field.book?.status) }} </span>
                            <div class="card flex justify-center">
                                <Button @click="showMenuOptions($event, field)" type="button" icon="pi pi-ellipsis-v"
                                    class="flex items-center justify-center" unstyled aria-haspopup="true"
                                    aria-controls="overlay_menu" />
                                <Menu ref="menu" id="overlay_menu" :model="items" v-bind:popup="true" />
                            </div>
                        </div>
                    </template>
                </Card>
            </section>
            <section class="hidden sm:block p-2 font-inter text-[16px]">
                <DataTable ref="table" :value="contentStock"
                    tableStyle="min-width: 60rem; font-size: 16px; color: black;">
                    <Column field="book.title" header="Titulo" />
                    <Column field="book.author" header="Autor" />
                    <Column field="book.isbn" header="Isbn" />
                    <Column field="availableQuantity" header="Disponíveis" />
                    <Column field="totalQuantity" header="Total" />
                    <Column header="Status">
                        <template #body="slotProps">
                            <div class="flex justify-between">
                                <span v-if="slotProps.data.book.status === 'AVAILABLE'"
                                    class="flex bg-emerald-600 rounded-lg justify-center items-center text-white w-[180px] h-14 text-[16px]">
                                    {{ bookUtil.translateStatusToPTBR(slotProps.data.book.status) }} </span>
                                <span v-if="slotProps.data.book.status === 'LOANED'"
                                    class="flex bg-amber-600 rounded-lg justify-center items-center text-white w-[180px] h-14 text-[16px]">
                                    {{ bookUtil.translateStatusToPTBR(slotProps.data.book.status) }} </span>
                                <span v-if="slotProps.data.book.status === 'UNAVAILABLE'"
                                    class="flex bg-red-700 rounded-lg justify-center items-center text-white w-[180px] h-14 text-[16px]">
                                    {{ bookUtil.translateStatusToPTBR(slotProps.data.book.status) }} </span>
                                <div class="card flex justify-center">
                                    <Button @click="showMenuOptions($event, slotProps.data)" type="button"
                                        icon="pi pi-ellipsis-v" class="flex items-center justify-center mx-3" unstyled
                                        aria-haspopup="true" aria-controls="overlay_menu" />
                                    <Menu ref="menu" id="overlay_menu" :model="items" v-bind:popup="true" />
                                </div>
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <div>
                    <Dialog ref="dialogedit" pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]"
                        v-model:visible="isVisibleDialogEdition" modal
                        class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]">
                        <template #header>
                            <span class="text-3xl font-semibold">Editar estoque</span>
                        </template>
                        <span class="text-surface-500 dark:text-surface-400 block mb-4">Livro</span>
                        <div class="flex flex-col md:flex-row md:justify-between gap-0 md:gap-2">
                            <div class="flex flex-grow gap-2">
                                <span
                                    class="font-semibold text-surface-500 dark:text-surface-400 block mb-4">Título:</span>
                                <label class="text-[#757575]"> {{ stockCurrent.book?.title }} </label>
                            </div>
                            <div class="flex flex-grow gap-2">
                                <span
                                    class="font-semibold text-surface-500 dark:text-surface-400 block mb-4">Isbn:</span>
                                <label class="text-[#757575]"> {{ stockCurrent.book?.isbn }} </label>
                            </div>
                        </div>
                        <div class="flex flex-grow gap-2 pb-[4%]">
                            <span class="font-semibold text-surface-500 dark:text-surface-400 block mb-4">Autor:</span>
                            <label class="text-[#757575]"> {{ stockCurrent.book?.author }} </label>
                        </div>
                        <span class="font-semibold text-surface-500 dark:text-surface-400 block mb-4">Quantidade:</span>
                        <div class="flex items-center gap-4 mb-4">
                            <InputNumber v-model="stockCurrent.totalQuantity" inputId="minmax-buttons" mode="decimal"
                                showButtons :min="1" :max="100" fluid />
                        </div>
                        <div class="flex justify-end gap-4 lg:gap-6 pt-[3%]">
                            <Button type="button" label="Cancelar" severity="danger" text
                                class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                                @click="isVisibleDialogEdition = false"></Button>
                            <Button type="button" label="Salvar"
                                class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                                @click="confirmStockUpdate()" />
                        </div>
                    </Dialog>
                    <deleteDialog :visible="visibleDeleteDialog" title="estoque" description="este estoque?"
                        @cancel-dialog="visibleDeleteDialog = false" @confirm-delete="deleteStock"></deleteDialog>
                </div>
            </section>
            <Paginator :rows="sizeStock" :first="sizeStock * pageStock" :totalRecords="totalStock"
                :page-link-size="isMobileScreen ? 2 : undefined" @page="setStatusPagination"
                template="PrevPageLink PageLinks NextPageLink">
                <template v-if="!isMobileScreen" #previcon>
                    <v-icon name="bi-arrow-left" class="text-emerald-600 text-xl" aria-hidden="true" />
                    <span class="items-center text-emerald-600 mx-2">Anterior</span>
                </template>

                <template v-if="!isMobileScreen" #nexticon>
                    <span class="items-center text-emerald-600 mx-2">Próximo</span>
                    <v-icon name="bi-arrow-right" class="text-emerald-600 text-xl" aria-hidden="true" />
                </template>
            </Paginator>
        </section>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { StockService } from './stock.service';
import { Stock } from '@/models/stock.model';
import { Book } from '@/models/book-page.model'
import { PageState } from 'primevue/paginator';
import { QueryParams } from '@/models/query-params.model';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { validateIsbn } from '@/utils/validator.utils';
import { BookUtil } from '@/utils/books.utils';
import { take } from 'rxjs';
import { ToastService } from '@/utils/toast-service.utils';
import { ScreenSize } from '@/utils/paginator-screen.utils';

export default defineComponent({
    name: 'Stock',
    data() {
        return {
            params: {
                page: Number(this.$route.query.page) || 0,
                size: 5,
            } as QueryParams,
            query: {
                isbn: '',
                totalQuantity: 1,
            } as QueryParams,
            isVisibleDialogRegister: false,
            isVisibleDialogEdition: false,
            disableQuantityInput: true,
            isVisibleBookIsbn: false,
            visibleDeleteDialog: false as boolean,
            BookFoundByIsbnSearch: [] as Book[],
            stockCurrent: {} as Stock,
            contentStock: [] as Stock[],
            pageStock: 0,
            sizeStock: 0,
            totalStock: 0,
            items: [
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    command: () => { this.showDialogEdit() },
                },
                {
                    label: 'Deletar',
                    icon: 'pi pi-trash',
                    command: () => { this.openDeleteDialog(this.visibleDeleteDialog) },
                }
            ],
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile())
        }
    },
    mounted() {
        this.getStockAll();
        this.addEventPaginatorResize;
    },
    computed: {
        serviceStock(): StockService {
            return new StockService();
        },
        bookUtil(): BookUtil {
            return new BookUtil;
        },
        addEventPaginatorResize(): void {
            return window.addEventListener('resize', this.currentScreenSize);
        },
    },
    methods: {
        setStatusPagination(event: PageState): void {
            this.params.page = event.page;
            this.$router.push({ path: `/stock`, query: { page: event.page } });
            this.getStockAll();
        },
        searchBook(): void {
            if (validateIsbn(String(this.query.isbn))) {
                this.getBookIsbn(this.query);
            } else {
                this.$toast.add(ToastService.error(MessageToasts.ERROR_INVALID_ISBN_BOOK, "Atenção"));
            }
        },
        createNewItemStock(): void {
            if (Number(this.query.totalQuantity) > 0 && this.BookFoundByIsbnSearch[0] !== undefined) {
                this.query.bookID = this.BookFoundByIsbnSearch[0].id;
                this.postStock(this.query);
            } else {
                this.$toast.add(ToastService.error(MessageToasts.ERROR_REGISTER_STOCK, "Cadastro"));
            }
            this.resetFields();
        },
        resetFields(): void {
            this.query.isbn = '';
            this.query.bookID = '';
            this.query.totalQuantity = 1;
            this.isVisibleBookIsbn = false;
            this.isVisibleDialogRegister = false;
            this.disableQuantityInput = true;
        },
        showMenuOptions(event: any, item: Stock): void {
            this.stockCurrent = item;
            const menuStatus: any = this.$refs.menu;
            menuStatus.toggle(event);
        },
        showDialogEdit(): void {
            this.isVisibleDialogEdition = true;
        },
        confirmStockUpdate(): void {
            this.updateStock(String(this.stockCurrent.id), this.stockCurrent);
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_STOCK, "Atualização"));
            this.isVisibleDialogEdition = false;
        },
        getStockAll(): void {
            this.serviceStock.stock
                .subscribe({
                    next: (response) => {
                        this.contentStock = response.content;
                        this.pageStock = response.page;
                        this.sizeStock = response.size;
                        this.totalStock = response.total;
                    }
                });
            this.serviceStock.getAllStock(this.params);
        },
        postStock(body: QueryParams): void {
            this.serviceStock.stockModify
                .pipe(take(1))
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_CREATE_STOCK, "Cadastro"));
                            this.getStockAll();
                        } else {
                            this.$toast.add(ToastService.error(MessageToasts.INFO_REGISTER, "Cadastro"));
                        }
                    },
                });
            this.serviceStock.postBookToStock(body);
        },
        updateStock(id: string, body: Stock): void {
            this.serviceStock.stockModify
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.getStockAll();
                    }
                });
            this.serviceStock.updateStock(id, body);
        },
        deleteStock(): void {
            this.serviceStock.stockModify
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.visibleDeleteDialog = false;
                        this.getStockAll();
                        this.$toast.add(ToastService.success(MessageToasts.SUCCESS_DELETE_STOCK, "Sucesso!"));
                    },
                });
            if (this.stockCurrent.id) {
                this.serviceStock.deleteStock(this.stockCurrent.id);
            }
        },
        getBookIsbn(query: QueryParams): void {
            this.serviceStock.book
                .pipe(take(1))
                .subscribe({
                    next: (response) => {
                        this.BookFoundByIsbnSearch = response.content;
                        if (Object.values(this.BookFoundByIsbnSearch).length) {
                            this.isVisibleBookIsbn = true;
                        } else {
                            this.$toast.add(ToastService.error(MessageToasts.ERROR_REGISTER_BOOK, "Cadastro"));
                        }
                    },
                });
            this.serviceStock.getBookPerIsbn(query);
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
        openDeleteDialog(isVisible: boolean): void {
            isVisible ? this.visibleDeleteDialog = false : this.visibleDeleteDialog = true;
        },
    },
})
</script>