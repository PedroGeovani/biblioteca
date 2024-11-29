<template>
    <main class="font-inter">
        <headerSubView :titleHeader="'Detalhe Reserva'" @returnButton="navigateToBack" />
        <Card class="border rounded mt-10">
            <template #title>
                <span class="text-2xl ml-4">Reserva</span>
            </template>
            <template #content>
                <section class="mt-4 p-4">
                    <section class="flex flex-wrap gap-6">
                        <div class="flex flex-col">
                            <label for="startReserveDate" class="text-gray-800 mb-1">Iniciado em:</label>
                            <DatePicker v-model="startReserveDate" dateFormat="dd/mm/yy" showIcon id="startReserveDate"
                                :showOnFocus="false" disabled>
                            </DatePicker>
                        </div>
                        <div class="flex flex-col">
                            <label for="endReserveDate" class="text-gray-800 mb-1">Finaliza em:</label>
                            <DatePicker v-model="endReserveDate" dateFormat="dd/mm/yy" showIcon id="endReserveDate"
                                disabled>
                            </DatePicker>
                        </div>
                    </section>
                </section>

                <div class="mt-4 items-center grid  grid-cols-1 lg:grid-cols-3 gap-9 lg:gap-7 ml-4">
                    <div class="border p-4 rounded-md lg:h-32">
                        <div class="flex justify-end">
                            <v-icon @click="visibleEditDialog = true" name="pr-pencil"
                                class="cursor-pointer hover:bg-gray-100 rounded-full" />
                        </div>
                        <p> <span class="text-[#808080]">Isbn: </span>{{ currentReserve.book?.isbn }} </p>
                        <p> <span class="text-[#808080]">Título: </span>{{ currentReserve.book?.title }}</p>
                        <p> <span class="text-[#808080]">Autor: </span>{{ currentReserve.book?.author }}</p>
                    </div>

                    <div class="border p-4 rounded-md lg:h-32">
                        <p class="pt-4"> <span class="text-[#808080]">E-mail: </span>{{ currentReserve.user?.email }}
                        </p>
                        <p> <span class="text-[#808080]">Estudante: </span>{{ currentReserve.user?.name }}</p>
                    </div>
                </div>
                <div class="mt-10 flex justify-end">
                    <Button @click="navigateToBack" severity="danger" label="Cancelar" outlined
                        class="mt-4 ml-4 w-1/2 lg:w-1/6" />
                    <Button @click="updateReserve" label="Salvar" class="!bg-emerald-600 mt-4 ml-4 w-1/2 lg:w-1/6" />
                </div>
            </template>
        </Card>

        <Dialog v-model:visible="visibleEditDialog" modal pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]"
            class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]">
            <template #header>
                <span class="text-3xl font-semibold">Editar reserva</span>
            </template>
            <span>Livro:</span>

            <IconField>
                <InputMask v-model="bookSearchedByIsbn" mask="999-9-999-99999-9" placeholder="Digite o isbn"
                    class="w-full" v-debounce:100ms="getBooksByIsbn" />
                <InputIcon class="pi pi-search" />
            </IconField>

            <DataView :value="booksGroup" data-key="id">
                <template #empty>
                    <div class="mt-4 mb-2 pl-1 bg-[#F2F2F7]">
                        <p>Se o livro existir, ele aparecerá aqui.</p>
                    </div>
                </template>
                <template #list="books">
                    <section v-for="bookInList in books.items" :key="bookInList.id"
                        class="p-4 border border-gray-300 rounded-lg mt-6 flex justify-between items-center">
                        <div>
                            <p class="mb-2">Título: {{ bookInList.title }}</p>
                            <p>Autor: {{ bookInList.author }}</p>
                        </div>

                        <div class="items-center mb-2">
                            <Button v-if="bookInList.status === 'UNAVAILABLE'" label="Selecionar"
                                class="!bg-[#009951] !border-[#2C2C2C] px-4 py-2"
                                @click="selectBook(bookInList)" />
                            <Button v-else disabled label="Indisponível"
                                class="!bg-[#C00F0C] !border-[#C00F0C] text-white px-4 py-2" />
                        </div>
                    </section>
                </template>
            </DataView>
        </Dialog>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ReserveService } from './reserve.service';
import { Reserve } from '@/models/reserve.model';
import { AdjustScreen } from '@/utils/adjust-screen.utils';
import { QueryParams } from '@/models/query-params.model';
import { Book } from '@/models/book-page.model';
import { BookService } from '../Books/books.service';
import vueDebounce from "vue-debounce";
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { take } from 'rxjs';

export default defineComponent({
    name: "DetailsReserve",
    directives: {
        debounce: vueDebounce({ lock: true }),
    },
    data() {
        return {
            currentReserve: {} as Reserve,
            startReserveDate: new Date(),
            endReserveDate: new Date(),
            visibleEditDialog: false as boolean,
            bookSearchedByIsbn: "",
            query: new QueryParams(),
            booksGroup: [] as Book[],
            bookToReserve: new Book()
        }
    },
    methods: {
        getReserveById(id: string): void {
            this.reserveService.reserve.subscribe({
                next: (response) => {
                    this.currentReserve = response;
                    this.startReserveDate = this.formattedDate(response?.dateReserveCreated);
                    this.endReserveDate = this.formattedDate(response?.dateReserveAvailable);
                    this.scrollScreenToTop();
                },
                error: () => {
                    this.$toast.add(ToastService.error(MessageToasts.ERROR_UPDATE_RESERVE, 'Não foi possível editar'));
                }
            });
            this.reserveService.getReserveById(id);
        },
        formattedDate(date: Date): Date {
            return new Date(String(date).split('T')[0] + "T00:00:00");
        },
        navigateToBack(): void {
            this.$router.go(-1);
        },
        getBooksByIsbn(): void {
            this.query.isbn = this.bookSearchedByIsbn
            this.bookService.books.subscribe({
                next: (response) => {
                    this.booksGroup = response.content;
                },
            });
            this.bookService.getBooksPerPage(this.query);
        },
        selectBook(book: Book): void {
            this.currentReserve.book = book;
            this.bookToReserve = book;
            this.visibleEditDialog = false;
        },
        updateReserve(): void {
            if (this.bookToReserve.id != undefined && this.currentReserve.id != undefined) {
                this.reserveService.reserve.pipe(take(1)).subscribe({
                    next: () => {
                        this.visibleEditDialog = false;
                        this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_RESERVE));
                        this.navigateToBack();
                    },
                    error: () => {
                        this.$toast.add(ToastService.error(MessageToasts.ERROR_UPDATE_RESERVE, 'Não foi possível editar'));
                    }

                });
                this.reserveService.updateReserve(this.currentReserve.id, this.bookToReserve.id);
            }
        }
    },
    computed: {
        reserveService(): ReserveService {
            return new ReserveService();
        },
        scrollScreenToTop(): Function {
            return AdjustScreen.getWindowScrollToTop;
        },
        bookService(): BookService {
            return new BookService();
        },
        idCurrentReserve(): string {
            return String(this.$route.params.id);
        }
    },
    mounted() {
        this.getReserveById(this.idCurrentReserve);
    }
})
</script>