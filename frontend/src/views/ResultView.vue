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

const redirectToPlay = () => {
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

console.log(nickNameStore.nickname);
</script>

<template>
  <div class="result-card">
    <p class="result">Result</p>
    <p class="nickname">
      {{ nickNameStore.nickname }} | Score: {{ userScoreStore.userScore }}/{{
        settings.settings.rounds
      }}
    </p>
    <svg
      width="442"
      height="559"
      viewBox="0 0 442 559"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_69_37)">
        <rect x="4" width="434" height="551" rx="10" fill="#FFF6C2" />
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
  <section>
    <button class="menuButton" id="playBtn" @click="redirectToPlay">Play again</button>
    <button class="menuButton" id="playBtn" @click="redirectToMenu">Menu</button>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
  </section>
</template>

<style scoped>
.result-card {
  display: flex;
  justify-content: space-around;
  position: relative;
}

.nickname {
  font-size: large;
  position: absolute;
  z-index: 1;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.result {
  font-size: x-large;
  font-weight: bold;
  text-decoration: underline;
  position: absolute;
  z-index: 1;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}

section {
  margin-top: 2em;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 2em;
}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: rotate(30deg);
}
</style>