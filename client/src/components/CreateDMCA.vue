<template>
    <div>
        <!--Enter section name-->
        <h2>Add new DMCA policy component here</h2>
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
        <h2>Delete an existing DMCA policy component here</h2>
        <!--Click to delete policy-->
        Name: <input type="text" v-model="deleteName"> <button @click="deletePolicy()">Delete existing policy</button>
    </div>
 </template>
 <script setup>
 import { ref, onMounted} from 'vue';
 const URL = "http://localhost:3000/api/"
  // Declarative rendering
 const public_dmca = ref(null)
 const newName = ref(null)
 const newDescription = ref(null)
 const deleteName = ref(null)
  // Get sections from database
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
    fetch(URL+`policies/dmca`, {
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
    public_dmca.value.forEach(element => {
        if(element.name == deleteName.value)
        {
            id = element._id  
        }
    })
    fetch(URL+`policies/dmca/${id}`, {
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