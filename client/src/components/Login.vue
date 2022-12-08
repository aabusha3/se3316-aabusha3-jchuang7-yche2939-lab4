
<template>
  <div class="login">
      <h1>Login</h1>
      <input for="email" name="email" v-model="email" placeholder="email"><br>
      <input type="password" name="password" v-model="password" placeholder="password"><br>
      <button @click="login()">Login</button>
      <button @click="createAccount()">Create Account</button>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { store } from './../store/index.js'

    const result = ref([])
    const adminResult = ref([])
    const URL = "http://localhost:3000/api/"

    async function login () {
        await fetch(URL + 'user')
        .then(res => {
            if(!res.ok) {
                throw new Error(`${res}`)
            }
            return res.json()
        })
        .then(data => result.value = data)
        .catch(err => console.log(err))

        await fetch(URL + 'admin')
        .then(res1 => {
            if(!res1.ok) {
                throw new Error(`${res1}`)
            }
            return res1.json()
        })
        .then(data1 => adminResult.value = data1)
        .catch(err => console.log(err))

        if(email.value != '' && password.value != '') {
            if(/^[^@]+@\w+(\.\w+)+\w$/.test(this.email)) {
                for(var key in adminResult.value) {
                    if(adminResult.value[key].email.toLowerCase() == this.email.toLowerCase() && adminResult.value[key].password == this.password) {
                        store.admin = true
                        console.log(adminResult.value[key].original)
                        if(adminResult.value[key].original) {
                            store.username = "admin"
                        } else {
                            store.username = "subAdmin"
                        }
                        window.location.href = "http://localhost:8080/#/"
                        return
                    }
                }


                for(var key in result.value) {
                    if(result.value[key].email.toLowerCase() == this.email.toLowerCase()) {
                        if(!result.value[key].deactivated) {
                            if(result.value[key].password == this.password) {
                                if(result.value[key].validated == false) {
                                    if(confirm('Your email is not validated. Would you like to validate your email?')) {
                                        store.public = false
                                        store.username = result.value[key].username
                                        window.location.href = "http://localhost:8080/#/confirm"
                                        break;
                                    } else {
                                        store.public = false
                                        store.username = result.value[key].username
                                        window.location.href = "http://localhost:8080/#/"
                                        break;
                                    }
                                }
                                store.username = result.value[key].username
                                store.public = false
                                window.location.href = "http://localhost:8080/#/"
                                break;
                            } else {
                                alert("incorrect password")
                                break;
                            }
                        } else {
                            alert("Your account is deactivated. Contact ---")
                            break;
                        }
                    }
                    if(key == result.value.length - 1) {
                        alert("account not found")
                    }
                }
            } else {
                alert("invalid email")
            }
        } else if(email.value == '') {
            alert('Enter an email')
        } else {
            alert('Enter a password')
        }
    }

    const email = ref(null)
    const password = ref(null)
    const emit = defineEmits(['loginDone'])

    async function createAccount() {
        window.location.href = "http://localhost:8080/#/create"
    }

</script>
