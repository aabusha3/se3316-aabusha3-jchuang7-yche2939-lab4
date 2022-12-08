
<template>
  <div class="update">
      <h1>Update Password</h1>
      <input type="password" name="password" v-model="password" placeholder="password"><br>
      <button @click="next">update</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { store } from './../store/index.js'

const URL = (`http://localhost:3000/api/updatePassword/${store.username}`)
const password = ref(null)

async function next () {
    axios.put(URL, {
                password: password.value
              })
    alert("Password updated")
    window.location.href = "http://localhost:8080/#/"
}

</script>
