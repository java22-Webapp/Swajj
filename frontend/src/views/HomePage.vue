<script setup>
import NicknameInput from '@/components/NicknameInput.vue';
import { io } from 'socket.io-client';
import { useNicknameStore } from '@/stores/nickname';
import { useRouter } from "vue-router";

const nicknameStore = useNicknameStore();
const socket = io('http://localhost:3000');

const router = useRouter();



const handleMultiplayerClick = () => {
  socket.emit('set-host-nickname', nicknameStore.nickname);
  router.push('/Multiplayer');
};

</script>

<template>
  <main>
    <section class="clouds">
      <section class="cloud cloud2">
        <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      </section>
      <section class="cloud cloud3">
        <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      </section>
      <section class="cloud cloud4">
        <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      </section>
      <section class="cloud cloud1">
        <img id="cloud" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
      </section>

      <section class="buttons">
        <img id="cardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
        <NicknameInput />
        <button class="button" id="soloPlay">
          <router-link to="/solo" class="routerLinkBtnText">Play Solo</router-link>
        </button>
        <button class="button" id="multiPlay" @click="handleMultiplayerClick">
          Multiplayer
        </button>
      </section>
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
  z-index: 1;
}
.clouds {
  position: relative;
  z-index: 0;
}
.cloud {
  position: absolute;
}
.cloud1 {
  top: 1%;
  left: 12%;
}
.cloud2 {
  left: 5%;
  top: 68%;
  transform: rotate(-5deg);
}
.cloud3 {
  top: -8%;
  left: 60%;
  transform: scaleX(-1);
}
.cloud4 {
  top: -7%;
  left: 5%;
  transform: scaleX(-1);
}

#cardBrain {
  top: 35%;
  left: 45%;
  z-index: 0;
}
</style>