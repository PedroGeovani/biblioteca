<template>
    <Dialog :visible="visible" @update:visible="closeDialog" modal class="w-4/5 md:w-[45%] lg:w-1/3 px-0 lg:px-[1%]">
        <template #header>
            <span class="text-3xl font-semibold">Sair do login</span>
        </template>
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Deseja realmente sair da sua conta?</span>
        <section class="flex justify-end gap-4 lg:gap-6 pt-[3%]">
            <Button type="button" class="!text-[#C00F0C] hover:!text-red-800 w-1/2 lg:w-[23%]" severity="danger" text
                label="Cancelar" @click="closeDialog" />
            <Button type="button" class="!bg-[#009951] !border-[#02542D] w-1/2 lg:w-[23%]" label="Confirmar"
                @click="onLogout" />
        </section>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeDialog(): void {
            this.$emit('cancel-dialog');
        },
        onLogout(): void {
            this.$emit('user-logout');
        },
    }
})
</script>