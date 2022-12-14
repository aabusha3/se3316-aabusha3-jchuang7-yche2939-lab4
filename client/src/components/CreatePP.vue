<template>
    <div>
        <!--Enter section name-->
        <h2>Add new privacy policy component here</h2>
        Name: <input type="text" v-model="newName">
        <br>
        <!--Enter description-->
        Description: <textarea v-model="newDescription" cols="30" rows="10"></textarea>
        <!--Click to insert to policy-->
        <button @click="addToPolicy()">Create new policy</button>
    </div>
    <hr>
    <div>
        <!--Enter section name-->
        <h2>Delete an existing privacy policy component here</h2>
        <!--Click to delete policy-->
        Name: <input type="text" v-model="deleteName"> <button @click="deletePolicy()">Delete existing policy</button>
    </div>
 </template>
 <script setup>
 import { ref, onMounted} from 'vue';
import { store } from './../store/index.js'
 const URL = `${store.url}`
 // Declarative rendering
 const public_pp = ref(null)
 const newName = ref(null)
 const newDescription = ref(null)
 const deleteName = ref(null)
  // Get sections from database
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
         public_pp.value = data
         console.log(public_pp.value[0].name)
         return public_pp
     })
 }
 // Call this method when page loads
 onMounted(() => {getPP()})
 // Use the rendered variables to send post request to backend
function addToPolicy(){
    console.log(newName.value)
    console.log(newDescription.value)
    const data= {
        name: newName.value,
        description: newDescription.value
    }
    fetch(URL+`/policies/pp`, {
        method: "POST",
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
// Use the rendered variables to send delete request to backend
function deletePolicy(){
    var id = 0
    public_pp.value.forEach(element => {
        if(element.name == deleteName.value)
        {
            id = element._id
            console.log(element._id)  
        }
    })
    console.log(id)
    fetch(URL+`/policies/pp/${id}`, {
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json'
        }
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
