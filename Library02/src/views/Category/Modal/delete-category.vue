<template>
    <Dialog :visible="visible" @update:visible="closeDialog" modal class="w-4/5 md:w-2/5 p-2 md:pl-4 font-inter"
        :closable="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <template #header>
            <h2 id="dialog-title" class="text-3xl font-semibold">Deletar Categoria</h2>
        </template>
        <p id="dialog-description" class="text-surface-500 dark:text-surface-400 block">Deseja realmente deletar esta
            categoria?
        </p>
        <div class="flex justify-end gap-4 pt-12">
            <Button type="button" label="Cancelar" class="!text-red-700 w-1/3 md:w-1/5 active:scale-95"
                severity="danger" text @click="onCancel" aria-label="Cancelar a exclusão da categoria">
            </Button>
            <Button type="submit" label="Confirmar"
                class="!bg-[#009951] hover:!bg-opacity-80 !border-[#2C2C2C] !rounded-lg w-1/3 md:w-1/5 active:scale-95"
                @click="onConfirm" aria-label="Confirmar a exclusão da categoria">
            </Button>
        </div>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ToastService } from '@/utils/toast-service.utils';
import { MessageToasts } from '@/utils/toast-messages.utils';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        closeDialog() {
            this.$emit('cancel-dialog');
        },
        onCancel() {
            this.$emit('cancel-dialog');
            this.$toast.add(ToastService.info(MessageToasts.INFO_SUCCESS_CANCEL, "Cancelado!"));
        },
        onConfirm() {
            this.$emit('deleteCategory', { id: this.id });
            this.$emit('cancel-dialog');
        },
    }
})
</script>
