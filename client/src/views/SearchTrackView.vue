<template>
    <h1>Welcome to Search page!</h1>
    <SearchTrack></SearchTrack>
    <PublicPlaylist></PublicPlaylist>
  </template>
  
  <script>
import SearchTrack from '@/components/SearchTrack.vue';
import PublicPlaylist from '@/components/publicPlaylists.vue';
  export default {
    name: 'SearchView',
    components: {
        SearchTrack,
        PublicPlaylist
    }
  }
  </script>