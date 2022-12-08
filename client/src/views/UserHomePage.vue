<script setup>
import { ref, onMounted } from "vue";
import { store } from './../store/index.js'
import update from './UpdateList.vue'

const url = `${store.url}/user`

//updates list items + db upon update button press
function updateDone(id, newListInfo){
  this.result[id].name = newListInfo.Name;
  this.result[id].desc = newListInfo.Desc;
  this.result[id].tracks = newListInfo.Tracks;
  this.result[id].dateLastModed = newListInfo.DLM;
}

//deletes a list from db
async function deleteList(id, name){
  if(confirm('Are You Sure You Want To Delete This List')){
    const durl = `${url}/deleteList/${store.username}/${name}`;
    const res = await fetch(durl);
    const data = await res.json();
    msg.value = data;
    this.result.splice(id, 1);
  }
}

//converts array to string
function arrToStr(arr){
  return arr.toString();
}

//get all relavant info of select track ids
const tmsg = ref('')
const tracks = ref([]);
const showTrack = ref(false);
async function viewTracks(id){
  tmsg.value = 'Please Wait As We Retrieve Tracks Info'
  showTrack.value = true;
  const tracksStr = arrToStr(saveRes[id].tracks);
  const vurl = `${url}/trackInfo/${tracksStr}`;
  const res = await fetch(vurl);
  const data = await res.json();
  tracks.value = data;
  tmsg.value = 'Tracks Info Retrieved'
}

//get all related playlists associated with the user
let saveRes = [];
const result = ref([]);
async function getPlaylists() {
  const gurl = `${url}/getPrivatePlaylists/${store.username}`;
  const res = await fetch(gurl);
  const data = await res.json();
  result.value = data;
  saveRes = data;
};

//updates the visability of the list items + db
const msg = ref('');
async function updateVis(id, name, vis){
  this.result[id].public = !this.result[id].public;
  const url = `${url}/updateVis/${store.username}/${name}/${vis}`;
  const res = await fetch(url);
  const data = await res.json();
  msg.value = data;
}

//loads on page load
onMounted(() => {getPlaylists()})
</script>

<template>
  <router-link to='/createNewList'>Create new playlist</router-link>
  <br> <span>{{msg}}</span>

  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Desc</th>
        <th>Visability</th>
        <th>Tracks</th>
        <th>Delete</th>
        <th>Update</th>
        <th>Date Last Modified</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(list,index) in result" :key="index">
        <td id="img"><img src='../assets/music-cover.png'></td> 
        <td>{{list.name}}</td>
        <td>{{list.desc}}</td>
        <td>
          <span>{{list.public?'Public':'Private'}}</span> 
          <br> <button type="button" @click='updateVis(index, list.name, list.public)'>Change Visability?</button>
        </td>
        <td>{{list.tracks.toString()}}
          <br><button type="button" @click="viewTracks(index)">View Tracks' Detail</button></td>
        <td><button type="button" @click="deleteList(index, list.name)">Delete This List?</button></td>
        <td>
          <div>
            <update @done="upInfo => updateDone(index, upInfo)" :name="list.name" :desc="list.desc" :tracks="list.tracks.toString()"/>
          </div>
        </td>
        <td>{{list.dateLastModed}}</td>
      </tr>
    </tbody>
  </table>


  <br><br>
  <span>{{tmsg}}</span>
  <br>
  <table v-if="showTrack">
    <thead>
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Artist</th>
        <th>Album</th>
        <th>Duration</th>
        <th>Genres</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="track of tracks" :key="track.id"> 
        <td>{{track.track_id}}</td>
        <td>{{track.track_title}}</td>
        <td>{{track.artist_name}}</td>
        <td>{{track.album_title}}</td>
        <td>{{track.track_duration}}</td>
        <td>{{(JSON.parse(track.track_genres.replace(/'/g, '"'))[0].genre_title || 'unable to retrieve genere')}}</td>
      </tr>
    </tbody>
  </table>
</template>

<style>
#img{
  width:6%;
}
img{
  width:100%;
}

table thead {background-color: #bb5656;}
table {width: 100%;}
table, th, td {
  border: 1px solid white;
  border-collapse: collapse;
}
</style>