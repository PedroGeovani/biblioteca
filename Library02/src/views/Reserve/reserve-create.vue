<template>
    <main class="font-inter w-full">
        <headerSubView :titleHeader="'Cadastrar Reserva'" @returnButton="$router.push({ path: '/reserves' })" />
        <div class="mt-12">
            <Card class="border rounded mb-10 w-full">
                <template #title>
                    <span class="text-xl ml-2">Livro:</span>
                </template>
                <template #content>
                    <IconField class="w-full lg:w-fit items-center">
                        <InputText v-model="bookSearchedByTitle" type="text" maxlength="50" size="large"
                            placeholder="Buscar livro" id="book" class="w-full" v-debounce:250ms="getBooksByTitle" />
                        <InputIcon class="pi pi-search" />
                    </IconField>

                    <DataView :value="booksGroup" data-key="id">
                        <template #empty>
                            <div class="mt-2 mb-2">
                                <p v-if="!isLoading && totalResults === 0" class="text-[#C00F0C]">Não foi possível
                                    encontrar livros.</p>
                            </div>
                        </template>
                        <template #list="books">
                            <section v-for="bookInList in books.items" :key="bookInList.id"
                                class="p-4 border border-gray-300 rounded-lg mt-6 flex justify-between items-center flex-col md:flex-row">
                                <div>
                                    <p class="mb-2">Título: {{ bookInList.title }}</p>
                                    <p>Autor: {{ bookInList.author }}</p>
                                </div>

                                <div class="items-center mb-2 pt-4 md:p-0">
                                    <a v-if="bookInList.status === 'UNAVAILABLE'" href="#createReserve">
                                        <Button label="Selecionar"
                                            class="!bg-[#009951] !border-[#02542D] active:scale-95 px-4 py-2"
                                            @click="selectBook(bookInList)" />
                                    </a>
                                    <Button v-else disabled label="Indisponível"
                                        class="!bg-[#C00F0C] !border-[#C00F0C] text-white px-4 py-2" />
                                </div>
                            </section>
                        </template>
                        <template #footer>
                            <Paginator :rows="query.size" :page="query.page" :first="firstElementPage"
                                :total-records="totalResults" @page="onPaginate"
                                :page-link-size="isMobileScreen ? 2 : undefined"
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
                        </template>
                    </DataView>
                </template>
            </Card>
            <Card v-if="isChosenBooks()" class="border rounded mb-10" id="createReserve">
                <template #title>
                    <span class="text-2xl ml-4">Reserva</span>
                </template>
                <template #content>
                    <div class="mt-4 ml-4 flex items-end gap-4">
                        <div class="flex flex-wrap gap-8">
                            <div class="flex flex-col">
                                <label for="startReserveDate" class="text-gray-800 mb-1">Iniciado em:</label>
                                <DatePicker v-model="startReserveDate" dateFormat="dd/mm/yy" showIcon
                                    id="startReserveDate" disabled />
                            </div>
                            <div class="flex flex-col">
                                <label for="endReserveDate" class="text-gray-800 mb-1">Finaliza em:</label>
                                <DatePicker v-model="endReserveDate" dateFormat="dd/mm/yy" showIcon id="endReserveDate"
                                    disabled />
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 ml-4">
                        <div>
                            <p> <span class="text-[#808080]">Isbn: </span>{{ bookSelected.isbn }}</p>
                            <p> <span class="text-[#808080]">Título: </span>{{ bookSelected.title }}</p>
                            <p> <span class="text-[#808080]">Autor: </span>{{ bookSelected.author }}</p>
                        </div>

                        <div>
                            <p> <span class="text-[#808080]">E-mail: </span>{{ userSelected.email }}</p>
                            <p> <span class="text-[#808080]">Estudante: </span>{{ userSelected.name }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end gap-4">
                        <Button @click="onCancelReserve" label="Cancelar" severity="danger" outlined
                            class="active:scale-95 mt-4 w-1/2 lg:w-1/6" />
                        <Button @click="createNewReserve" label="Cadastrar"
                            class="!bg-emerald-600 mt-4 w-1/2 lg:w-1/6 active:scale-95 " />
                    </div>
                </template>
            </Card>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BookService } from '../Books/books.service';
