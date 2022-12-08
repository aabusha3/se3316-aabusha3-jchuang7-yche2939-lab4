<template>
    <div>
        <h2>Add new AUP policy component here</h2>
        Name: <input type="text" v-model="newName">
        <br>
        Description: <textarea v-model="newDescription" cols="30" rows="10"></textarea>
        <button @click="addToPolicy()">Create new policy</button>
    </div>
    <hr>
    <div>
        <h2>Delete an existing AUP policy component here</h2>
        Name: <input type="text" v-model="deleteName"> <button @click="deletePolicy()">Delete existing policy</button>
    </div>
 </template>
 <script setup>
 import { ref, onMounted} from 'vue';
 const URL = "http://localhost:3000/api/"
 const public_aup = ref(null)
 const newName = ref(null)
 const newDescription = ref(null)
 const deleteName = ref(null)
 async function getPP(){
    await fetch(URL+"policies/aup")
    .then((res) => {
         // Handle error
         if(!res.ok){
             throw new Error(`${res.status} ${res.statusText}`)
         }
         return res.json()
     })
     .then(data => {
         public_aup.value = data
         console.log(public_aup.value[0].name)
         return public_aup
     })
 }
 onMounted(() => {getPP()})

function addToPolicy(){
    console.log(newName.value)
    console.log(newDescription.value)
    const data= {
        name: newName.value,
        description: newDescription.value
    }
    fetch(URL+`policies/aup`, {
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

function deletePolicy(){
    var id = 0
    public_aup.value.forEach(element => {
        if(element.name == deleteName.value)
        {
            id = element._id
            console.log(element._id)  
        }
    })
    console.log(id)
    fetch(URL+`policies/aup/${id}`, {
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