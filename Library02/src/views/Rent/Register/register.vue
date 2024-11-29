<script lang="ts">
import { defineComponent } from 'vue';
import { RentService } from '../rent.service';
import { Rent, RentTo } from '@/models/rent.model';
import { QueryParams } from '@/models/query-params.model';
import { BookService } from '@/views/Books/books.service';
import { Book, Status } from '@/models/book-page.model';
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';

export default defineComponent({
    name: 'RentRegister',
    data() {
        return {
            rentRegister: {} as Rent,
            idBook: '',
            books: [] as Book[],
            queryParams: new QueryParams(),
            totalBooks: 1,
            bookById: {} as Book,
            detailBook: {} as Book,
            inputSearchBook: '',
            debounceTimeout: null as number | null
        };
    },
    mounted() {
        this.getAllBooks();
        this.getTotalBooks();
    },
    methods: {
        debounce(fn: Function, delay: number) {
            return (...args: any[]) => {
                if (this.debounceTimeout) {
                    clearTimeout(this.debounceTimeout);
                }
                this.debounceTimeout = window.setTimeout(() => {
                    fn(...args);
                }, delay);
            };
        },
        getTotalBooks(): void {
            this.serviceBook.books.subscribe({
                next: (response) => {
                    this.books = response.content;
                    this.totalBooks = response.total;
                },
            });
            this.serviceBook.getBooksPerPage(this.queryParams);
        },
        getAllBooks(): void {
            this.serviceBook.books.subscribe({
                next: (response) => {
                    this.books = response.content;
                },
            });
            this.serviceBook.getBooksPerPage({ page: 0, size: this.totalBooks } as QueryParams);
        },
        getBookByTittle(): void {
            this.queryParams.title = this.inputSearchBook;
            this.serviceBook.books.subscribe({
                next: (response) => {
                    this.books = response.content;
                },
            });
            this.serviceBook.getBooksPerPage(this.queryParams);
        },
        handleInputSearchBook() {
            this.debounce(this.getBookByTittle, 300)();
        },
        backPage(): void {
            this.$router.push('/rents/1');
        },
        registerRent(): void {
            this.serviceRent.rent.subscribe({
                next: () => {
                    return this.$toast.add(ToastService.success(MessageToasts.SUCCESS_REGISTER_RENT));
                },
                error: () => {
                    return this.$toast.add(ToastService.error(MessageToasts.ERROR_REGISTER_RENT, 'ERRO'));
                }
            })
            this.serviceRent.createRent(new RentTo(this.idBook));
        },
        getIdBook(book: Book): void {
            this.idBook = book.id!;
        },
        getBookByButton(book: any): void {
            this.detailBook = book;
        },
        isAvailableStatusBook(status?: any): boolean {
            return status === Status.AVAILABLE;
        }
    },
    computed: {
        serviceRent(): RentService {
            return new RentService();
        },
        serviceBook(): BookService {
            return new BookService();
        }
    }
});
</script>

<template>
    <main class="flex flex-col font-inter">
        <headerSubView :titleHeader="'Cadastrar Empréstimo'" @returnButton="$router.push({ path: '/rents/1' })" />
        <div class="flex">
            <div class="p-4 border-2 rounded-lg border-gray-300">
                <div class="m-2">
                    <IconField>
                        <InputText v-model="inputSearchBook" @input="handleInputSearchBook" type="text" maxlength="50"
                            size="large" placeholder="Buscar livro" id="book" style="width: 100%;" />
                        <InputIcon class="pi pi-search" />
                    </IconField>
                </div>
                <div>
                    <div v-for="book in books" :key="book.id"
                        class="flex flex-col items-center md:flex-row md:justify-between rounded-md m-2 p-2 border border-gray-300">
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2">
                                <span class="text-lg">Título:</span>
                                <span class="text-lg text-gray-400">{{ book?.title }}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="text-lg">Autor:</span>
                                <span class="text-lg text-gray-400">{{ book?.author }}</span>
                            </div>
                        </div>
                        <div class="flex p-4">
                            <Button v-if="!isAvailableStatusBook(book.status)" class="custom-select-button px-4 py-2"
                                @click="getBookByButton(book), getIdBook(book)" label="Disponível">
                            </Button>
                            <Button v-else disabled class="custom-unavailable-button text-white px-4 py-2"
                                label="Indisponível">
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="border-2 rounded-lg border-gray-300 mt-5 p-2">
            <div class="flex flex-col gap-3 m-4 text-xl">
                <div>
                    <span class=" text-gray-400 mb-2">Isbn:</span>
                    <span class=" text-black mb-2 ml-2">{{ detailBook.isbn }}</span>
                </div>
                <div>
                    <span class=" text-gray-400 mb-2">Título:</span>
                    <span class=" text-black mb-2 ml-2">{{ detailBook.title }}</span>
                </div>
                <div>
                    <span class=" text-gray-400">Autor:</span>
                    <span class=" text-black mb-2 ml-2">{{ detailBook.author }}</span>
                </div>
            </div>
            <div class=" flex justify-end gap-2">
                <Button class="me-2 !text-red-700 !px-12" style="border-radius: 8px;
                            background-color: white;
                            border-color: #B91C1C" label="Cancelar" @click="backPage()">
                </Button>
                <Button class="!px-12" style="border-radius: 8px;
                            background-color: #059669;" @click="registerRent(), backPage()" label="Cadastrar">
                </Button>
            </div>
        </div>
    </main>
</template>
