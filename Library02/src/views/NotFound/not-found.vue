<template>
    <div class="flex flex-col justify-center text-center min-h-screen ">
        <img src="../../assets/page-not-found.svg" alt="Imagem de erro 404 para página não encontrada" class="justify-center h-72" />
        <h1 class="pt-2 text-3xl">Erro 404 - Página não encontrada</h1>
        <p>Desculpe, a página que você está procurando não foi encontrada.</p>
        <router-link to="/" class="underline hover:text-emerald-600">Voltar para a página inicial</router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "notFound"
})
</script>