<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onBeforeUnmount, computed, onBeforeMount } from 'vue';
import questionCardStack from '../assets/questionCardStack.png';
import questionCardStackFlipped from '../assets/questionCardStackFlipped.png';
import { useGameStore } from '@/stores/game';
import { useRouter } from 'vue-router';
import { useSocketStore } from '@/stores/socket';
import { useSettingsStore } from '@/stores/settings';

const questions = ref('');
const answers = ref([]);
const isCorrect = ref([]);
const answerID = ref([]);
const userScoreHolder = useGameStore();
const settingsStore = useSettingsStore();
const timerInterval = ref(null);
let selectedAnswerIndex = ref(null);
const buttonDisabled = ref(false);
const router = useRouter();
let roomId = ref('');
const socket = useSocketStore();
const results = ref([]);
const svgBoxShadow = ref('0px 4px 4px rgba(0, 0, 0, 0.25)');

const answersCombo = computed(() => {
  const result = [];
  for (let i = 0; i < answers.value.length; i++) {
    result.push({ answer_text: answers.value[i], id: answerID.value[i] });
  }
  return result;
});

const imgSrc = ref(questionCardStack);
const isFlipped = computed(() => imgSrc.value === questionCardStackFlipped);

socket.on('update-answers-status', (updateResults) => {
  results.value = updateResults;
});

function resetRoundState() {
  resetBtnClasses();
  clearInterval(timerInterval.value);
  getNewQuestion();
}

function resetGameState() {
  clearInterval(timerInterval.value);
  userScoreHolder.currentRound = 1;
}

const startTimer = (() => {
  console.log('CALLING START-TIMER');
  let firstTimeCalled = true;
  return () => {
    socket.emit('request-results', roomId.value);
    clearInterval(timerInterval.value);
    if (!firstTimeCalled) {
      useGameStore().nextRound();
    }
    timerInterval.value = setInterval(() => {
      if (useGameStore().remainingTime > 0) {
        useGameStore().remainingTime--;
      } else {
        showCorrectAnswer();
        console.log('TIMER-EXPIRED EVENT for room: ', roomId.value);
        socket.emit('timer-expired', roomId.value);
        clearInterval(timerInterval.value);
        setTimeout(resetRoundState, 2000);
      }
    }, 1000);
    firstTimeCalled = false;
  };
})();

onBeforeMount(() => {
  socket.initializeSocket();
  roomId.value = router.currentRoute.value.params.roomId;
  socket.emit('joinRoom', roomId.value);
  socket.emit('request-results', roomId.value);
  console.log('sending request-results');
  socket.on('results-for-room', (data) => {
    results.value = data;
    console.log(data.time);
  });

  getNewQuestion();
  startTimer();

  socket.on('new-question', (data) => {
    questions.value = data.question;
    answers.value = data.answers;
    isCorrect.value = data.isCorrect;
    answerID.value = data.answerId;
    imgSrc.value = questionCardStackFlipped;
  });

  socket.on('round-completed', () => {
    console.log('round-completed event fired');
    resetRoundState();
    startTimer();
  });
});

onBeforeUnmount(() => {
  resetGameState();
  socket.off('new-question');
  socket.off('round-completed');
  socket.off('update-answers-status');
  socket.off('results-for-room');
  socket.off('answer-result');
});

function getNewQuestion() {
  const queryString = `kidsMode=${settingsStore.settings.kidsMode}&english=${settingsStore.settings.english}`;
  socket.emit('requestNewQuestion', { roomId, queryString });
}

function userAnswer(e, index) {
  selectedAnswerIndex.value = index;

  if (buttonDisabled.value) return;
  buttonDisabled.value = true;

  socket.emit('user-selected-answer', {
    roomId: roomId.value,
    answerIndex: index
  });
  e.target.classList.add('selected-answer');
}

socket.on('answer-result', (data) => {
  const { correct, isCorrectArray } = data;
  const correctAnswerIndex = isCorrectArray.findIndex((value) => value === 1);
  const correctButtonSelector = `#btnAnswer-${answerID.value[correctAnswerIndex]}`;
  const correctButton = document.querySelector(correctButtonSelector);

  if (correctButton) {
    clearInterval(timerInterval.value);
    if (correct) {
      userScoreHolder.userScore++;
      correctButton.classList.add('correct-answer');
    } else {
      showCorrectAnswer();
      const selectedButton = document.querySelector(
        `#btnAnswer-${answerID.value[selectedAnswerIndex.value]}`
      );
      if (selectedButton) selectedButton.classList.add('incorrect-answer');
    }
  } else {
    console.log('Could not find the button with the provided selector.');
  }
  selectedAnswerIndex.value = null;
});

function resetBtnClasses() {
  buttonDisabled.value = false;
  const buttons = document.getElementsByClassName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('correct-answer');
    buttons[i].classList.remove('incorrect-answer');
    buttons[i].classList.remove('selected-answer');
    clearInterval(timerInterval.value);
  }
}

