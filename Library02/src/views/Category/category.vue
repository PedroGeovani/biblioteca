<template>
    <main class="flex relative w-full flex-col justify-between gap-8 font-inter" aria-labelledby="section-title">
        <h1 id="section-title" class="text-3xl font-semibold">Categoria</h1>
        <Card class="border-gray-800 border rounded-lg w-full px-2 lg:w-2/3 lg:px-4">
            <template #content>
                <label for="categoryInput" class="justify-start pt-0 w-full">Gênero:</label>
                <form @submit.prevent="validateInput"
                    class="flex flex-col md:flex-row gap-3 lg:gap-5 w-full pt-2 pb-3 justify-center">
                    <InputText id="categoryInput" aria-label="Input" placeholder="Digite um novo gênero" type="text"
                        size="large" class="md:w-2/3 w-full md:text-base text-xs" v-model="newCategory.name"
                        :aria-required="true" aria-describedby="error-message" required
                        :class="{ 'p-invalid': v$.newCategory.name.$error }">
                    </InputText>
                    <Button type="submit" size="large" aria-label="Cadastrar"
                        class="md:w-1/3 w-full active:scale-95 !bg-emerald-600 hover:!bg-opacity-80 !rounded-lg">
                        <v-icon name="md-add-round" />Cadastrar
                    </Button>
                </form>
                <p id="error-message" class="text-red-500" aria-live="polite"
                    v-if="v$.newCategory.name.$error && !v$.newCategory.name.$pending && v$.$dirty">
                    {{ v$.newCategory.name.$errors[0].$message }}
                </p>
            </template>
        </Card>
        <DataTable id="categories-list" :value="categoriesList"
            class="flex flex-col border-gray-800 border rounded-lg md:px-4 px-2" aria-live="polite" lazy>
            <Column field="name" id="category-name">
                <template #header>
                    <h2 class="font-semibold text-xl">Gênero:</h2>
                </template>
                <template #body="{ data }">
                    <span v-if="isLoading" class="flex justify-between items-center">
                        <Skeleton width="100%" height="1.5rem" class="!bg-gray-100" aria-hidden="true"></Skeleton>
                    </span>
                    <div v-else class="flex justify-between items-center">
                        <span :aria-label="'Categoria: ' + capitalizeCategory(data.name)">
                            {{ capitalizeCategory(data.name) }}
                        </span>
                        <div class="card flex justify-center">
                            <Button @click="showToggleOptions($event, data)" type="button" severity="secondary" text
                                aria-label="options" icon="pi pi-ellipsis-v"
                                class="flex items-center justify-center mx-3" aria-controls="overlay_menu" />
                            <Menu ref="menuPopUp" id="overlay_menu" :model="toggleOptions" :popup="true" />
                        </div>
                    </div>
                </template>
            </Column>
            <template #footer>
                <Paginator template="PrevPageLink PageLinks NextPageLink" :rows="query.size" :page="query.page"
                    :page-link-size="isMobileScreen ? 2 : undefined" :total-records="totalResults" :first="pageIndex"
                    @page="onPaginate" aria-label="Paginação">
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
            <template #empty>
                <span v-if="!isLoading && totalResults === 0" class="flex justify-center mt-4" aria-live="polite">
                    A lista de categorias está vazia. Adicione algum gênero acima.
                </span>
            </template>
        </DataTable>

        <editCategory :visible="visibleEditDialog" :id="selectedCategory.id" :name="selectedCategory.name"
            :categories="categoriesList" @editCategory="editCategory" @cancel-dialog="visibleEditDialog = false" />

        <deleteDialog :visible="visibleDeleteDialog" title="categoria" description="esta categoria?"
            @cancel-dialog="visibleDeleteDialog = false" @confirm-delete="deleteCategory"></deleteDialog>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Category, CategoryTo } from '@/models/category.model';
import CategoryService from './category.service';
import { QueryParams } from '@/models/query-params.model';
import { PageState } from 'primevue/paginator';
import { capitalize } from '@/utils/capitalize.utils';
import { useVuelidate } from "@vuelidate/core";
import { CategoryValidation } from '@/utils/validate-category.utils';
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { ScreenSize } from '@/utils/paginator-screen.utils';

