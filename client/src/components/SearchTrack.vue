<template>
    <div class="searchTrack">
        Search by Track Title: <input v-model="inputTitle" type="text"/>
        <button @click="getTrackByTrackTitle()">Go!</button>
        <br>
        Search by Artist Name: <input v-model="inputArtist" type="text"/>
        <button @click="getTrackByArtistName()">Go!</button>
        <br>
        Search by Genre Title: <input v-model="inputGenreTitle" type="text"/>
        <button @click="getTrackByGenreTitle()">Go!</button>
        <br>
        Search by Artist Name, Genre Title, and Track Title: <input v-model="inputAN" type="text" placeholder="artist name"/> <input v-model="inputGT" type="text" placeholder="genre title"/> <input v-model="inputTT" type="text" placeholder="track title"/> 
        <button @click="getTrackByANGTTT()">Go!</button>
    </div>
    <hr>
    <div ref="search">
        <div v-if="(titleResults.length == 0)">
            <li>No matched result</li>
        </div>
        <div v-else>
            <li v-for="(titleRes, index) of titleResults" :key="index">
        Track Title: {{titleRes.track_title}} || 
        Artist Name: {{titleRes.artist_name}} || 
        <button @click="(hideCompleted[index] = !hideCompleted[index])">
        {{hideCompleted[index]? 'hide':"more"}}
        </button>
        <p v-if="(hideCompleted[index])">
            Album Title: {{titleRes.album_title}} || Track Date Created: {{titleRes.track_date_created}} || Track Duration: {{titleRes.track_duration}} 
        </p>
        <a v-bind:href="('https://www.youtube.com/results?search_query='+ titleRes.artist_name + ', ' + titleRes.album_title + ', ' + titleRes.track_title)" target="_blank">
            <button>Play On Youtube</button>
        </a>
            </li>
            
        </div>
    </div>
    <hr>
</template>

<script setup>
import { ref } from 'vue';
const inputTitle = ref(null)
const inputArtist = ref(null)
const inputGenreTitle = ref(null)
const inputAN = ref(null)
const inputGT = ref(null)
const inputTT = ref(null)
const hideCompleted = ref(Array(12).fill(false))
const titleResults = ref([])
import { store } from './../store/index.js'

const URL = `${store.url}`

// Search by track title
async function getTrackByTrackTitle(){
    console.log(inputTitle.value)
    await fetch(URL+"/tracks/tt/"+inputTitle.value)
    .then((res) => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`)
        }
        return res.json()
    })
    .then(data => {
        titleResults.value = data
        console.log(titleResults)
        return titleResults
    })
}
// Search by artist name
async function getTrackByArtistName(){
    console.log(inputArtist.value)
    await fetch(URL+"/tracks/an/"+inputArtist.value)
    .then((res) => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`)
        }
        return res.json()
    })
    .then(data => {
        titleResults.value = data
        console.log(titleResults)
        return titleResults
    })
}
// Search by genre title
async function getTrackByGenreTitle(){
    console.log(inputGenreTitle.value)
    await fetch(URL+"/tracks/gr/"+inputGenreTitle.value)
    .then((res) => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`)
        }
        return res.json()
    })
    .then(data => {
        titleResults.value = data
        console.log(titleResults)
        return titleResults
    })
}
// Search by artist name, genre title, and track title
async function getTrackByANGTTT(){
    if(inputAN.value == null && inputGT.value == null && inputTT.value == null){
        alert("Please at least input one value")
    }
    else{
    //fetch different apis based on the input
    await fetch(URL+"/tracks/angttt/"+`${inputAN.value}/${inputGT.value}/${inputGenreTitle.value}`)
    .then((res) => {
        // Handle error
        if(!res.ok){
            throw new Error(`${res.status} ${res.statusText}`)
        }
        return res.json()
    })
    .then(data => {
        titleResults.value = data
        console.log(titleResults)
        return titleResults
    })
    }
}
</script>
