<template>
    <div v-for="list of public_dmca" :key="list.id">
       <h2>
          {{list.name}}
       </h2>
       <p>{{list.description}}</p>
    </div>
    <hr>
    <div v-if="store.admin">
       Which section do you want to edit? (enter 1-5) <input v-model="inputNumber" type="number">
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
 const URL = "http://localhost:3000/api/"
 const public_dmca = ref(null)
 async function getPP(){
    await fetch(URL+"policies/dmca")
    .then((res) => {
         // Handle error
         if(!res.ok){
             throw new Error(`${res.status} ${res.statusText}`)
         }
         return res.json()
     })
     .then(data => {
         public_dmca.value = data
         console.log(public_dmca.value[0].name)
         return public_dmca
     })
 }
 onMounted(() => {getPP()})

const inputNumber = ref(null)
const smText = ref(null)
const smID = ref(null)
function getPById(){
    if(this.inputNumber<1 || this.inputNumber>6){
        alert("Invalid Input!")
        smText.value = ""
        smID.value = null
    }
    else{
        smText.value = public_dmca.value[this.inputNumber-1].description
        smID.value = public_dmca.value[this.inputNumber-1]._id
}}
function updatePolicy(){
    console.log(smID.value)
    console.log(smText.value)
    const data = {description: smText.value}
    fetch(URL+`policies/dmca/${smID.value}`, {
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
}
 </script>