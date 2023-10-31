<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import SettingsPanel from '@/components/SettingsPanel.vue';
import { useNicknameStore } from '@/stores/nickname';
import ListOfPlayers from '@/components/ListOfPlayers.vue';
import router from '@/router';
import { useSocketStore } from '@/stores/socket';
import { useSettingsStore } from '@/stores/settings';

const gameLink = ref('');
const copied = ref(false);
const nickNameStore = useNicknameStore();
const copyButtonRef = ref(null);
const settingsStore = useSettingsStore();
const socket = useSocketStore();
const roomId = ref(null);
const playerNicknames = ref([]);
socket.initializeSocket();

function startMultiplayerGame() {
  let roomId = router.currentRoute.value.params.roomId;

  if (!roomId) {
    const url = new URL(gameLink.value);
    roomId = url.searchParams.get('roomId');
  }

  const currentSettings = {
    kidsMode: settingsStore.settings.kidsMode,
    english: settingsStore.settings.english,
    rounds: settingsStore.settings.rounds,
    time: settingsStore.settings.time
  };

  socket.emit('startGame', { roomId, settings: currentSettings });
  router.push({ name: 'PlayMultiplayer', params: { roomId: roomId } });
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
  } else {
    const url = new URL(gameLink.value);
    roomId.value = url.searchParams.get('roomId');
  }
  navigator.clipboard
    .writeText(gameLink.value)
    .then(() => {
      copied.value = true;
    })
    .catch((err) => {
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
  };

  document.addEventListener('mousemove', updateTooltipPosition);

  setTimeout(() => {
    tooltip.style.display = 'none';
    document.removeEventListener('mousemove', updateTooltipPosition);
  }, 1000);
}

const showListOfPlayers = ref(false);

const listOfPlayers = () => {
  showListOfPlayers.value = !showListOfPlayers.value;
};

const isMobile = ref(window.innerWidth <= 1000);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 1000;
});

const shouldShowListOfPlayers = computed(() => {
  if (isMobile.value) {
    return showListOfPlayers.value;
  }
  return true;
});

onBeforeMount(() => {
  socket.on('update-player-list', (data) => {
    console.log('Data from update-player-list ' + data);
    playerNicknames.value = data;
  });
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/generate-game-link');
    const data = await response.json();
    gameLink.value = data.gameLink;
  } catch (error) {
    console.error('Error generating game link: ', error);
    copied.value = false;
  }

  const url = new URL(gameLink.value);
  roomId.value = url.searchParams.get('roomId');
  const nicknameStore = useNicknameStore();
  console.log('PLAYERS IN THIS ARRAY 1::: ', playerNicknames.value);
  socket.emit('set-host-nickname', {
    nickname: nicknameStore.nickname + ' (Host)',
    roomId: roomId.value
  });
  socket.emit('joinRoom', roomId.value);
  socket.emit('send-update', roomId.value);
  // const hostId = socket.socket.id;
  // localStorage.setItem('Host-ID', hostId);
});

console.log('LOBBY ROOM ID:: ', roomId);
</script>

<template>
  <header>
    <div class="logo_s">S</div>
    <button v-if="isMobile" class="button" id="iphoneIpadButton" @click="listOfPlayers">
      Players
    </button>
  </header>

  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
    <section id="content">
      <ListOfPlayers id="listOfPlayers" v-if="shouldShowListOfPlayers" />
      <section id="settingsSection">
        <SettingsPanel id="settingsPanel" />
        <div id="nicknameField">Nickname: {{ nickNameStore.nickname }}</div>
        <button ref="copyButtonRef" @click="copyLink" class="button" id="copyLinkBtn">
          Copy link <span class="tooltip">Link copied</span>
        </button>
        <button class="button" id="playBtn" @click="startMultiplayerGame">Play</button>
      </section>
    </section>
  </main>
</template>

<style scoped>
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

#nicknameField {
  background: var(--background-color);
  font-family: var(--button-font);
  font-weight: bold;
  border-radius: 4px;
  padding: 0.25em 0.5em;
  font-size: 1.25em;
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
  z-index: 0;
}

#cloud1 {
  top: 58%;
  left: 12%;
  transform: scale(0.7);
}

#cloud2 {
  left: 6%;
  top: 4%;
  transform: scale(0.7) rotate(-5deg);
}

#cloud3 {
  top: -20%;
  left: 55%;
  transform: scale(0.6);
}

#cloud4 {
  top: 60%;
  left: 60%;
  transform: scale(0.8);
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
  top: 20em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 800px) and (max-width: 1000px) {
  #cloud1 {
    display: none;
  }

  #iphoneIpadButton {
    display: flex;
    transform: scale(1.4);
    left: -5%;
  }

  #listOfPlayers {
    position: absolute;
    top: 20%;
    left: 30%;
    z-index: 100;
  }

  main {
    margin-top: 40px;
  }

  #cloud3 {
    left: 65%;
    transform: scale(0.5);
  }

  #cloud2 {
    top: -10%;
    left: -8%;
    transform: scale(0.5);
  }

  #cloud4 {
    top: 45%;
    left: 60%;
    transform: scale(0.5);
  }

  .rotatedCardBrain {
    top: 50%;
  }
}

@media only screen and (min-width: 320px) and (max-width: 799px) {
  #cloud1,
  #cloud2,
  #cloud3,
  #cloud4,
  .rotatedCardBrain {
    display: none;
  }

  #iphoneIpadButton {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  main {
    margin-top: -10px;
  }

  #settingsPanel {
    margin-top: 10px;
    transform: scale(0.9);
    width: max-content;
  }

  #listOfPlayers {
    position: absolute;
    top: 20%;
    left: 5%;
    z-index: 10000;
  }
}
</style>
