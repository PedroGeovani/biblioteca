<template>
  <Toast />
  <div class="flex" v-if="hasSideBar">
    <navbar />
    <div class="w-4/5 md:w-2/3 lg:w-3/4 ml-0 md:ml-auto pt-24 pb-8 md:px-8 pr-6">
      <router-view />
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
  <Toast />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    return {
      showSideBar: true
    }
  },
  computed: {
    hasSideBar(): boolean {
      return this.$route.meta.hasSideBar as boolean;
    }
  }
});
</script>