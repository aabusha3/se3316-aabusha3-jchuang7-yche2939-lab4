<script setup>
import { ref } from 'vue'
import { store } from './../store/index.js'

const url = `${store.url}/user`

const Name = ref('')
const Desc = ref('')
const Tracks = ref('')
const gresult = ref(false)
const iresult = ref('')
const msg = ref('')
const disabled = ref(false)

//adds a new playlist
function newEntry(event){
  disabled.value = true;
  iresult.value = '';
  msg.value = ''; 
  event.preventDefault();

  //turns the tracks string input into an array, sorts + checks if all are ints + removes duplicate entries  
  const Track = Tracks.value.split(',')
        .filter(e => typeof parseInt(e) === 'number'? parseInt(e):null)
        .map(x => parseInt(x)).sort((a,b) => (a-b))
        .filter((item, pos, ary) => (!pos || item != ary[pos - 1]));
        

  //ensures the required fields are filled out
  if(Track.length === 0 || Name.value.length === 0){
    disabled.value = false;
    return msg.value = 'Please Make Sure You Fill Out The Required Fields';
  }

  //checks if the entered name exists
  const getUniqueName = async function() {
    const gurl = `${url}/uniqueName/${store.username}/${Name.value}`;
    const gres = await fetch(gurl);
    const gdata = await gres.json();
    gresult.value = gdata;
    if(gresult.value) {
      disabled.value = 0;
      return msg.value = `Name '${Name.value}' Already Exists`;
    }

    //checks if the entered track numbers are valid
    const findId = async function() {
      Tracks.value = Track.toString();
      msg.value = 'Please Wait As We Check If The Track Exists';
      const furl = `${url}/find/${Tracks.value}`;
      const fres = await fetch(furl);
      const fdata = await fres.json();
      if(!fdata.found) {
        disabled.value = false;
        return msg.value = 'Please Make Sure You Only Enter In Valid Track Ids';
      }
  
      //insert new entry in the databse
      if(Desc.value.length === 0) Desc.value = ' ';
      const insertNew = async function(){
        const iurl = `${url}/newList/${store.username}/${Name.value}/${Desc.value}/${Tracks.value}/${fdata.totalTime}`;
        const ires = await fetch(iurl);
        const idata = await ires.json();
        msg.value = '';
        iresult.value = idata;
        Name.value = '';
        Desc.value = '';
        Tracks.value = '';
        disabled.value = false;
      } ();
    } ();
  } ();
}
</script>

<template>
  <router-link to='/userHomePage'>Back to playlists</router-link>
  <div>
    <h1>Create New PLaylist Entry</h1>
    <form  @submit="newEntry">
        Name: <input v-model="Name" :disabled="disabled" type="text" placeholder="Name It *required"><br><br>
        Description: <input v-model="Desc" :disabled="disabled" type="text" placeholder="Describe It *optional"><br><br>
        Tracks: <input v-model="Tracks" :disabled="disabled" style="width:270px" type="text" placeholder="What Tracks Ids To Add e.g. '2,3,5' *required"><br><br>
        <button :disabled="disabled" type="submit" value="Submit" >Sumbit</button>       
    </form>
    <span v-if="msg">{{ msg }}</span>
    <span v-if="iresult">Playlist '{{ iresult.name }}' has been added</span>
</div>
</template>
