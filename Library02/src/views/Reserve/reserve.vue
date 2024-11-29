<template>
  <main class="font-inter w-full">
    <headerView :title-header="'Reservas'" :show-button-register="true" :show-filter="false"
      @actionButtonRegister="navigateTo('/reserves/create')" />
    <section class="min-w-56 p-1 sm:border-black sm:border-[1px] rounded-[10px]">
      <section v-for="field in allReserves" class="sm:hidden my-3 rounded-xl border-[1px] border-gray-600">
        <Card>
          <template #content>
              <div @click="getIdByEvent(String(field.id))">
              <div class="flex flex-row gap-3  my-2 border-b-[1px] border-gray-500">
                <span class="flex flex-wrap font-bold text-[16px] "> Titulo do livro: </span>
                <span class="flex flex-wrap text-[16px]"> {{ field.book?.title }} </span>
              </div>
              <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                <span class="flex flex-wrap font-bold text-[16px]"> Usuário: </span>
                <span class="flex flex-wrap text-[16px]"> {{ field.user?.name }} </span>
              </div>
              <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                <span class="flex flex-wrap font-bold text-[16px] "> Iniciada em: </span>
                <span class="flex flex-wrap text-[16px]"> {{ formatDate(field.dateReserveCreated) }} </span>
              </div>
              <div class="flex flex-row gap-3 my-2 border-b-[1px]">
                <span class="flex flex-wrap font-bold text-[16px] "> Finaliza em:: </span>
                <span class="flex flex-wrap text-[16px]"> {{ formatDate(field.dateReserveAvailable) }} </span>
              </div>
            </div>
              <div class="flex my-2">
                <span v-if="field.reserveStatus === 'AVAILABLE'"
                  class="flex flex-wrap bg-emerald-600 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                  {{ translateStatusToLabel(String(field.reserveStatus)) }} </span>
                <span v-if="field.reserveStatus === 'UNAVAILABLE'"
                  class="flex flex-wrap bg-red-700 rounded-lg justify-center items-center text-white w-full h-12 text-[16px]">
                  {{ translateStatusToLabel(String(field.reserveStatus)) }}</span>
                <div class="card flex justify-center">
                  <Button @click="showToggleOptions($event, field)" type="button" icon="pi pi-ellipsis-v"
                    class="flex items-center justify-center" unstyled aria-haspopup="true"
                    aria-controls="overlay_menu" />
                  <Menu ref="menu" id="overlay_menu" :model="toggleOptions" v-bind:popup="true" />
                </div>
              </div>
            </template>
          </Card>
      </section>
      <section class="hidden sm:block p-2 font-inter text-[16px]">
        <DataTable :value="allReserves" class="px-2 py-2 h-fit  cursor-pointer"
          @row-click="getIdByEvent($event.data.id)">
          <template #empty>
            <div class="mt-4 text-xl">
              <span v-if="!isLoading && totalResults === 0"> Não há reservas disponíveis.</span>
            </div>
          </template>
          <Column field="book.title" style="width: 20%">
            <template #header>
              <span class="text-xl font-semibold">Título Livro:</span>
            </template>
          </Column>
          <Column field="user.name" style="width: 20%">
            <template #header>
              <span class="text-xl font-semibold">Usuário:</span>
            </template>
          </Column>
          <Column field="dateReserveCreated" style="width: 20%">
            <template #header>
              <span class="text-xl font-semibold">Iniciada em:</span>
            </template>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.dateReserveCreated) }}
            </template>
          </Column>
          <Column field="dateReserveAvailable" style="width: 20%">
            <template #header>
              <span class="text-xl font-semibold">Finaliza em:</span>
            </template>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.dateReserveAvailable) }}
            </template>
          </Column>
          <Column field="reserveStatus" style="width: 20%">
            <template #header>
              <span class="text-xl font-semibold">Status:</span>
            </template>
            <template #body="slotProps">
              <section class="flex relative items-center">
                <p :class="{ 'bg-emerald-600': slotProps.data.reserveStatus === 'AVAILABLE', 'bg-red-700': slotProps.data.reserveStatus === 'UNAVAILABLE' }"
                  class="text-white p-3 w-32 items-center justify-center rounded-lg text-center">
                  {{ translateStatusToLabel(slotProps.data.reserveStatus) }}
                </p>
                <div class="card flex justify-center">
                  <Button @click="showToggleOptions($event, slotProps.data)" type="button" severity="secondary" text
                    aria-label="options" icon="pi pi-ellipsis-v" class="flex items-center justify-center mx-3"
                    aria-controls="overlay_menu" />
                  <Menu ref="menuPopUp" id="overlay_menu" :model="toggleOptions" :popup="true" />
                </div>
              </section>
            </template>
          </Column>
        </DataTable>
      </section>
      <Paginator :rows="query.size" :page="query.page" :first="firstElementPage" :total-records="totalResults"
        @page="onPaginate" :page-link-size="isMobileScreen ? 2 : undefined"
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
    <Dialog v-model:visible="visibleDeleteDialog" modal class="w-4/5 md:w-1/3">
      <template #header>
        <span class="text-2xl font-semibold">Deletar reserva</span>
      </template>
      <span class="text-surface-500 dark:text-surface-400 block mb-8">Deseja realmente deletar essa
        reserva?</span>
      <div class="flex justify-end flex-wrap gap-6">
        <Button type="button" class="text-[#C00F0C] hover:text-red-800" label="Cancelar"
          @click="visibleDeleteDialog = false" unstyled />
        <Button type="button" class="!bg-[#009951] !border-[#02542D]" label="Confirmar" @click="deleteReserve" />
      </div>
    </Dialog>
    <Dialog v-model:visible="visibleEditDialog" modal class="w-4/5 md:w-1/3">
      <template #header>
        <span class="text-3xl font-semibold">Editar reserva</span>
      </template>
      <span>Livro:</span>

      <span class="text-surface-500 dark:text-surface-400 block">Livro:</span>
      <IconField>
        <InputMask v-model="bookSearchedByIsbn" mask="999-9-999-99999-9" placeholder="Digite o isbn" class="w-full"
          v-debounce:100ms="getBooksByIsbn" />
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
                aria-label="Selecionar livro para reservar" class="!bg-[#009951] !border-[#2C2C2C] px-4 py-2"
                @click="selectBook(bookInList)" />
              <Button v-else disabled label="Indisponível" aria-label="Cancelar seleção de livro"
                class="!bg-[#C00F0C] !border-[#C00F0C] text-white px-4 py-2" />
            </div>
          </section>
        </template>
      </DataView>
    </Dialog>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Reserve } from '@/models/reserve.model';
