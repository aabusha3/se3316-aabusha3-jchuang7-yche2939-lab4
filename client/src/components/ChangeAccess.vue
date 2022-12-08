
<template> 
<!-- html -->
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
// importd
  import axios from 'axios'
  import { store } from './../store/index.js'
  import { ref } from 'vue'

  const username = ref(null)
  const userGrant = ref(null)

  const URL = (`http://localhost:3000/api/login/`)
  const result = ref([])

//checks if  it is main admin to grant admin to other users
  async function privilieges() {
    if(store.username == "subAdmin") {
      alert("You do not have access to this feature.")
      return
    } else { //fetch
      await fetch(`http://localhost:3000/api/login/${username.value}`)
        .then(res => {
            if(!res.ok) {
                throw new Error(`${res}`)
            }
            return res.json()
        })
        .then(data => result.value = data)
        .catch(err => console.log(err))

//if the user exists, it makes them admin
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
//function to call post to activate account
  async function activate () {
    axios.put(`http://localhost:3000/api/deactivate/${username.value}`, {
      deactivated: false
    })
  }

//function to deactivate
  async function deactivate () {
    axios.put(`http://localhost:3000/api/deactivate/${username.value}`, {
      deactivated: true
    })
  }
</script>