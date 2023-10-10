<script setup>

import NicknameInput from "@/components/NicknameInput.vue";



</script>

<template>
  <main>
    <section class="buttons">
      <img id="cardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
      <NicknameInput />
      <button  class="menuButton" id="soloPlay" >
        <router-link  to="/solo" class="routerLinkBtnText" >Play Solo</router-link>
      </button>
      <button class="menuButton" id="multiPlay">
        <router-link to="/Multiplayer" class="routerLinkBtnText">Multiplayer</router-link>
      </button>
    </section>
  </main>
</template>


<style scoped>

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
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
