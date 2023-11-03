<script setup>
import { useGameStore } from '@/stores/game';
import { router } from '@/router';
import { computed, onMounted, ref } from 'vue';
import { useSocketStore } from '@/stores/socket';

const useRouter = router;
const userScoreStore = useGameStore();
const socketStore = useSocketStore();
const results = ref([]);
const gameLink = ref('');
const isHost = ref(false);
let oldRoomId = ref("");

const playAgain = async () => {
  try {
    await fetch('http://localhost:3000/play-again-multiplayer', {
      method: 'GET'
    });

    const response = await fetch('http://localhost:3000/generate-game-link');
    const data = await response.json();
    gameLink.value = data.gameLink;
    const roomId = extractRoomId(gameLink.value);

    resetUserScore();

    if (isHost.value) {
      socketStore.emit('new-game-created', { newGameLink: roomId, oldRoomId: oldRoomId });
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

const sortedResults = computed(() => {
  return [...results.value].sort((a, b) => b.score - a.score);
});

function extractRoomId(gameLink) {
  const url = new URL(gameLink);
  return url.searchParams.get('roomId');
}

function resetUserScore() {
  userScoreStore.userScore = 0;
}

onMounted(async () => {
  socketStore.initializeSocket();
  sessionStorage.setItem('hasJoined', 'false');

  socketStore.on('new-game-created-clients', (data) => {
    router.push(`/join/?roomId=${data.newGameLink}`);
  });

  socketStore.on('new-game-created-host', (data) => {
    router.push(`/multiplayer/${data.newGameLink}`);
  });

  const roomId = router.currentRoute.value.fullPath.split('/')[2];
  oldRoomId.value = roomId;

  socketStore.emit('request-results', roomId);
  socketStore.on('results-for-room', (data) => {
    results.value = data;

    const host = data.find((user) => user.isHost);
    if (host) {
      isHost.value = host.user_id === socketStore.socket.id;
    }
  });
});

socketStore.on('disconnect', () => {
  console.log('Disconnected from server');
});
</script>

<template>
  <header>
    <div id="logo_s">S</div>
  </header>
  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
    <section>
      <div class="wrapper">
        <div class="scorecard">
          <ul class="nickname-and-score">
            <p class="result">Scoreboard</p>
            <li v-for="res in sortedResults" :key="res" class="player-stats">
              <img
                v-if="res.hasAnswered"
                src="@/assets/greenCheckmark.png"
                alt="Green checkmark"
                class="checkmark"
              />
              <span class="nickname">{{ res.nickname }}</span> <span class="score"> {{ res.score }}p </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="info-text" v-if="!isHost">Waiting for host to play again...</div>
      <button v-if="isHost" class="button" id="playBtn" @click="playAgain">Play again</button>
      <button class="button" id="playBtn" @click="redirectToMenu">Leave</button>
    </section>
  </main>
</template>

<style scoped>
body,
html {
  overflow: hidden;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.info-text {
  font-size: 24px;
  font-family: var(--button-font);
  font-style: italic;
  z-index: 1;
}


.info-text-host {
  font-size: 24px;
  font-family: var(--button-font);
  z-index: 1;
}

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
  text-shadow:
    -0.5px -1px 0 #000,
    1px -1px 0 #000,
    -0.5px 1px 0 #000,
    1px 1px 0 #000;
}

.scorecard {
  display: flex;
  justify-content: center;
  width: 400px;
  height: 350px;
  background-color: #fff6c2;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  z-index: 1;
  overflow: auto;
  text-overflow: ellipsis;
}

.nickname-and-score {
  display: block;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  width: 100%;
  padding: 0;
  z-index: 1;

}

.nickname {
  font-size: 24px;
  font-family: var(--question-font);
  margin-bottom: 5px;
  margin-left: 5%;
}

.score {
  font-size: 24px;
  font-family: var(--question-font);
  margin-bottom: 5px;
  margin-right: 10%;

}
#playBtn {
  display: block;
  position: relative;
  text-decoration: none;
  color: var(--card-text-color);
  height: initial;
}

.player-stats {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  border-bottom: 1px dotted black;
  width: 100%;
  font-family: var(--button-font);
  font-size: 20px;
}

.result {
  display: flex;
  font-size: 28px;
  font-weight: bold;
  border-bottom: 3px dotted black;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  z-index: 1;

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
  top: -8%;
  left: 60%;
  transform: scale(0.65) scaleX(-1);
}

#cloud4 {
  top: 40%;
  left: 65%;
  transform: scale(0.7) scaleX(1);
}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 320px) and (max-width: 799px) {
  .scorecard {
    display: flex;
    margin-top: 20px;
    justify-content: center;
    width: 250px;
    height: 380px;
    background-color: #fff6c2;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  }

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
