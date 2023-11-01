<script setup>
import {useGameStore} from '@/stores/game';
import {router} from '@/router';
import { onMounted, ref} from 'vue';
import {useSocketStore} from '@/stores/socket';

const useRouter = router;
const userScoreStore = useGameStore();
const socketStore = useSocketStore();
const results = ref([]);
const gameLink = ref('');
const isHost = ref(false);
let oldRoomId = ref("");
  const results = ref([]);
  const sortedResults = computed(() => {
    return [...results.value].sort((a, b) => b.score - a.score);
  })

const playAgain = async () => {
  try {
    await fetch('http://localhost:3000/play-again-multiplayer', {
      method: 'GET'
    });

    const response = await fetch('http://localhost:3000/generate-game-link');
    const data = await response.json();
    gameLink.value = data.gameLink;
    console.log('NEW GAME LINK::: ', gameLink.value);
    const roomId = extractRoomId(gameLink.value);
    console.log('Extracted room ID:: ');

    resetUserScore();

    console.log('isHost value: ', isHost.value);

    if (isHost.value) {
      console.log('NEW GAME CREATED WITH ROOM ID:: ', roomId);
      console.log("PLAYAGAIN roomID: ", roomId, "| oldRoomId: ", oldRoomId)
      socketStore.emit('new-game-created', {newGameLink: roomId, oldRoomId: oldRoomId});
    }
  } catch (error) {
    console.log('Error in playAgain function: ', error);
  }
};

const redirectToMenu = () => {
    resetUserScore();
  if (socketStore.socket) socketStore.disconnect();
  useRouter.push('/');
};

function extractRoomId(gameLink) {
  const url = new URL(gameLink);
  return url.searchParams.get('roomId');
}

function resetUserScore() {
  userScoreStore.userScore = 0;
}

onMounted(async () => {
  socketStore.initializeSocket();

  socketStore.on('new-game-created-clients', (data) => {
    //socketStore.emit('leave-room', { roomId: oldRoomId.value })
    router.push(`/join/?roomId=${data.newGameLink}`);
  });

  socketStore.on('new-game-created-host', (data) => {
    console.log(data.id);
    console.log(`PUSHING CLIENTS WITH roomId: `, data);
    console.log(`PUSHING CLIENTS WITH roomId: `, data.newGameLink);
    //socketStore.emit('leave-room', { roomId: oldRoomId.value })
    router.push(`/multiplayer/${data.newGameLink}`);
  });


  const roomId = router.currentRoute.value.fullPath.split('/')[2];
  oldRoomId.value = roomId;
  console.log('ROOM ID :: ', roomId);
  console.log('OLD ROOM ID: ', oldRoomId);



  socketStore.emit('request-results', roomId);
  console.log('sending request-results');
  socketStore.on('results-for-room', (data) => {
    results.value = data;

    const host = data.find((user) => user.isHost);
    console.log('Identified host: ', host);
    console.log('HOST usr_id:: ', host.user_id, ' - socket:: ', socketStore.socket);
    console.log('HOST usr_id:: ', host.user_id, ' - socket.id:: ', socketStore.socket.id);
    if (host) {
      isHost.value = host.user_id === socketStore.socket.id;
      console.log('Is this socket host? >> ', isHost.value);
    }
  });
});

socketStore.on('disconnect', () => {
  console.log('Disconnected from server');
});
</script>

<template>
  <header>
    <div id="logo_s">S Result</div>
  </header>
  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud"/>
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud"/>
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud"/>
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud"/>
    </section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card"/>
    <div class="result-card">
      <p class="result">Result</p>
      <div class="nickname">
        <li v-for="res in sortedResults" :key="res">
          {{ res.nickname }} || {{ res.score }}
        </li>
      </div>
      <div v-if="results.length > 0">
        {{ results[0].nickname }}
      </div>
      <div v-else>Inga resultat tillgängliga.</div>
      <svg
          width="442"
          height="350"
          viewBox="0 0 442 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_69_37)">
          <rect x="4" width="434" height="340" rx="10" fill="#FFF6C2"/>
        </g>
        <defs>
          <filter
              id="filter0_d_69_37"
              x="0"
              y="0"
              width="442"
              height="559"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
            />
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_69_37"/>
            <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_69_37"
                result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
    <section>
      <button class="button" id="playBtn" @click="playAgain">PLAY AGAIN</button>
      <div v-if="isHost">THIS IS THE HOST OF THE GAME</div>
      <!--      <button v-else class="button" id="playBtn" @click="redirectToJoin">PLAY AGAIN?</button>-->

      <button class="button" id="playBtn" @click="redirectToMenu">MENU</button>
    </section>
  </main>
</template>

<style scoped>
#playBtn[disabled] {
  pointer-events: none;
  opacity: 0;
}

#logo_s {
  background-color: var(--background-color);
  font-family: var(--logo-font);
  font-size: 6em;
  margin-left: 0.25em;
  color: var(--card-color);
  text-shadow: -0.5px -1px 0 #000,
  1px -1px 0 #000,
  -0.5px 1px 0 #000,
  1px 1px 0 #000;
}

.result-card {
  display: flex;
  justify-content: space-around;
  padding: 1em;
  position: relative;
}

#playBtn {
  display: block;
  position: relative;
  text-decoration: none;
  color: var(--card-text-color);
  height: initial;
}

.nickname {
  font-size: large;
  position: absolute;
  z-index: 1;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.result {
  font-size: x-large;
  font-weight: bold;
  text-decoration: underline;
  position: absolute;
  z-index: 1;
  top: 7%;
  left: 50%;
  transform: translate(-50%, -50%);
}

section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  z-index: 0;
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
  top: 20em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 320px) and (max-width: 799px) {
  #cloud1,
  #cloud2,
  #cloud3,
  #cloud4,
  .rotatedCardBrain {
    display: none;
  }

  main {
    margin-top: -10px;
  }

  .nickname {
    top: 25%;
  }

  .result {
    top: 15%;
  }

  .result-card {
    padding: 0;
  }
}

@media only screen and (min-width: 800px) and (max-width: 1000px) {
  #cloud4,
  #cloud2,
  #cloud1 {
    display: none;
  }

  main {
    margin-top: -10px;
  }

  .rotatedCardBrain {
    top: 60%;
  }

  #cloud3 {
    top: 60%;
    left: 60%;
    transform: scale(0.65) scaleX(-1);
  }
}
</style>