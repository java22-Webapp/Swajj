<script setup>
import { useNicknameStore } from '@/stores/nickname';
import { useGameStore } from '@/stores/game';
import { router } from '@/router/index';
import { useSettingsStore } from '@/stores/settings';

const useRouter = router;
const nickNameStore = useNicknameStore();
const userScoreStore = useGameStore();
const newRounds = useGameStore();
const roundTimer = useGameStore();
const settings = useSettingsStore();
const maxRounds = useSettingsStore();

const redirectToPlay = async () => {
  try {
    await fetch('http://localhost:3000/play-again', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error clearing questions: ', error);
  }
  newGameSettings();
  useRouter.push('/Play');
};

const redirectToMenu = () => {
  newGameSettings();

  useRouter.push('/');
};

function newGameSettings() {
  userScoreStore.userScore = 0;
  newRounds.currentRound = 1;
  roundTimer.remainingTime = useGameStore().remainingTime;
  maxRounds.settings.rounds = settings.settings.rounds;
}


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
      <div class="result-card">
        <p class="result">Result</p>
        <p class="nickname">
          {{ nickNameStore.nickname }} | Score: {{ userScoreStore.userScore }}/{{
            settings.settings.rounds
          }}
        </p>
        <svg
          width="442"
          height="350"
          viewBox="0 0 442 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_69_37)">
            <rect x="4" width="434" height="340" rx="10" fill="#FFF6C2" />
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
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_69_37" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_69_37" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <section class="buttons">
        <button class="button" id="playBtn" @click="redirectToPlay">PLAY AGAIN</button>
        <button class="button" id="playBtn" @click="redirectToMenu">MENU</button>
      </section>
      <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
    </section>
  </main>
</template>

<style scoped>

.result-card {
  display: flex;
  justify-content: space-around;
  padding: 2em;
  position: relative;
}

#playBtn {
  display: block;
  top: 0;
  left: 0;
  position: relative;
  text-decoration: none;
  color: var(--card-text-color);
  height: initial;
}

.nickname {
  font-size: large;
  position: absolute;
  z-index: 1;
  top: 15%;
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
  top: 67%;
  transform: rotate(-5deg);
}

.cloud3 {
  top: -10%;
  left: 61%;
  transform: scaleX(-1);
}

.cloud4 {
  top: -5%;
  left: 5%;
  transform: scaleX(-1);
}

</style>
