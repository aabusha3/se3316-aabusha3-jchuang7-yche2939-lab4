<template>
    <!--use v-for bindings to display the list information-->
   <div v-for="list of public_pp" :key="list.id">
      <h2>
        <!--use list rendering to access the json object passed from the backend-->
         {{list.name}}
      </h2>
      <p>{{list.description}}</p>
   </div>
   <hr>
   <!--Only for admin users-->
   <div v-if="store.admin">
       Which section do you want to edit? (enter paragraph number) <input v-model="inputNumber" type="number">
       <button @click="getPById($event)">Search</button>
       <br>
       <br>
       <textarea v-model="smText" cols="200" rows="10"></textarea>
       <button @click="updatePolicy()">Update!</button>
    </div>
</template>
<script setup>
import { ref, onMounted} from 'vue';
 import { store } from './../store/index.js'
const URL = `${store.url}`
  // Declarative rendering
const public_pp = ref(null)
  // Get all sections of the DMCA
async function getPP(){
   await fetch(URL+"/policies/pp")
   .then((res) => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`)
        }
        return res.json()
    })
    .then(data => {
        // Assign data to 
        public_pp.value = data
        console.log(public_pp.value[0].name)
        return public_pp
    })
}
 // Call this method when page loads
onMounted(() => {getPP()})

const inputNumber = ref(null)
const smText = ref(null)
const smID = ref(null)
// Triggered by a mouse event and send id and description to the variable
function getPById(){
    if(inputNumber.value<1 || inputNumber.value>public_pp.value.length){
        alert("Invalid Input!")
        smText.value = ""
        smID.value = null
    }
    else{
        smText.value = public_pp.value[inputNumber.value-1].description
        smID.value = public_pp.value[inputNumber.value-1]._id
}}
// Update policy using the updated values above
async function updatePolicy(){
    console.log(smID.value)
    console.log(smText.value)
    const data = {description: smText.value}
    await fetch(URL+`/policies/pp/${smID.value}`, {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res}`)
        }
        return res.json()})
    .then(data => console.log(data))
    .catch(err => console.log(err))
    
    if(smText.value !== null){
        public_pp.value[inputNumber.value-1].description = smText.value
    }  
}
</script>
