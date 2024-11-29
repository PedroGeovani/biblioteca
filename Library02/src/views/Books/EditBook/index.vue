<script lang="ts">
import { Book } from "@/models/book-page.model";
import { BookUtil } from "@/utils/books.utils";
import { defineComponent } from "vue";
import { BookService } from "../books.service";
import CategoryService from "@/views/Category/category.service";
import { QueryParams } from "@/models/query-params.model";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { validateAuthorName, validateIsbn } from "@/utils/validator.utils";
import { ToastService } from "@/utils/toast-service.utils";
import { MessageToasts } from "@/utils/toast-messages.utils";
import { capitalize } from "@/utils/capitalize.utils";
import { Category } from "@/models/category.model";

export default defineComponent({
    setup() {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            queryParams: new QueryParams,
            editedBook: {} as Book,
            categories: [] as Category[],
            publicationDate: undefined,
            newPublicationDate: new Date() || undefined,
            isChangeDate: false,
            selectedCategory: {
                id: "",
                name: ""
            } as Category,
            selectedStatus: {
                name: ""
            },
            filterOptionsStatus: [
                { name: "Disponível" },
                { name: "Emprestado" },
                { name: "Indisponível" }
            ],
        }
    },
    mounted() {
        this.getBook();
    },
    validations() {
        return {
            editedBook: {
                author: {
                    required: helpers.withMessage("Campo Obrigatório", required),
                    validateAuthor: helpers.withMessage("Nome inválido", this.isValidAuthorName)
                },
                isbn: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    validateIsbn: helpers.withMessage("Isbn deve ser no formato 123-1-123-12345-1", this.isValidIsbn)
                },
                title: {
                    required: helpers.withMessage("Campo Obrigatório", required),
                },
                publisher: {
                    required: helpers.withMessage("Campo Obrigatório", required),
                },
                publicationDate: {
                    required: helpers.withMessage("Campo Obrigatório", required),
                },
                status: {
                    required: helpers.withMessage("Selecione o status", required),
                },
                listCategories: {
                    required: helpers.withMessage("Selecione a categoria", required),
                }
            }
        }
    },
    computed: {
        serviceBook(): BookService {
            return new BookService();
        },
        serviceCategory(): CategoryService {
            return new CategoryService();
        },
        bookUtils(): BookUtil {
            return new BookUtil();
        },
        titleErrorMessage(): string {
            return this.v$?.editedBook?.title?.$errors[0]?.$message;
        },
        isbnErrorMessage(): string {
            return this.v$?.editedBook?.isbn?.$errors[0]?.$message;
        },
        authorErrorMessage(): string {
            return this.v$?.editedBook?.author?.$errors[0]?.$message;
        },
        publisherErrorMessage(): string {
            return this.v$?.editedBook?.publisher?.$errors[0]?.$message;
        },
        publicationDateErrorMessage(): string {
            return this.v$?.editedBook?.publicationDate?.$errors[0]?.$message;
        },
        statusErrorMessage(): string {
            return this.v$?.editedBook?.status?.$errors[0]?.$message;
        },
        listCategorieErrorMessage(): string {
            return this.v$?.editedBook?.listCategories?.$errors[0]?.$message;
        }
    },
    methods: {
        validateInputs(): void {
            this.fillFieldsEditedBook();
            this.v$.$validate();
            if (!this.v$.$invalid) {
                this.updateBook();
            } else {
                this.showErrorToast();
            }
        },
        verifyPublicationDateField(): void {
            if (this.publicationDate !== undefined && this.publicationDate !== null) {
                this.newPublicationDate = new Date(String(this.publicationDate));
                this.editedBook.publicationDate = this.newPublicationDate.toISOString();
                this.isChangeDate = true;
            }
        },
        isValidAuthorName(author: string): boolean {
            return validateAuthorName(author);
        },
        isValidIsbn(isbn: string): boolean {
            return validateIsbn(isbn);
        },
        updateBook(): void {
            this.serviceBook.books.subscribe({
                next: (response) => {
                    if (response.name !== "AxiosError") {
                        this.showSucessToast();
                    }
                },
                error: () => { }
            });
            this.serviceBook.updateBook(this.$route.params.id.toString(), this.editedBook);
            this.$router.push("/books");
        },
        fillFieldsEditedBook(): void {
            this.editedBook.author = this.capitalizeFields(this.editedBook.author!);
            this.editedBook.publisher = this.capitalizeFields(this.editedBook.publisher!);
            this.editedBook.title = this.capitalizeFields(this.editedBook.title!);
            this.editedBook.status = this.bookUtils.verifySelectedStatus(this.selectedStatus.name);
            this.verifyPublicationDateField();
            if (this.selectedCategory.name !== "") {
                this.editedBook.listCategories![0] = this.selectedCategory;
            }
        },
        capitalizeFields(text: string): string {
            return capitalize(text);
        },
        getBook(): void {
            this.queryParams.id = this.$route.params.id.toString();
            this.serviceBook.books
                .subscribe({
                    next: (response) => {
                        this.editedBook = response.content[0] || null;
                        this.selectedStatus.name = this.bookUtils.translateStatusToPTBR(this.editedBook.status!);
                        this.getAllCategories();
                        this.convertPublicationDate(this.editedBook.publicationDate!);
                        this.selectedCategory = this.editedBook.listCategories![0];
                    }, error: () => {
                        this.$toast.add(ToastService.error(MessageToasts.ERROR_GET_BOOK, "Error"));
                    }
                })
            this.serviceBook.getBooksPerPage(this.queryParams);
        },
        getAllCategories(queryParams = new QueryParams): void {
            this.serviceCategory.categories.subscribe({
                next: (response) => {
                    this.categories = response.content;
                }
            })
            this.serviceCategory.getAllCategories(queryParams);
        },
        convertPublicationDate(date: string): void {
            this.editedBook.publicationDate = this.formatPublicationDate(date);
        },
        formatPublicationDate(publicationDate: string): string {
            let fullDateWithoutMilliseconds: string;
            let milliseconds: string;
            publicationDate = publicationDate.slice(0, publicationDate.indexOf("+"));
            fullDateWithoutMilliseconds = publicationDate.split("*")[0];
            milliseconds = publicationDate.split("*")[1];
            return fullDateWithoutMilliseconds + "." + milliseconds + "Z";
        },
        showSucessToast(): void {
            if (!this.isChangeDate) {
                this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_BOOK_OLD_DATE));
            } else {
                this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_BOOK_NEW_DATE));
            }
        },
        showErrorToast(): void {
            this.$toast.add(ToastService.error(MessageToasts.ERROR_UPDATE_BOOK, "Error"));
        }
    }
})
</script>