function showCorrectAnswer() {
  const indexOfCorrectAnswer = isCorrect.value.findIndex((correctValue) => correctValue === 1);

  const buttons = document.getElementsByClassName('button');
  [...buttons].forEach((btn) => {
    if (btn.dataset.key === indexOfCorrectAnswer + '') {
      btn.classList.add('correct-answer');
    }
  });
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
    <section>
      <div class="showRound">
        <RoundCounter />
      </div>
    </section>
    <div class="result-card" v-if="shouldShowListOfPlayers">
      <div id="playerContainer">
        <p class="result">Scoreboard</p>
        <ul class="nickname">
          <li v-for="res in results" :key="res">
            <div id="playerStats">
              <img
                v-if="res.hasAnswered"
                src="@/assets/greenCheckmark.png"
                alt="Green checkmark"
              />{{ res.nickname }}:
              {{ res.score }}
            </div>
          </li>
        </ul>
      </div>
      <svg
        width="442"
        height="350"
        viewBox="0 0 442 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g :filter="`url(#filter0_d)`">
          <rect x="4" width="434" height="340" rx="10" fill="#FFF6C2" />
        </g>
        <defs>
          <filter
            :id="`filter0_d`"
            x="0"
            y="0"
            width="442"
            height="350"
            filterUnits="userSpaceOnUse"
            :style="`color-interpolation-filters: sRGB;`"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset :dy="svgBoxShadow" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
    <section class="QNA">
      <div id="deckDiv">
        <div class="deckQuestions">{{ questions }}</div>
        <img id="idleDeck" :src="imgSrc" :class="{ flipped: isFlipped }" alt="Card deck" />
      </div>
      <div id="answerBtns">
        <button
          class="button"
          v-for="(answer, index) in answersCombo"
          :id="'btnAnswer-' + answer.id"
          :key="answer.id"
          @click="(e) => userAnswer(e, index)"
          :data-key="index"
          :disabled="buttonDisabled"
        >
          {{ answer.answer_text }}
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
body,
html {
  overflow: hidden;
}

.result-card {
  position: absolute;
  margin-left: 70%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
}

#playerStats {
  display: flex;
  height: 15px;
  max-height: 15px;
  align-items: center;
  padding: 0;
  left: 50%;
}

.nickname {
  list-style-type: none;
  padding: 0;
  position: absolute;
  z-index: 1;
  top: 10%;
  left: 10%;
}

.nickname li {
  display: block;
  padding: 0;
  margin-top: 15px;
  font-size: 24px;
}

.nickname img {
  position: absolute;
  vertical-align: middle;
  padding: 0;
  transform: scale(10%);
  height: auto;
  margin-left: -65%;
}

.result {
  font-size: x-large;
  font-weight: bold;
  text-decoration: underline;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
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

.hearts img {
  height: 2.5em;
  width: 2.5em;
}

.deckQuestions {
  position: absolute;
  top: 60%;
  left: 58%;
  transform: translate(-70%, -50%);
  z-index: 1;
  width: fit-content;
  font-size: 24px;
  font-family: var(--question-font);
}

#deckDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

#idleDeck {
  width: 30%;
  height: 50%;
  display: block;
}

#idleDeck.flipped {
  width: 70%;
  left: -4%;
  position: relative;
}

.showRound {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
  font-family: var(--timer-round-font);
  z-index: 1;
  background: var(--background-color);
  padding: 0 1em;
  border-radius: 4px;
}

.QNA {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#answerBtns {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.25em;
  align-items: center;
  margin-top: 1em;
  margin-right: 4em;
  z-index: 1;
}

#answerBtns button {
  flex-basis: calc(50% - 10px);
  font-size: 18px;
  width: 7em;
  height: 4em;
  padding: 2px;
}

.correct-answer {
  border: 0.25em solid green;
}

.incorrect-answer {
  border: 0.25em solid red;
}

.selected-answer {
  background-color: #91b2b3;
}

#listOfPlayers {
  position: absolute;
  margin-right: -40em;
  margin-top: -10%;
  height: fit-content;
  min-width: 300px;
  z-index: 2;
}

@media only screen and (min-width: 800px) and (max-width: 1000px) {
  #cloud4,
  #cloud2,
  #cloud1 {
    display: none;
  }

  #iphoneIpadButton {
    display: block;
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

  #cloud1 {
    top: 60%;
    left: -10%;
    transform: scale(0.7);
  }

  .rotatedCardBrain {
    top: 50%;
  }

  #cloud3 {
    top: 60%;
    left: 60%;
    transform: scale(0.65) scaleX(-1);
  }
}

@media only screen and (min-width: 320px) and (max-width: 799px) {
  #cloud1,
  #cloud2,
  #cloud3,
  #cloud4 {
    display: none;
  }

  #iphoneIpadButton {
    display: block;
    transform: scale(0.7);
  }

  main {
    margin-top: -10px;
  }

  #listOfPlayers {
    position: absolute;
    top: 20%;
    left: 15%;
    z-index: 100;
  }

  .deckQuestions {
    font-size: 20px;
  }

  .rotatedCardBrain {
    top: 30%;
    left: -40%;
    transform: scale(0.3) rotate(40deg);
  }

  #answerBtns {
    margin-top: 0;
    margin-right: 0;
  }
}

#content {
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  gap: 3em;
}
</style>