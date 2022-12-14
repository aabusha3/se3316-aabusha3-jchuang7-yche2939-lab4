<template>
    <h1>Welcome to Search page!</h1>
    <SearchTrack></SearchTrack>
  </template>
  
  <script>
import SearchTrack from '@/components/SearchTrack.vue';
  export default {
    name: 'SearchView',
    components: {
        SearchTrack
    }
  }
  </script>