export default defineComponent({
    name: "Category",
    data() {
        return {
            categoriesList: [] as Category[],
            newCategory: new CategoryTo(),
            query: new QueryParams(),
            totalResults: 0 as number,
            visibleEditDialog: false as boolean,
            visibleDeleteDialog: false as boolean,
            selectedCategory: {
                id: '' as string,
                name: '' as string,
            } as Category,
            isLoading: true as boolean,
            v$: useVuelidate(),
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
            isMobileScreen: ref(ScreenSize.isScreenSizeMobile()),
        };
    },
    validations() {
        return {
            newCategory: {
                name: {
                    required: CategoryValidation.requiredField,
                    minLength: CategoryValidation.minLength,
                    maxLength: CategoryValidation.maxLength,
                    validCharacters: CategoryValidation.validCharacters,
                    notRepeatCharacters: CategoryValidation.notRepeatedCharacters,
                }
            }
        };
    },
    methods: {
        getAllCategories(query: QueryParams): void {
            this.isLoading = true;
            this.service.categories
                .subscribe({
                    next: (response) => {
                        this.categoriesList = response.content || [];
                        this.totalResults = response?.total;
                        this.query.page = response?.page + 1;
                        this.isLoading = false;
                    },
                    error: () => {
                        this.isLoading = false;
                        this.$toast.add(ToastService.error(MessageToasts.ERROR_CREATE_CATEGORY, "Erro!"))
                    },
                });
            this.service.getAllCategories(query);
        },
        validateInput(): void {
            this.v$.$touch();

            const isDuplicate = this.categoriesList.some(
                category => category.name?.toLowerCase() === this.newCategory.name?.toLowerCase()
            );

            if (isDuplicate) {
                this.$toast.add(ToastService.warn(MessageToasts.WARN_DUPLICATE_CATEGORY, "Aviso!"));
                return;
            }
            if (!this.v$.newCategory.name.$invalid) {
                this.addCategory();
            } else {
                this.$toast.add(ToastService.error(MessageToasts.ERROR_CREATE_CATEGORY, "Entrada inválida!"));
            }
        },
        addCategory(): void {
            this.isLoading = true;
            this.service.categories
                .subscribe({
                    next: () => {
                        this.newCategory.name = '';
                        this.v$.$reset();
                        this.isLoading = false;
                    },
                    error: () => {
                        this.isLoading = false;
                        this.$toast.add(ToastService.error(MessageToasts.ERROR_CREATE_CATEGORY, "Erro!"));
                    },
                })
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_CREATE_CATEGORY));
            this.service.createCategories(this.newCategory);
        },
        editCategory(updatedCategory: Category): void {
            this.isLoading = true;
            this.service.categories
                .subscribe({
                    next: () => {
                        const index = this.categoriesList.findIndex(category => category.id === updatedCategory.id);
                        if (index !== -1) {
                            this.categoriesList[index] = updatedCategory;
                        }
                        this.visibleEditDialog = false;
                        this.isLoading = false;
                    },
                    error: () => {
                        this.isLoading = false;
                        this.$toast.add(ToastService.error(MessageToasts.ERROR_UPDATE_CATEGORY, "Erro!"));
                    },
                })
            this.$toast.add(ToastService.success(MessageToasts.SUCCESS_UPDATE_CATEGORY));
            this.service.updateCategories(updatedCategory);
        },
        deleteCategory(): void {
            if (this.selectedCategory.id) {
                this.isLoading = true;
                this.service.categories
                    .subscribe({
                        next: () => {
                            this.categoriesList = this.categoriesList.filter(category => category.id !== this.selectedCategory.id);
                            this.visibleDeleteDialog = false;
                            this.isLoading = false;
                        },
                        error: () => {
                            this.isLoading = false;
                            this.$toast.add(ToastService.error(MessageToasts.ERROR_DELETE_CATEGORY, "Erro!"));
                        },
                    });
                this.$toast.add(ToastService.success(MessageToasts.SUCCESS_DELETE_CATEGORY));
                this.service.deleteCategories(this.selectedCategory);
            }
        },
        showToggleOptions(event: Event, category: Category): void {
            const ref = this.$refs.menuPopUp as any;
            this.setSelectedCategory(category);
            ref.toggle(event);
        },
        setSelectedCategory(category: Category): void {
            this.selectedCategory = category;
        },
        openEditDialog(isVisible: boolean): void {
            isVisible ? this.visibleEditDialog = false : this.visibleEditDialog = true;
        },
        openDeleteDialog(isVisible: boolean): void {
            isVisible ? this.visibleDeleteDialog = false : this.visibleDeleteDialog = true;
        },
        capitalizeCategory(text: string): string {
            return capitalize(text);
        },
        onPaginate(event: PageState): void {
            this.query.page = event.page;
            this.$router.push({
                query: { ...this.$route.query, page: this.query.page + 1 }
            });
            this.getAllCategories(this.query);
        },
        currentScreenSize(): void {
            this.isMobileScreen = ScreenSize.isScreenSizeMobile();
        },
    },
    computed: {
        service() {
            return new CategoryService();
        },
        pageIndex(): number {
            return ((this.query.page - 1) * this.query.size);
        },
        pageRouter(): number {
            return Number(this.$route.query.page);
        },
        addEventPaginatorResize(): void {
            return window.addEventListener('resize', this.currentScreenSize);
        },
    },
    mounted() {
        this.addEventPaginatorResize;
        this.getAllCategories(this.query);
    },
})
</script>
