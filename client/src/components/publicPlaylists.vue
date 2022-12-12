<script setup>
import { ref, onMounted } from "vue";
import { store } from './../store/index.js'
import router from '../router'
const hideListInfo = ref(Array(10).fill(false))

const url = `${store.url}/user`

function toReview(id){
  store.trackToReview = id
  router.push('/review')
}

function arrToStr(arr){
  return arr.toString();
}

//get all relavant info of select track ids
const tmsg = ref('')
const tracks = ref([]);
const showTrack = ref(false);
async function viewTracks(id){
  showTrack.value = !showTrack.value
  tmsg.value = 'Tracks Info Hidden'
  if(!showTrack.value) return;
  tmsg.value = 'Please Wait As We Retrieve Tracks Info'
  const tracksStr = arrToStr(this.result[id].tracks);
  const vurl = `${url}/trackInfo/${tracksStr}`;
  const res = await fetch(vurl);
  const data = await res.json();
  tracks.value = data;
  tmsg.value = 'Tracks Info Retrieved'
}

//get public playlist
const result = ref([]);
async function getPlaylists() {
  const purl = `${url}/getPublicPlaylists`;
  const res = await fetch(purl);
  const data = await res.json();
  result.value = data;
};

onMounted(() => {getPlaylists()})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Creator</th>
        <th># of Tracks</th>
        <th>Duration</th>
        <th>Average Rating</th>
        <th>View More</th>
        <th>Comment</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(list, index) in result" :key="index">
        <td id="img"><img src='../assets/music-cover.png'></td> 
        <td>{{list.name}}</td>
        <td>{{list.creator_username}}</td>
        <td>{{list.tracks.length}}</td>
        <td>{{list.duration}}</td>
        <td>{{list.comments.length > 0? ((list.comments.map(e=>e.rating).reduce((accumulator, currentValue) => accumulator + currentValue) / list.comments.length)) : 0}} / 5</td>
        <td>
          <button @click="(() => {hideListInfo[index] = !hideListInfo[index]; showTrack = false; if(!hideListInfo[index])tmsg = 'Tracks Info Hidden';})">
            {{hideListInfo[index]? 'hide':'show more'}}
          </button>
          <table v-if="(hideListInfo[index])">
            <thead>
              <th>Description</th>
              <th>Tracks</th>
              <th>View More</th>
            </thead>
            <tbody>
              <td>{{list.desc}}</td>
              <td>{{list.tracks.toString()}}</td>
              <td>
                <button type="button" @click="viewTracks(index)">{{showTrack? 'hide':'show tracks info'}}</button>
              </td>
            </tbody>
          </table>
        </td>
        <td>
          <button @click="toReview(list._id)">Leave A Comment
          </button>
        </td>
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
        <th>Play On Youtube</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="track of tracks" :key="track.id"> 
        <td>{{track.track_id}}</td>
        <td>{{track.track_title}}</td>
        <td>{{track.artist_name}}</td>
        <td>{{track.album_title}}</td>
        <td>{{track.track_duration}}</td>
        <td>{{(JSON.parse(track.track_genres.replace(/'/g, '"'))[0].genre_title || 'No Genere Listed')}}</td>
        <td>
          <a v-bind:href="('https://www.youtube.com/results?search_query='+ track.artist_name + ', ' + track.album_title + ', ' + track.track_title)" target="_blank">
            <button>Play</button>
          </a>
        </td>
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