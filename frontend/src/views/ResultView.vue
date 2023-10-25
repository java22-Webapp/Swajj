<script setup>
import { useNicknameStore } from '@/stores/nickname';
import { useGameStore } from '@/stores/game';
import { router } from '@/router/index';
import { useSettingsStore } from '@/stores/settings';
import {ref} from "vue";

const useRouter = router;
const nickNameStore = useNicknameStore();
const userScoreStore = useGameStore();
const newRounds = useGameStore();
const roundTimer = useGameStore();
const settings = useSettingsStore();
const maxRounds = useSettingsStore();
const imagePath = ref('');


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
  userScoreStore.lives = settings.settings.kidsMode ? 3 : 0
}
imagePath.value = userScoreStore.getImagePath(userScoreStore.userScore, settings.settings.rounds);

</script>

<template>
  <header><div class="logo_s">S</div>
  </header>
  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
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
          <image x="120" y="100" width="200" height="200" :xlink:href="imagePath" />
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
        <button class="button" id="playBtn" @click="redirectToPlay">PLAY AGAIN</button>
        <button class="button" id="playBtn" @click="redirectToMenu">MENU</button>
      </section>
  </main>
</template>

<style scoped>

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

#cloud1, #cloud4, #cloud2, #cloud3 {
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
@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4, .rotatedCardBrain{
    display: none;
  }

  main{
    margin-top: -10px;
  }

  .nickname{
    top: 25%;
  }
  .result{
    top: 15%;
  }

  .result-card{
    padding: 0;
  }
}

@media only screen and (min-width: 800px)  and (max-width: 1000px){
  #cloud4, #cloud2,  #cloud1{
    display: none;
  }

  main{
    margin-top: -10px;
  }


  .rotatedCardBrain{
    top: 60%;
  }

  #cloud3 {
    top:  60%;
    left: 60%;
    transform: scale(0.65) scaleX(-1);
  }

}

</style>