import { Book } from '@/models/book-page.model';
import { ReserveService } from './reserve.service';
import { User } from '@/models/user.model';
import { UserStorage } from '@/utils/user-data.utils';
import { QueryParams } from '@/models/query-params.model';
import vueDebounce from "vue-debounce";
import { PageState } from 'primevue/paginator';
import { AdjustScreen } from '@/utils/adjust-screen.utils';
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { take } from 'rxjs';
import { ScreenSize } from '@/utils/paginator-screen.utils';

export default defineComponent({
    name: "CreateReserve",
    directives: {
        debounce: vueDebounce({ lock: true }),
    },
    data() {
        return {
            bookSearchedByTitle: "",
            isLoading: true as boolean,
            booksGroup: [] as Book[],
            bookSelected: new Book(),
            userSelected: new User(),
            userStorage: new UserStorage(),
            query: new QueryParams(),
            totalResults: 0 as number,
            startReserveDate: new Date(),
            endReserveDate: new Date(),
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile())
        };
    },
    methods: {
        getBooksPerPage(): void {
            this.bookService.books.subscribe({
                next: (response) => {
                    this.booksGroup = response.content;
                    this.totalResults = response.total;
                    this.isLoading = false;
                },
            });
            this.bookService.getBooksPerPage(this.query);
        },
        getBooksByTitle(): void {
            this.query.title = this.bookSearchedByTitle;

            this.bookService.books.subscribe({
                next: (response) => {
                    this.booksGroup = response.content;
                    this.isLoading = false;
                }
            });
            this.bookService.getBooksPerPage(this.query);
        },
        getCurrentUser(): void {
            const email = this.userStorage.getEmail();
            if (email) this.userSelected.email = email;

            const name = this.userStorage.getName();
            if (name) this.userSelected.name = name;
        },
        selectBook(book: Book): void {
            this.getCurrentUser();
            this.bookSelected = book;
        },
        isChosenBooks(): Boolean {
            if (this.bookSelected.id != undefined) {
                return true;
            }
            return false;
        },
        createNewReserve(): void {
            if (this.bookSelected.id != undefined) {
                this.reserveService.reserve.pipe(take(1)).subscribe({
                    next: (response) => {
                        if (response) {
                            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_CREATE_RESERVE));
                            this.navigateBackToReserves();
                        } else {
                            this.$toast.add(ToastService.error(MessageToasts.ERROR_CREATE_RESERVE, 'Não foi possível reservar'));
                        }
                    },
                });
                this.reserveService.createReserve(this.bookSelected.id);
            }
        },
        onCancelReserve(): void {
            this.bookSelected = new Book();
            this.userSelected = new User();
            this.scrollScreenToTop();
        },
        onPaginate(event: PageState): void {
            this.query.page = event.page;
            this.$router.push({ name: "reservesCreate", query: { page: this.query.page } });
            this.scrollScreenToTop();
            this.getBooksPerPage();
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
        getEndReserveDate(): void {
            const currentDate = this.endReserveDate;
            const datePlusFifteen = new Date(currentDate.setDate(currentDate.getDate() + 15));
            this.endReserveDate = datePlusFifteen;
        },
        getIndexPage(): void {
            this.query.page = this.pageFromRoute;
        },
        navigateBackToReserves(): void {
            this.$router.push('/reserves');
        },
    },
    computed: {
        bookService(): BookService {
            return new BookService();
        },
        reserveService(): ReserveService {
            return new ReserveService();
        },
        scrollScreenToTop(): Function {
            return AdjustScreen.getWindowScrollToTop;
        },
        firstElementPage(): number {
            return this.query.page * this.query.size;
        },
        pageFromRoute(): number {
            return Number(this.$route.query.page) || 0;
        },
        addEventPaginatorResize(): void {
            return window.addEventListener('resize', this.currentScreenSize);
        },
    },
    mounted() {
        this.addEventPaginatorResize;
        this.getIndexPage();
        this.getBooksPerPage();
        this.getEndReserveDate();
    }
});
</script>