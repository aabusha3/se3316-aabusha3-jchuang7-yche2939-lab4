
<template>
<!-- html -->
  <div class="create">
      <h1>Validate Email</h1>
      <button class = 'link' @click="nextPage"><u>Click to verify email</u></button>
  </div>
</template>

<script setup>
import axios from 'axios'
import { store } from './../store/index.js'

const URL = (`${store.url}/userValid/${store.username}`)

// moves to next page and validates account
async function nextPage () {
    axios.put(URL, {
                validated: true
              })
    window.location.href = `${store.front}/confirmed`
}

</script>


<style>
/* style */
    button.link {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
