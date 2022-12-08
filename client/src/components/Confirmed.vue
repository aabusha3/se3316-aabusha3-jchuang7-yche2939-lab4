

<template>
<!-- html -->
  <div class="create">
      <h1>Your email has been validated</h1>
      <button @click="next">Return</button>
  </div>
</template>

<script setup>


async function next () {
  //moves to next window
    window.location.href = "http://localhost:8080/#/"
}

</script>
