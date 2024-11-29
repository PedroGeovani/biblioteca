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
            newBook: {
                author: "",
                isbn: "",
                listCategories: [] as Category[],
                publisher: "",
                status: "",
                title: ""
            } as Book,
            publicationDate: undefined,
            newDate: new Date() || undefined,
            categories: [] as Category[],
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
        this.getAllCategories()
    },
    validations() {
        return {
            newBook: {
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
            return this.v$?.newBook?.title?.$errors[0]?.$message;
        },
        isbnErrorMessage(): string {
            return this.v$?.newBook?.isbn?.$errors[0]?.$message;
        },
        authorErrorMessage(): string {
            return this.v$?.newBook?.author?.$errors[0]?.$message;
        },
        publisherErrorMessage(): string {
            return this.v$?.newBook?.publisher?.$errors[0]?.$message;
        },
        publicationDateErrorMessage(): string {
            return this.v$?.newBook?.publicationDate?.$errors[0]?.$message;
        },
        statusErrorMessage(): string {
            return this.v$?.newBook?.status?.$errors[0]?.$message;
        },
        listCategorieErrorMessage(): string {
            return this.v$?.newBook?.listCategories?.$errors[0]?.$message;
        }
    },
    methods: {
        validateInputs(): void {
            this.fillFieldsNewBook();
            this.v$.$validate();
            if (!this.v$.$invalid) {
                this.createBook();
            } else {
                this.showErrorToast();
            }
        },
        verifyPublicationDateField(): void {
            if (this.publicationDate !== undefined && this.publicationDate !== null) {
                this.newDate = new Date(String(this.publicationDate));
                this.newBook.publicationDate = this.newDate.toISOString();
            }
        },
        isValidAuthorName(author: string): boolean {
            return validateAuthorName(author);
        },
        isValidIsbn(isbn: string): boolean {
            return validateIsbn(isbn);
        },
        createBook(): void {
            this.serviceBook.books
                .subscribe({
                    next: (response) => {
                        if (response.name !== "AxiosError") {
                            this.showSucessToast();
                        }
                    },
                    error: () => { }
                });
            this.serviceBook.createBook(this.newBook);
            this.$router.push("/books");
        },
        fillFieldsNewBook(): void {
            this.newBook.author = this.capitalizeFields(this.newBook.author!);
            this.newBook.publisher = this.capitalizeFields(this.newBook.publisher!);
            this.newBook.title = this.capitalizeFields(this.newBook.title!);
            this.newBook.status = this.bookUtils.verifySelectedStatus(this.selectedStatus.name);
            this.verifyPublicationDateField();
            if (this.selectedCategory.name !== "") {
                this.newBook.listCategories?.push(this.selectedCategory);
            }
        },
        getAllCategories(queryParams = new QueryParams): void {
            this.serviceCategory.categories.subscribe({
                next: (response) => {
                    this.categories = response.content;
                }
            })
            this.serviceCategory.getAllCategories(queryParams);
        },
        capitalizeFields(text: string): string {
            return capitalize(text);
        },
        showSucessToast(): void {
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_CREATE_BOOK));
        },
        showErrorToast(): void {
            this.$toast.add(ToastService.error(MessageToasts.ERROR_CREATE_BOOK, "Error"));
        }
    }
})
</script>

<template>
    <main class="w-full h-screen font-inter inline-flex">
        <div class="w-full h-full">
            <headerSubView :titleHeader="'Cadastrar Livro'" @returnButton="$router.push({ path: '/books' })" />
            <section class="w-full h-auto flex flex-col overflow-hidden">
                <div class="w-full h-full grid grid-flow-row lg:grid-cols-3 mb-10 gap-0 lg:gap-4">
                    <div class="flex flex-col items-start mb-4">
                        <label for="title">Titulo:</label>
                        <InputText id="title" v-model="newBook.title" placeholder="Digite o título"
                            class="rounded-md h-9 mt-1 !border w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ titleErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="isbn">Isbn:</label>
                        <InputMask id="isbn" v-model="newBook.isbn" placeholder="Formato isbn: 123-1-123-12345-1"
                            mask="999-9-999-99999-9" class="!rounded-md h-9 mt-1 w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ isbnErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="categorie">Categoria:</label>
                        <Select id="categorie" v-model="selectedCategory" :options="categories" optionLabel="name"
                            class="rounded-md h-9 mt-1 border w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ listCategorieErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="author">Autor:</label>
                        <InputText id="author" v-model="newBook.author" placeholder="Digite o autor"
                            class="rounded-md h-9 mt-1 !border w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ authorErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="publisher">Editora:</label>
                        <InputText id="publisher" v-model="newBook.publisher" placeholder="Digite a editora"
                            class="rounded-md h-9 mt-1 !border w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ publisherErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start mb-4">
                        <label for="status">Status:</label>
                        <Select id="status" v-model="selectedStatus" :options="filterOptionsStatus" optionLabel="name"
                            class="rounded-md h-9 mt-1 !border-[1px] w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ statusErrorMessage }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start">
                        <label for="date">Publicado em:</label>
                        <DatePicker id="date" v-model="publicationDate" showIcon fluid :showOnFocus="false"
                            dateFormat="dd/mm/yy" class=" h-9 w-full" />
                        <div v-if="v$.$errors" class="mt-2 mx-auto">
                            <span class="text-red-900">
                                {{ publicationDateErrorMessage }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-4">
                    <Button label="Cancelar" severity="danger" outlined class="w-1/2 lg:w-1/6"
                        @click="$router.push('/books')" />
                    <Button label="Cadastrar" @click="validateInputs()" severity="success"
                        class="w-1/2 lg:w-1/6 !bg-[#059669]" />
                </div>
            </section>
        </div>
    </main>
</template>
