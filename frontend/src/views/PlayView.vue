<script setup>
import RoundCounter from "@/components/RoundCounter.vue";

</script>


<template>
  <section>
  <div class="showRound">
    <RoundCounter />
  </div>

  </section>
  <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card">
</template>


<style scoped>

.rotatedCardBrain {
  position: absolute;
  top: 28em;
  left: -8em;
  transform: rotate(30deg);
}

.showRound {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
}

</style>