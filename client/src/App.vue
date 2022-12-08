<script setup>
import { ref } from "vue";
import { store } from './store/index.js'

const url = 'http://localhost:3000/api/tracks/at/awol';
const genres = ref([]);
const getGenres = async function() {
    const res = await fetch(url);
    const data = await res.json();
    genres.value = data;
    console.log(genres)
  }

 // getGenres();
</script>

<template>
  <div v-if="store.public && !store.admin">
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link> | 
      <router-link to="/login">Login</router-link> | 
      <router-link to="/search">Search</router-link> | 
    <router-link to="/userHomePage">User</router-link>
    </nav>
    <router-view/>

    <ul>
      <li v-for="genre of genres" :key="genre.id">
        <h1>{{genre}}</h1>
      </li>
    </ul>
  </div>

  <div v-else-if="!store.public && !store.admin">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login" @click="store.public = true; store.username = ''">Log Out</router-link> |
      <router-link to="/password">Change Password</router-link>
    </nav>
    <router-view/>

    <ul>
      <li v-for="genre of genres" :key="genre.id">
        <h1>{{genre}}</h1>
      </li>
    </ul>
  </div>

  <div v-else>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login" @click="store.public = true; store.username = ''; store.admin = false">Log Out</router-link> |
      <router-link to="/password">Change Password</router-link> |
      <router-link to="/changeAccess">Change Access</router-link> |
      {{store.username}}
      <h1>Admin Rights</h1>
    </nav>
    <router-view/>

    <ul>
      <li v-for="genre of genres" :key="genre.id">
        <h1>{{genre}}</h1>
      </li>
    </ul>
  </div>
</template>

<style>
  #app {
    text-align: center;
  }
</style>

