<script setup>
import { ref, onMounted } from "vue";
import { store } from './../store/index.js'

const url = `${store.url}/reviews`
const hideListInfo = ref(false)

const rmsg = ref('')
const reviewText = ref('')
async function submitReview(event){
  event.preventDefault();
  let chosen;
  document.getElementsByName('rating').forEach(e=>{if(e.checked) chosen=e.value})
  if(reviewText.value.length===0 || typeof chosen==='undefined')
    return rmsg.value = 'Please Make Sure To Type In A Review And Choose A Rating';

    const aurl = `${url}/addReview/${result.value[0].name}/${store.username.toLowerCase()}/${reviewText.value}/${chosen}`;
    const res = await fetch(aurl);
    const data = await res.json();
    rmsg.value = data;

    setTimeout(updateReviews, 600)
}

async function updateReviews(){
  const uurl = `${url}/updateReview/${result.value[0].name}`;
    const res = await fetch(uurl);
    const data = await res.json();
    result.value[0].comments = data
}

const hmsg = ref('')
async function hideNShow(name, index, hide){
    const durl = `${url}/hideShow/${name}/${index}/${hide}`;
    const res = await fetch(durl);
    const data = await res.json();
    hmsg.value = data;
    this.result[0].comments[index].hidden = hide
}

function arrToStr(arr){
  return arr.toString();
}

const tmsg = ref('')
const tracks = ref([]);
const showTrack = ref(false);
async function viewTracks(id){
  showTrack.value = !showTrack.value
  tmsg.value = 'Tracks Info Hidden'
  if(!showTrack.value) return;
  tmsg.value = 'Please Wait As We Retrieve Tracks Info'
  const tracksStr = arrToStr(this.result[id].tracks);
  const vurl = `${store.url}/user/trackInfo/${tracksStr}`;
  const res = await fetch(vurl);
  const data = await res.json();
  tracks.value = data;
  tmsg.value = 'Tracks Info Retrieved'
}

const result = ref([]);
async function getPlaylist(){
    const purl = `${url}/getPlaylist/${store.trackToReview}`;
    const res = await fetch(purl);
    const data = await res.json();
    result.value = data;
}
onMounted(() => {getPlaylist()})
</script>

<template>
    <div v-for="(list, index) in result" :key="index">
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
        </tr>
        </thead>
        <tbody>
            <tr>
            <td id="img"><img src='../assets/music-cover.png'></td> 
            <td>{{list.name}}</td>
            <td>{{list.creator_username}}</td>
            <td>{{list.tracks.length}}</td>
            <td>{{list.duration}}</td>
            <td>{{list.comments.length > 0? ((list.comments.map(e=>e.rating).reduce((accumulator, currentValue) => accumulator + currentValue) / list.comments.length.toFixed(2))) : 0}} / 5</td>
            <td>
            <button @click="(() => {hideListInfo = !hideListInfo; showTrack = false; if(!hideListInfo)tmsg = 'Tracks Info Hidden';})">
                {{hideListInfo? 'hide':'show more'}}
            </button>
            <table v-if="hideListInfo">
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
            </tr>
        </tbody>
        </table>

        <br><br>
        <span>{{hmsg}}</span>
        <br>
        <table>
            <tbody v-for="(review, id) in (list.comments)" :key="id" style="text-align: left; height: 50px; border:2px black solid">
                <tr v-if="(!review.hidden) || (store.username.toLowerCase()===review.commenter.toLowerCase()) || (store.admin)">
                    <td>{{review.commenter}}</td>
                    <td>{{review.comment}}</td>
                    <td>{{review.rating}}</td>
                    <td v-if="(store.username.toLowerCase()===review.commenter.toLowerCase()) || (store.admin)"><button @click="hideNShow(list.name, id, !review.hidden)">{{review.hidden? 'Show This?':'Hide This?'}}</button></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="!store.public">
      <br><br>
      Add A Review
      <form  @submit="submitReview">
        <br>
        <textarea v-model="reviewText" cols="100" rows="6"></textarea>
        <br><br>
        <input type="radio" name="rating" value="1">1
        <input type="radio" name="rating" value="2">2
        <input type="radio" name="rating" value="3">3
        <input type="radio" name="rating" value="4">4
        <input type="radio" name="rating" value="5">5
        <br><br>
        <button type="submit" value="Submit">Publish</button>
        <br>
        <span>{{rmsg}}</span>
      </form>
    </div>

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