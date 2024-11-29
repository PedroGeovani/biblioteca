<template>
    <Dialog :visible="visible" @update:visible="closeDialog" modal pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]"
        class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]" :closable="true" aria-labelledby="dialog-title">
        <template #header>
            <h2 id="dialog-title" class="text-3xl font-semibold">Editar Categoria</h2>
        </template>
        <form @submit.prevent="validateInput" class="flex flex-col" aria-labelledby="form-title">
            <label for="editCategory" id="form-title"
                class="text-[#1E1E1E] dark:text-surface-400 block">Gênero:</label>
            <InputText id="editCategory" type="text" size="large" class="text-2xl w-full lg:w-3/5 mb-2"
                v-model="editedName" :class="{ 'p-invalid': v$.editedName.$error }" aria-required="true"
                aria-describedby="error-message">
            </InputText>
            <span class="text-red-500" id="error-message"
                v-if="v$.editedName.$error && !v$.editedName.$pending && v$.$dirty" aria-live="polite">
                {{ v$.editedName.$errors[0].$message }}
            </span>
            <div class="flex justify-end gap-4 lg:gap-6 pt-[3%]">
                <Button type="button" label="Cancelar"
                    class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                    severity="danger" text @click="onCancel" aria-label="Cancelar edição da categoria">
                </Button>
                <Button type="submit" label="Salvar"
                    class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                    aria-label="Salvar alterações da categoria">
                </Button>
            </div>
        </form>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useVuelidate from '@vuelidate/core';
import { CategoryValidation } from '@/utils/validate-category.utils';
import { capitalize } from '@/utils/capitalize.utils';
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';
import { Category } from '@/models/category.model';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            default: ''
        },
        categories: {
            type: Array as () => Category[],
            required: true,
        }
    },
    data() {
        return {
            editedName: this.capitalizeCategory(this.name),
            originalName: this.name,
            v$: useVuelidate()
        };
    },
    validations() {
        return {
            editedName: {
                required: CategoryValidation.requiredField,
                minLength: CategoryValidation.minLength,
                maxLength: CategoryValidation.maxLength,
                validCharacters: CategoryValidation.validCharacters,
                notRepeatedCharacters: CategoryValidation.notRepeatedCharacters,
            }
        }
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                this.editedName = this.capitalizeCategory(this.originalName);
                this.v$.$reset();
            }
        },
        name(newValue) {
            this.originalName = newValue;
            if (this.visible) {
                this.editedName = this.capitalizeCategory(newValue);
                this.v$.$reset();
            }
        },
    },
    methods: {
        closeDialog() {
            this.$emit('cancel-dialog');
        },
        onCancel() {
            this.v$.$reset();
            this.$emit('cancel-dialog');
            this.$toast.add(ToastService.info(MessageToasts.INFO_SUCCESS_CANCEL, "Cancelado!"));
        },
        onSave() {
            this.$emit('editCategory', { id: this.id, name: this.editedName });
            this.originalName = this.editedName;
            this.editedName = '';
            this.v$.$reset();
            this.$emit('cancel-dialog');
        },
        validateInput(): void {
            this.v$.$touch();

            const isDuplicate = this.categories.some(
                category => category.name?.toLowerCase() === this.editedName.toLowerCase() && category.id !== this.id
            );
            if (isDuplicate) {
                this.$toast.add(ToastService.warn(MessageToasts.WARN_DUPLICATE_CATEGORY, "Aviso!"))
                return;
            };
            if (this.v$.editedName.$invalid) {
                return;
            };
            this.onSave();
        },
        capitalizeCategory(text: string): string {
            return capitalize(text);
        },
    }
})
</script>
