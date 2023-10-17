<script setup>
import { ref } from 'vue'

const gameLink = ref('')
const copied = ref(false)

async function copyLink(){
  try{
    const response = await fetch('http://localhost:3000/generate-game-link');
    const data = await response.json();
    gameLink.value = data.gameLink;
    navigator.clipboard.writeText(gameLink.value).then(() => {
      copied.value = true;
    }).catch(err => {
      console.error('Failed to copy link:', err);
      copied.value = false;
    });

  } catch (error){
    console.error('Error generating game link: ', error)
    copied.value = false;
  }
}
</script>

<template>
  <div>Multiplayer lobby</div>
  <div>
    <button @click="copyLink"> COPY LINK</button>
    <p v-if="copied" style="color: green;">Link Copied!</p>
  </div>
</template>

<style scoped></style>
