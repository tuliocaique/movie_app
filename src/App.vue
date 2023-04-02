<template>
  <MovieSearch/>
  <AppFooter/>
</template>

<script>
import MovieSearch from "@/components/MovieSearch.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: 'App',
  components: {
    AppFooter,
    MovieSearch
  }
}
</script>

<style>


</style>
