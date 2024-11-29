<template>
  <header class="flex flex-col gap-3 w-full font-inter mb-6 sm:flex-row justify-start sm:justify-between">
    <h1 class="flex font-bold text-3xl"> {{ titleHeader }} </h1>
    <Button @click="$emit('returnButton')" unstyled class="flex text-lg text-emerald-600 rounded-lg items-center h-12 active:scale-95">
       <span> Voltar </span>
       <i class="pi pi-arrow-right px-3"></i>
    </Button> 
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'headerSubView',
  props: {
    titleHeader: String,
  },
})
</script>