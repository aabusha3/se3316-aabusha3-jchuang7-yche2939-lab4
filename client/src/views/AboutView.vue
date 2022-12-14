<script setup>
import { store } from './../store/index.js'
</script>

<template>
  <div class="about">
    <h1>About this web application</h1>
    <h3>Welcome to this track-searching tool. By using this web app, users will be able to work with
      track lists from the our track records.
    </h3>
    <h3>
      Click here to register an account: <router-link to="/create">Create New Account</router-link>
    </h3>
    <h3>
      Click here to log in: <router-link to="/login">Log In</router-link>
    </h3>
    <h3>
      Click here to view our privacy policy: <router-link to="/privacypolicy">Private Policy</router-link>
      <br>
      <div v-if="store.admin">
        Create/Delete privacy policy components: <router-link to="/createpp">Create/Delete PP components</router-link>
      </div>
    </h3>
    <h3>
      Click here to view our acceptable use policy: <router-link to="/aup">Acceptable Use Policy</router-link>
      <br>
      <div v-if="store.admin">
        Create/Delete acceptable use policy components: <router-link to="/createaup">Create/Delete AUP components</router-link>
      </div>
    </h3>
    <h3>
      Click here to view DMCA notice & takedown policy: <router-link to="/dmca">DMCA Notice & Takedown Policy</router-link> 
      <br>
      <div v-if="store.admin">
        Create/Delete DMCA notice & takedown policy components: <router-link to="/createdmca">Create/Delete DMCA components</router-link>
      </div>
    </h3>
    <h3>
      <div v-if="store.admin">
        Click here to view DMCA takedown procedures <router-link to="/takedownprocedure">DMCA Takedown procedure</router-link>
      </div>
    </h3>
  </div>
</template>
