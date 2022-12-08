<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  name: String,
  desc: String,
  tracks: String
})
const emit = defineEmits(['done'])


onMounted(() => {
  Name.value = props.name;
  Desc.value = props.desc===' '? '' : props.desc;
  Tracks.value = props.tracks;
})


const Name = ref('')
const Desc = ref('')
const Tracks = ref('')
const gresult = ref(false)
const uresult = ref('')
const msg = ref('')
const disabled = ref(false)


function updateEntry(event){
  msg.value = ''; 
  const Track = Tracks.value.split(',')
        .filter(e => typeof parseInt(e) === 'number'? parseInt(e):null)
        .map(x => parseInt(x)).sort((a,b) => (a-b))
        .filter((item, pos, ary) => (!pos || item != ary[pos - 1]));

  if(Name.value === props.name && Track.toString() === props.tracks) 
    if(props.desc===' '? Desc.value === '' : Desc.value === props.desc) return;


  disabled.value = true;
  uresult.value = '';
  event.preventDefault();

  if(Track.length === 0 || Name.value.length === 0){
    disabled.value = false;
    return msg.value = 'Please Make Sure You Fill Out The Required Fields';
  }

  const getUniqueName = async function() {
    if(Name.value !== props.name){
      const gurl = `http://localhost:3000/api/user/uniqueName/${Name.value}`;
      const gres = await fetch(gurl);
      const gdata = await gres.json();
      gresult.value = gdata;
      if(gresult.value) {
        disabled.value = 0;
        return msg.value = `Name '${Name.value}' Already Exists`;
      }
    }
    const findId = async function() {
      Tracks.value = Track.toString();
      msg.value = 'Please Wait As We Check If The Track Exists';
      const furl = `http://localhost:3000/api/user/find/${Tracks.value}`;
      const fres = await fetch(furl);
      const fdata = await fres.json();
      if(!fdata.found) {
        disabled.value = false;
        return msg.value = 'Please Make Sure You Only Enter In Valid Track Ids';
      }
  
      if(Desc.value.length === 0) Desc.value = ' ';
      const updatetNew = async function(){
        const LDM = new Date().toString();
        const uurl = `http://localhost:3000/api/user/updateList/${props.name}/${Name.value}/${Desc.value}/${Tracks.value}/${LDM}/${fdata.totalTime}`;
        const ures = await fetch(uurl);
        const udata = await ures.json();
        msg.value = '';
        uresult.value = udata;
        disabled.value = false;
        emit('done', {Name: Name.value, Desc: Desc.value, Tracks: Tracks.value, DLM: LDM})
      } ();
    } ();
  } ();
}
</script>

<template>
  <div>
    <h1>Update PLaylist '{{name}}' Entry</h1>
    <form  @submit="updateEntry">
        Name: <input v-model="Name" :disabled="disabled" type="text" placeholder="Name It *required"><br><br>
        Description: <input v-model="Desc" :disabled="disabled" type="text" placeholder="Describe It *optional"><br><br>
        Tracks: <input v-model="Tracks" :disabled="disabled" type="text" placeholder="What Tracks Ids To Add e.g. '2,3,5' *required"><br><br>
        <button :disabled="disabled" type="submit" value="Submit" >Sumbit</button>       
    </form>
    <span v-if="msg">{{ msg }}</span>
    <span v-if="uresult">{{ uresult }}</span>
</div>
</template>
