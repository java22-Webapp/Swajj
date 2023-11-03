<script setup>
import { ref, onMounted } from "vue";
import { useSocketStore } from "@/stores/socket";

const players = ref([]);
const socket = useSocketStore();
socket.initializeSocket();

onMounted(() => {
  socket.on('update-player-list', (updatedPlayers) => {
    players.value = updatedPlayers;
  });
});

</script>

<template>
  <div class="playerList">
    <ul>
      <li><p>Players ready</p></li>
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
  overflow-x: hidden;
  text-overflow: ellipsis;
}

li {
  list-style-type: none;
  margin-top: 0.4em;
}

p {
  font-size: x-large;
  font-weight: bold;
  text-decoration: underline;
  margin-left: 12%;
}

</style>