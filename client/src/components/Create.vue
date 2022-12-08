
<template>
<!-- html -->
  <div class="create">
      <h1>Create Account</h1>
      <input type="username" name='username' v-model='username' placeholder='username'><br>
      <input for="email" name="email" v-model="email" placeholder="email"><br>
      <input type="password" name="password" v-model="password" placeholder="password"><br>
      <button @click=create()>Create Account</button>
  </div>
</template>

<script setup>
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

//function to create account
    async function create() {
      if(this.email != '' && this.password != '' && this.username != '') {
        //input sanitization
        if(/^[^@]+@\w+(\.\w+)+\w$/.test(this.email)) {
          //fetching data
          await fetch(`http://localhost:3000/api/email/${this.email}`)
          .then(res => {
            if(!res.ok) {
                throw new Error(`${res}`)
            }
            return res.json()
          })
          .then(data => result.value = data)
          .catch(err => console.log(err))

          console.log(result.value)

        //compares data if theres its enough characters and the email does not exist already
          if(username.value.length > 6 || password.value.length > 6) {
            if(result.value == '') {
              axios.post('http://localhost:3000/api/user', {
                  username: username.value,
                  email: email.value,
                  password: password.value,
                  validated: false,
                  deactivated: false,
                  original: false
                })
                toLogin()
            } else { //conditions for the various misinputs
              alert("This email already exists")
            }
          } else {
            alert('Username and password must be at least 6 characters')
          }
          
        } else {
          confirm('Invalid email address')
        }
      } else {
        if(this.username == '') {
          alert('missing username')
        } else if (this.email == '') {
          alert('missing email')
        } else {
          alert('missing password')
        }
      }
    }

    async function toLogin () {
      window.location.href = "http://localhost:8080/#/login"
    }
</script>
