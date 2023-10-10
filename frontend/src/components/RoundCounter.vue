<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import {useGameStore} from "@/stores/roundCount";

const gameStore = useGameStore();

onMounted(() => {
gameStore.startNextRoundTimer();
});

onBeforeUnmount( () => {
  if (gameStore.timerInterval) {
    clearInterval(gameStore.timerInterval);
  }
})

</script>

<template>
  <div class="showRound">
    <h2>ROUND {{gameStore.currentRound}}/{{gameStore.totalRounds}}</h2>
    <p>Time Remaining: {{gameStore.remainingTime}}s</p>
  </div>
</template>

<style scoped>

</style>