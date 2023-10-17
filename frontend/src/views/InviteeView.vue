<script setup>
import { io } from 'socket.io-client';
import NicknameInput from "@/components/NicknameInput.vue";
import { ref } from "vue";
import { useNicknameStore } from "@/stores/nickname";

const nickNameStore = useNicknameStore();
const socket = ref(null);
const buttonDisabled = ref(false);

function connectToSocket() {
  if (nickNameStore.nickname.trim() === '') {
    console.error("Nickname cannot be empty");
    return;
  }
  if (buttonDisabled.value) return;

  buttonDisabled.value = true;

  socket.value = io('http://localhost:3000');

  socket.value.on('connect', () => {
    console.log('Connected to server');
    socket.value.emit('newPlayer', nickNameStore.nickname);
  });

  socket.value.on('disconnect', () => {
    console.log('Disconnected from server')
  });
}


// const socket = io('http://localhost:3000');

// socket.emit('chatMessage', 'Hello world!');
// socket.on('messageAcknowledgement', (acknowledgement) =>{
//   console.log(acknowledgement);
//   console.log("Socket from inviteView is connected");
// })
// socket.on('connect', ()=>{
//   console.log('Connected to Socket server')
// })

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
      <section>
        <NicknameInput v-model="nickNameStore.nickname" />
        <button class="button" id="readyBtn" @click="connectToSocket">Ready</button>
        <p>Waiting for the game to start...</p>
        <img
          class="rotatedCardBrain"
          src="../assets/cardBrainYellow.png"
          alt="Brain holding a card"
        />
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

section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  z-index: 1;

}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: rotate(30deg);
}

.clouds {
  position: relative;
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
  top: 105%;
  transform: rotate(-5deg);
}

.cloud3 {
  top: -15%;
  left: 60%;
  transform: scaleX(-1);
}

.cloud4 {
  top: -10%;
  left: 5%;
  transform: scaleX(-1);
}

NicknameInput {
  width: 20em;
  height: 20em;
}
</style>
