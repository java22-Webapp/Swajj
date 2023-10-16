<script setup>
import {ref} from 'vue'

const gameLink = ref('')
async function copyLink(){
  try{
const response = await fetch('http://localhost:3000/generate-game-link');
const data = await response.json();
gameLink.value = data.gameLink;
  } catch (error){
    console.error('Error generating game link: ', error)
  }
}
</script>

<template>
  <div>Multiplayer lobby</div>
  <div>
    <button @click="copyLink"> COPY LINK</button>
    <p>{{gameLink}}</p>
  </div>
</template>

<style scoped></style>