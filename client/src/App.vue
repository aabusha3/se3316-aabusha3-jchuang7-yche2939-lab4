<script setup>
import { store } from './store/index.js'
</script>

<template>
<!-- html -->
  <div v-if="store.public && !store.admin">
    <nav> 
      <!-- redirects to public links -->
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link> | 
      <router-link to="/login">Login</router-link> | 
      <router-link to="/search">Search</router-link> 
    </nav>
    <router-view/>
  </div>

<!-- redirects to logged in links and public -->
  <div v-else-if="!store.public && !store.admin">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login" @click="store.public = true; store.username = ''">Log Out</router-link> |
      <router-link to="/password">Change Password</router-link> |
      <router-link to="/search">Search</router-link> | 
      <router-link to="/userHomePage">Private Playlists</router-link>
    </nav>
    <router-view/>
  </div>

<!-- redirects to admin pages and everything else -->
  <div v-else>
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link> | 
      <router-link to="/login" @click="store.public = true; store.username = ''; store.admin = false">Log Out</router-link> | 
      <router-link to="/password">Change Password</router-link> | 
      <router-link to="/changeAccess">Change Access</router-link> | 
      <router-link to="/search">Search</router-link> | 
      <router-link to="/userHomePage">Private Playlists</router-link> | 
      {{store.username}}
      <h1>Admin Rights</h1>
    </nav>
    <router-view/>
  </div>
</template>

<style>
  #app {
    text-align: center;
  }
</style>

