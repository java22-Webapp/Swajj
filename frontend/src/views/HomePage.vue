<script setup>
import NicknameInput from '@/components/NicknameInput.vue';
import { useRouter } from 'vue-router';
import { useSocketStore } from "@/stores/socket";
import { onMounted } from "vue";
import { useNicknameStore } from "@/stores/nickname";
const socket = useSocketStore();
const nickNameStore = useNicknameStore();
const router = useRouter();

const handleMultiplayerClick = () => {

  if (nickNameStore.nickname.trim() === '') {
    alert('Please enter a nickname');
    return;
  }

  router.push('/Multiplayer');
};

onMounted(() => {
  if (socket && socket.connected) {
    socket.disconnect()
    console.log("Socket disconnected in homePage")
  }
})

</script>

<template>
  <main>
    <header>
      <div class="logo_s">S</div>
    </header>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <section class="buttons">
      <img id="cardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
      <NicknameInput />
      <button class="button" id="soloPlay">
        <router-link to="/solo" class="routerLinkBtnText">Play Solo</router-link>
      </button>
      <button class="button" id="multiPlay" @click="handleMultiplayerClick">Multiplayer</button>
    </section>
  </main>
</template>

<style scoped>
html,
body {
  height: 100%;
  width: 100%;
}

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  z-index: 1;
}

#cloud1,
#cloud4,
#cloud2,
#cloud3 {
  position: absolute;
}

.clouds {
  width: 100%;
  height: 100%;
  position: absolute;
}

#cloud1 {
  top: 52%;
  left: 12%;
  transform: scale(0.7);
}

#cloud2 {
  left: 6%;
  top: 4%;
  transform: scale(0.7) rotate(-5deg);
}

#cloud3 {
  top: -8%;
  left: 60%;
  transform: scale(0.65) scaleX(-1);
}

#cloud4 {
  top: 35%;
  left: 65%;
  transform: scale(0.7) scaleX(1);
}

#cardBrain {
  max-height: 45vh;
  top: 35%;
  left: 45%;
  z-index: 0;
}

@media only screen and (min-width: 800px) and (max-width: 1000px) {
  #cloud4 {
    display: block;
    transform: scale(0.8);
  }

  main {
    margin-top: -10px;
  }

  #cloud1 {
    top: 60%;
    left: -10%;
    transform: scale(0.7);
  }

  #cloud2 {
    left: -2%;
    top: 4%;
    transform: scale(0.7)
  }

  #cloud3 {
    left:60%;
    transform: scale(0.7);
  }
}

@media only screen and (min-width: 320px) and (max-width: 799px) {
  #cloud1,
  #cloud2,
  #cloud3,
  #cloud4 {
    display: none;
  }

  main {
    margin-top: -10px;
  }
}
</style>