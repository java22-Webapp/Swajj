<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";

const players = ref([]);
const socket = io('http://localhost:3000');

onMounted(() => {
  socket.on('update-player-list', (updatedPlayers) => {
    players.value = updatedPlayers;
  });
});

onUnmounted(() => {
  socket.disconnect();
})

</script>

<template>
  <div class="playerList">
    <ul>
      <li><p> PLAYERS </p></li>
      <li v-for="player in players" :key="player">{{ player }}</li>
    </ul>
  </div>
</template>

<style scoped>

.playerList {
  font-size: 1.45em;
  max-width: 318px;
  max-height: 500px;
  font-family: var(--question-font);
  border: 1px solid black;
  border-radius: 10px;
  background-color: var(--card-color);
  overflow: auto;
}

li {
  list-style-type: none;
  margin-top: 0.4em;
}

</style>