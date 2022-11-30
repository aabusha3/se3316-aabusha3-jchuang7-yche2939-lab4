<script setup>
import { ref } from "vue";

const url = 'http://localhost:3000/api/tracks/at/awol';
const genres = ref([]);
const getGenres = async function() {
    const res = await fetch(url);
    const data = await res.json();
    genres.value = data;
    console.log(genres)
  }

  getGenres();
</script>

<template>
  <h1>test</h1>  
  <ul>
    <li v-for="genre of genres" :key="genre.id">
      <h1>{{genre}}</h1>
    </li>
  </ul>
</template>

<style>

</style>
