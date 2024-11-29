<template>
  <header class="flex flex-col gap-2 font-inter mb-6 sm:flex-row sm:justify-between">
    <h1 class="flex font-bold text-3xl"> {{ titleHeader }} </h1>
    <section class="flex flex-col gap-2">
      <Button v-if="showButtonRegister" @click="$emit('actionButtonRegister')" label="Cadastrar" unstyled
        class="flex w-[188px] text-lg text-white bg-emerald-600 rounded-lg items-center h-12 px-8 active:scale-95" 
        icon="pi pi-plus px-2" />
      <Button v-if="showFilter" type="button" @click="$emit('actionButtonFilter')" class="flex mt-4 sm:justify-center active:scale-95"
        unstyled>
        Filtrar
        <v-icon name="bi-funnel" />
      </Button>
    </section>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'headerView',
  props: {
    titleHeader: String,
    showFilter: Boolean,
    showButtonRegister: Boolean,
  },
})
</script>