<template>
    <main class="w-full h-screen font-inter inline-flex">
        <div class="w-full h-full">
            <headerSubView :titleHeader="'Editar Livro'" @returnButton="$router.push({ path: '/books' })" />
            <section class="w-full h-auto flex flex-col overflow-hidden">
                <div class="w-full h-full grid grid-row-6 sm:grid-cols-3">
                    <div class="flex flex-col items-start mb-4">
                        <label for="title" class="w-[85%] mx-auto">Titulo:</label>
                        <InputText id="title" v-model="editedBook.title"
                            class="w-[85%] mx-auto rounded-md h-9 mt-1 !border" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ titleErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="isbn" class="w-[85%] mx-auto">Isbn:</label>
                        <InputText id="isbn" v-model="editedBook.isbn" class="!w-[85%] !mx-auto rounded-md h-9 mt-1" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ isbnErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="categorie" class="w-[85%] mx-auto">Categoria:</label>
                        <Select id="categorie" v-model="selectedCategory" :options="categories" optionLabel="name"
                            class="w-[85%] rounded-md h-9 mx-auto mt-1 border" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ listCategorieErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="author" class="w-[85%] mx-auto">Autor:</label>
                        <InputText id="author" v-model="editedBook.author"
                            class="w-[85%] mx-auto rounded-md h-9 mt-1 !border" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ authorErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="publisher" class="w-[85%] mx-auto">Editora:</label>
                        <InputText id="publisher" v-model="editedBook.publisher"
                            class="w-[85%] mx-auto rounded-md h-9 mt-1 !border" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ publisherErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="status" class="w-[85%] mx-auto">Status:</label>
                        <Select id="status" v-model="selectedStatus" :options="filterOptionsStatus" optionLabel="name"
                            class="w-[85%] mx-auto rounded-md h-9 mt-1 !border" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ statusErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start">
                        <label for="date" class="w-[85%] mx-auto">Publicado em:</label>
                        <DatePicker id="date" v-model="publicationDate" showIcon fluid :showOnFocus="false"
                            dateFormat="dd/mm/yy" class="w-[85%] mx-auto h-9" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ publicationDateErrorMessage }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-4 lg:gap-6 pt-[9%] lg:pt-[3%]">
                    <Button type="button" class="!rounded-lg w-1/2 lg:w-1/6 active:scale-95" outlined severity="danger"
                        label="Cancelar" aria-label="Cancelar o cadastro" @click="$router.push('/books')" />
                    <Button type="button"
                        class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 lg:w-1/6 active:scale-95"
                        label="Salvar" aria-label="Confirmar a edição" @click="validateInputs()" />
                </div>
            </section>
        </div>
    </main>
</template>
