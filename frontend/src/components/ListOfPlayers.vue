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
      <p> PLAYERS </p>
      <li v-for="player in players" :key="player">{{ player }}</li>
    </ul>
  </div>
</template>

<style scoped>

.playerList {
  width: 14em;
  height: 20em;
  max-width: 14em;
  max-height: 20em;
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