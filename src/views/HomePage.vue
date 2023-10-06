<script setup>
</script>

<template>
  <main>

    <section class="buttons">
      <img id="cardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
      <button id="soloPlay">Play Solo</button>
      <button id="multiPlay">Multiplayer</button>
    </section>
  </main>
</template>

<style scoped>


button {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 36px;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
  background-color: var(--button-color);
  color: var(--card-color);
  border-radius: 4px;
  padding: 0.5em 1em;
  width: 8em;
  z-index: 999;
}



.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1em;
}


#cardBrain {
  top: 35%;
  left: 45%;
}

</style>
