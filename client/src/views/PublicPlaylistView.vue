<template>
    <h1>Welcome to Public Playlists!</h1>
    <PublicPlaylist></PublicPlaylist>
  </template>
  
  <script>
import PublicPlaylist from '@/components/publicPlaylists.vue';
  export default {
    name: 'SearchView',
    components: {
        PublicPlaylist
    }
  }
  </script>