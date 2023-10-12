<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import {useGameStore} from "@/stores/game";
import {useSettingsStore} from "@/stores/settings";

const gameStore = useGameStore();
const settingStore = useSettingsStore();




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
    <h2>ROUND {{gameStore.currentRound}}/{{settingStore.settings.rounds}}</h2>
    <p>Time Remaining: {{gameStore.remainingTime}}s</p>
  </div>
</template>

<style scoped>

</style>