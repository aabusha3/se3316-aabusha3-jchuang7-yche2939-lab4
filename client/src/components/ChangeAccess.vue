
<template>
  <div class="create">
      <h1>User List</h1>
      <input type="username" name='username' v-model='username' placeholder='username'><br>
      <button @click="privilieges">Give Admin</button>
      <button>Hide</button>
      <button>Unhide</button>
      <button @click="deactivate()">Deactivate</button>
      <button @click="activate()">Activate</button>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { store } from './../store/index.js'
  import { ref } from 'vue'

  const username = ref(null)
  const userGrant = ref(null)

  const URL = (`http://localhost:3000/api/login/`)
  const result = ref([])

  async function privilieges() {
    if(store.username == "subAdmin") {
      alert("You do not have access to this feature.")
      return
    } else {
      await fetch(`http://localhost:3000/api/login/${username.value}`)
        .then(res => {
            if(!res.ok) {
                throw new Error(`${res}`)
            }
            return res.json()
        })
        .then(data => result.value = data)
        .catch(err => console.log(err))

        if(result.value[0] != '') {
          axios.post('http://localhost:3000/api/admin', {
                  username: result.value[0].username,
                  email: result.value[0].email,
                  password: result.value[0].password,
                  validated: true,
                  deactivated: false,
                  original: false
          })
        }
    }
  }

  async function activate () {
    axios.put(`http://localhost:3000/api/deactivate/${username.value}`, {
      deactivated: false
    })
  }

  async function deactivate () {
    axios.put(`http://localhost:3000/api/deactivate/${username.value}`, {
      deactivated: true
    })
  }

  async function hide () {

  }

  async function unhide () {

  }
</script>