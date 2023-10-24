<script setup>
import NicknameInput from '@/components/NicknameInput.vue';
import { ref } from 'vue';
import { useNicknameStore } from '@/stores/nickname';
import ListOfPlayers from '@/components/ListOfPlayers.vue';
import { useRouter } from 'vue-router';
import { useSocketStore } from "@/stores/socket";

const nickNameStore = useNicknameStore();
const buttonDisabled = ref(false);
const router = useRouter();
const socket = useSocketStore();
socket.initializeSocket();

function connectToSocket() {
  const roomId = router.currentRoute.value.query.roomId;
  console.log('ROOM ID::: ', roomId);
  if (nickNameStore.nickname.trim() === '') {
    console.error('Nickname cannot be empty');
    return;
  }
  if (buttonDisabled.value) return;
  buttonDisabled.value = true;

  socket.emit('joinRoom', roomId);
  socket.emit('newPlayer', nickNameStore.nickname);

  // Listen for game start
  socket.on('gameStarted', () => {
    router.push({ name: 'PlayMultiplayer', params: { roomId: roomId }})
      .catch(err => console.log("Routing error from clients: ", err));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}
</script>
<template>
  <header><div id="logo_s">S</div>
  </header>
  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <img
      class="rotatedCardBrain"
      src="../assets/cardBrainYellow.png"
      alt="Brain holding a card"
    />
      <section>
        <ListOfPlayers id="listOfPlayers" />
        <NicknameInput v-model="nickNameStore.nickname" v-if="!buttonDisabled"/>
        <button class="button" id="readyBtn" @click="connectToSocket" v-if="!buttonDisabled">Ready</button>
        <h2 v-if="buttonDisabled">Waiting for the game to start...</h2>
      </section>
  </main>
</template>

<style scoped>
#logo_s {
  background-color: var(--background-color);
  font-family: var(--logo-font);
  font-size: 6em;
  margin-left: 0.25em;
  color: var(--card-color);
  text-shadow:
    -0.5px -1px 0 #000,
    1px -1px 0 #000,
    -0.5px 1px 0 #000,
    1px 1px 0 #000;
}

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

#listOfPlayers {
  min-width: 318px;
  min-height: 192px;
  max-height: 320px;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  z-index: 1;
}

NicknameInput {
  width: 20em;
  height: 20em;
}

#cloud1, #cloud4, #cloud2, #cloud3 {
  position: absolute;
}

.clouds {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}

#cloud1 {
  top: 52%;
  left: 12%;
  transform: scale(0.7);
}

#cloud2 {
  top: -18%;
  left: 4%;
  transform: scale(0.7) rotate(-5deg);
}

#cloud3 {
  top: -8%;
  left: 60%;
  transform: scale(0.65) scaleX(-1);
}

#cloud4 {
  top: -10%;
  left: -5%;
  transform: scale(0.7) scaleX(1);
}

.rotatedCardBrain {
  position: absolute;
  top: 8em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4, .rotatedCardBrain {
    display: none;
  }

  main{
    margin-top: 30px;
  }



}

@media only screen and (min-width: 800px)  and (max-width: 1000px){
  #cloud4, #cloud2, #cloud1 {
    display: none;
  }


  main{
    margin-top: 40px;
  }
  #cloud1 {
    top: 60%;
    left: -10%;
    transform: scale(0.7);
  }

  .rotatedCardBrain{
    top: 50%;
  }

  #cloud3 {
    top:  60%;
    left: 60%;
    transform: scale(0.65) scaleX(-1);
  }
}
</style>


