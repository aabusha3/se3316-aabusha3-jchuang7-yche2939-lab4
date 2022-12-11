
<template>
<!-- html -->
  <div class="create">
      <h1>Create Account</h1>
      <input type="username" name='username' v-model='username' placeholder='username'><br>
      <input for="email" name="email" v-model="email" placeholder="email"><br>
      <input type="password" name="password" v-model="password" placeholder="password"><br>
      <button @click=createAccount()>Create Account</button>
  </div>
</template>

<script setup>
    import { logicalExpression } from '@babel/types';
import axios from 'axios'

    import { ref } from 'vue'
    const result = ref([])
    const URL = "http://localhost:3000/api/"

    const username = ref(null)
    const email = ref(null)
    const password = ref(null)

    // axios.post('http://localhost:3000/api/user', {
    //         email: email.value,
    //         password: password.value
    //     })

    async function createAccount() {
      if(password.value.length >= 6) {
        const check = await axios.post('http://localhost:3000/api/sanitize', {
          username: username.value,
          email: email.value
        })

        if(!check.data.check) {
          alert(check.data.error)
        } else {
          const check2 = await axios.post('http://localhost:3000/api/duplicate', {
            username: username.value,
            email: email.value
          })
          if(check2.data.email.length == 0 && check2.data.username.length == 0) {
            axios.post('http://localhost:3000/api/user', {
              username: username.value,
              email: email.value,
              password: password.value,
              validated: false,
              deactivated: false,
              original: false
            })
            toLogin()
          } else if (check2.data.email.length != 0) {
            alert("email is already in use")
          } else {
            alert("username is already in use")
          }
        }
      } else {
        alert("Password must be at least 6 characters long")
      }
    }

    async function toLogin () {
      window.location.href = "http://localhost:8080/#/login"
    }
</script>