import { ReserveService } from './reserve.service';
import { QueryParams } from '@/models/query-params.model';
import { PageState } from 'primevue/paginator';
import { RouteLocationRaw } from 'vue-router';
import { BookService } from '../Books/books.service';
import { Book } from '@/models/book-page.model';
import vueDebounce from "vue-debounce";
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { filter, take } from 'rxjs';
import { ScreenSize } from '@/utils/paginator-screen.utils';

export default defineComponent({
  name: "Reserve",
  directives: {
    debounce: vueDebounce({ lock: true }),
  },
  data() {
    return {
      query: new QueryParams(),
      isLoading: true as boolean,
      visibleDeleteDialog: false as boolean,
      visibleEditDialog: false as boolean,
      bookSearchedByIsbn: "",
      booksGroup: [] as Book[],
      bookToReserve: new Book(),
      currentReserve: new Reserve(),
      allReserves: [] as Reserve[],
      totalResults: 0 as number,
      endReserveDate: new Date(),
      toggleOptions: [
        {
          label: "Editar",
          icon: "pi pi-pencil",
          command: () => {
            this.openEditDialog(this.visibleEditDialog);
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
  methods: {
    getReserves(query: QueryParams): void {
      this.reserveService.allReserves.subscribe({
        next: (response) => {
          this.isLoading = false;
          this.allReserves = response.content;
          this.totalResults = response.total;
        },
        error: () => {
          this.$toast.add(ToastService.error(MessageToasts.ERROR_GET_ALL_RESERVES, 'Não foi possível carregar as reservas'));
        }
      });
      this.reserveService.getReserves(query);
    },
    getBooksByIsbn(): void {
      this.query.isbn = this.bookSearchedByIsbn;
      const query: QueryParams = {
        page: 0,
        size: this.query.size,
        isbn: this.query.isbn
      }

      this.bookService.books.subscribe({
        next: (response) => {
          this.booksGroup = response.content;
        },
      });
      this.bookService.getBooksPerPage(query);
    },
    formatDate(date: Date | undefined): string {
      if (!date) return '';
      return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    },
    translateStatusToLabel(status: string): string {
      return status === 'AVAILABLE' ? 'Disponível' : 'Indisponível';
    },
    currentScreenSize(): void {
      this.isMobileScreen = ScreenSize.isScreenSizeMobile();
    },
    openDeleteDialog(isVisible: boolean): void {
      isVisible ? this.visibleDeleteDialog = false : this.visibleDeleteDialog = true;
    },
    openEditDialog(isVisible: boolean): void {
      isVisible ? this.visibleEditDialog = false : this.visibleEditDialog = true;
    },
    showToggleOptions(event: Event, reserve: Reserve): void {
      const ref = this.$refs.menuPopUp as any;
      this.setSelectedReserve(reserve);
      ref.toggle(event);
    },
    setSelectedReserve(reserve: Reserve): void {
      this.currentReserve = reserve;
    },
    selectBook(book: Book): void {
      this.bookToReserve = book;
      this.updateReserve();
    },
    updateReserve(): void {
      if (this.currentReserve.id && this.bookToReserve.id) {
        this.reserveService.reserve.pipe(take(1)).subscribe({
          next: () => {
            this.visibleEditDialog = false;
            this.getReserves(this.query);
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_RESERVE));
          },
          error: () => {
            this.$toast.add(ToastService.error(MessageToasts.ERROR_UPDATE_RESERVE, 'Não foi possível editar'));
          }
        });

        this.reserveService.updateReserve(this.currentReserve.id, this.bookToReserve.id);
      }
    },
    deleteReserve(): void {
      if (this.currentReserve.id) {
        this.reserveService.reserve.pipe(take(1)).subscribe({
          next: () => {
            this.visibleDeleteDialog = false;
            this.getReserves(this.query);
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_DELETE_RESERVE));
          },
          error: () => {
            this.$toast.add(ToastService.error(MessageToasts.ERROR_DELETE_RESERVE, 'Não foi possível deletar'));
          }
        });

        this.reserveService.deleteReserve(this.currentReserve.id);
      }
    },
    onPaginate(event: PageState): void {
      this.query.page = event.page;
      this.$router.push({ name: "reserves", query: { page: this.query.page } });
      this.getReserves(this.query);
    },
    navigateTo(route: RouteLocationRaw): void {
      this.$router.push(route);
    },
    getIdByEvent(idReserve: string): void {
      this.$router.push(`/reserves/details/${idReserve}`);
    },
    getIndexPage(): void {
      this.query.page = this.pageFromRoute;
    },
  },
  computed: {
    reserveService(): ReserveService {
      return new ReserveService();
    },
    bookService(): BookService {
      return new BookService();
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
    this.getIndexPage();
    this.getReserves(this.query);
    this.addEventPaginatorResize;
  }
});
</script>