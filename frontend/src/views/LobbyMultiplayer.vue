<script setup>
import {ref} from 'vue';
import SettingsPanel from '@/components/SettingsPanel.vue';
import { useNicknameStore } from '@/stores/nickname';
import ListOfPlayers from "@/components/ListOfPlayers.vue";
import { io } from "socket.io-client";
import router from "@/router";

const gameLink = ref('');
const copied = ref(false);
const nickNameStore = useNicknameStore();
const copyButtonRef = ref(null);
const socket = ref(null);

socket.value = io('http://localhost:3000');
function startMultiplayerGame() {
  const url = new URL(gameLink.value);
  const roomId = url.searchParams.get('roomId');

  // Call for startGame to server + all clients with the roomId
  socket.value.emit("startGame", roomId);
  router.push({ name: 'PlayMultiplayer', params: { roomId: roomId}})
}

async function copyLink(event) {
  if (!gameLink.value) {
    try {
      const response = await fetch('http://localhost:3000/generate-game-link');
      const data = await response.json();
      gameLink.value = data.gameLink;
    } catch (error) {
      console.error('Error generating game link: ', error);
      copied.value = false;
    }
  }
  navigator.clipboard
    .writeText(gameLink.value)
    .then(() => {
      copied.value = true;
    }).catch((err) => {
    console.error('Failed to copy link:', err);
    copied.value = false;
  });

  const tooltip = document.querySelector('.tooltip');
  const top = event.clientY + 10;
  const left = event.clientX + 10;
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.display = 'block';

  const updateTooltipPosition = (e) => {
    const tooltip = document.querySelector('.tooltip');
    const top = e.clientY + 10;
    const left = e.clientX + 10;
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  document.addEventListener('mousemove', updateTooltipPosition);

  setTimeout(() => {
    tooltip.style.display = 'none';
    document.removeEventListener('mousemove', updateTooltipPosition);
  }, 1000);


}


</script>

<template>
  <header><div id="logo_s">S</div>
      <button class="button" id="iphoneIpadButton">Players</button>
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
    <section id="content">
      <ListOfPlayers id="listOfPlayers" />
      <section id="settingsSection">
        <SettingsPanel id="settingsPanel" />
        <div id="nickname">Nickname: {{ nickNameStore.nickname }}</div>
        <button ref="copyButtonRef" @click="copyLink" class="button" id="copyLinkBtn">
          Copy link <span class="tooltip" >Link copied</span>
        </button>
        <button class="button" id="playBtn" @click="startMultiplayerGame">Play</button>
      </section>
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
}

#iphoneIpadButton {
  font-size: small;
  display: none;
}

#nickname {
  margin-top: 1em;
  z-index: 10;
}

#settingsPanel {
  font-size: 23px;
  z-index: 10;
}

#content {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  gap: 10em;
}

#listOfPlayers {
  margin-right: -20em;
  min-width: 318px;
  min-height: 500px;
  z-index: 10;
}

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

#copyLinkBtn {
  cursor: pointer;
  position: relative;
}

.tooltip {
  display: none;
  width: fit-content;
  background-color: #333;
  color: #fff;
  font-size: 18px;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: fixed;
  z-index: 1;
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

#settingsSection {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.rotatedCardBrain {
  position: absolute;
  top: 15em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4, .rotatedCardBrain,#listOfPlayers {
    display: none;
  }

  #iphoneIpadButton{
    display: block;
  }

  main{
    margin-top: -10px;
  }

  #settingsPanel{
    transform: scale(0.7);
    width: max-content;
  }

}

@media only screen and (min-width: 800px)  and (max-width: 1000px){
  #cloud4, #cloud2, #cloud1,#listOfPlayers{
    display: none;
  }
  #iphoneIpadButton{
    display: block;
    transform: scale(1.4);
    left: -5%;
  }
  #listOfPlayers {
    position: relative;
    z-index: 2;
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