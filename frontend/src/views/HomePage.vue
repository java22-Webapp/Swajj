<script setup>

</script>

<template>
  <main>

    <section class="buttons">
      <img id="cardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
      <button  id="soloPlay">
        <router-link to="/Solo" id="solo-play-text">Play Solo</router-link>
      </button>
      <button id="multiPlay">
        <router-link to="/Multiplayer" id="multi-play-text">Multiplayer</router-link>
      </button>

    </section>
  </main>
</template>


<style scoped>




#solo-play-text, #multi-play-text {
  text-decoration: none;
  color: var(--card-color);
}

section {
  background-color: var(--background-color);
}

html {
  background-color: var(--background-color);
}

button {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 36px;
  text-decoration: none;
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
