<template>
    <section class="flex justify-center">
        <Dialog :visible="visible" @update:visible="closeDialog" modal pt:root:class="!bg-[#F2F2F7] !border-[#F2F2F7]"
            class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]">
            <template #header>
                <span class="text-3xl font-semibold">Deletar {{ title }}</span>
            </template>
            <span class="block mb-8">Deseja realmente deletar {{ description }}</span>
            <div class="flex justify-end gap-4 lg:gap-6 pt-[3%]">
                <Button type="button"
                    class="!text-[#C00F0C] hover:!text-red-800 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                    severity="danger" text label="Cancelar" aria-label="Cancelar que irá deletar"
                    @click="closeDialog" />
                <Button type="button"
                    class="!bg-[#009951] !border-[#2C2C2C] hover:!bg-opacity-85 !rounded-lg w-1/2 lg:w-[29%] active:scale-95"
                    label="Confirmar" aria-label="Confirmar que irá deletar" @click="onDelete" />
            </div>
        </Dialog>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        }
    },
    methods: {
        closeDialog(): void {
            this.$emit('cancel-dialog');
        },
        onDelete(): void {
            this.$emit('confirm-delete');
        }
    }
});
</script>