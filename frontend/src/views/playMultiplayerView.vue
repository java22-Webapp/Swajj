<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onMounted, onBeforeUnmount, computed, onUnmounted } from "vue";
import questionCardStack from '../assets/questionCardStack.png';
import questionCardStackFlipped from '../assets/questionCardStackFlipped.png';
import { useGameStore } from '@/stores/game';
import ListOfPlayers from '@/components/ListOfPlayers.vue';
import { useRouter } from 'vue-router';
import { useSocketStore } from "@/stores/socket";
const questions = ref('');
const answers = ref([]);
const isCorrect = ref([]);
const answerID = ref([]);
const userScoreHolder = useGameStore();
const timerInterval = ref(null);
let selectedAnswerIndex = ref(null);
const buttonDisabled = ref(false);
const router = useRouter();
let roomId = ref('');
const socket = useSocketStore();


const answersCombo = computed(() => {
  const result = [];
  for (let i = 0; i < answers.value.length; i++) {
    result.push({ answer_text: answers.value[i], id: answerID.value[i] });
  }
  return result;
});

const imgSrc = ref(questionCardStack);
const isFlipped = computed(() => imgSrc.value === questionCardStackFlipped);


function resetGameState(){
  resetBtnClasses();
  clearInterval(timerInterval.value);
  useGameStore().nextRound();
  getNewQuestion();
}

const startTimer = () => {
  clearInterval(timerInterval.value);
  useGameStore().updateState();
  timerInterval.value = setInterval(() => {
    if (useGameStore().remainingTime > 0) {
      useGameStore().remainingTime--;
    } else {
      showCorrectAnswer();
      clearInterval(timerInterval.value);
      setTimeout(resetGameState, 2000);
    }
  },1000)
};


onMounted(() => {
  roomId.value = router.currentRoute.value.params.roomId;
  console.log("Component mounted")
  socket.emit('joinRoom', roomId.value)
  getNewQuestion();
  startTimer();

  socket.on('new-question', (data) => {
    console.log("new-question event received");
    questions.value = data.question;
    answers.value = data.answers;
    isCorrect.value = data.isCorrect;
    answerID.value = data.answerId;
    imgSrc.value = questionCardStackFlipped;
  })

  socket.on('round-completed', () => {
    resetGameState();
    startTimer();
  })
});

onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
  socket.off('new-question', roomId);
  socket.off('round-completed', roomId);
  console.log('Component about to be destroyed');
});

onUnmounted(() => {
  if (socket)
    socket.disconnect();
})


function getNewQuestion() {
  console.log("GETTING NEW QUESTION")
  socket.emit('requestNewQuestion', roomId);
}

function userAnswer(e, index) {
  console.log(">>> CALLING userAnswer <<<")

  selectedAnswerIndex.value = index;

  if (buttonDisabled.value) return;
  buttonDisabled.value = true;

  socket.emit('user-selected-answer', {
    roomId: roomId.value,
    answerIndex: index
  });
  e.target.classList.add("selected-answer");
}


socket.on('answer-result', (data) => {
  const { correct, isCorrectArray } = data;
  const correctAnswerIndex = isCorrectArray.findIndex(value => value === 1);
  const correctButtonSelector = `#btnAnswer-${answerID.value[correctAnswerIndex]}`;
  const correctButton = document.querySelector(correctButtonSelector);

  if (correctButton) {
    clearInterval(timerInterval.value);
    if (correct) {
      userScoreHolder.userScore++;
      correctButton.classList.add('correct-answer')
    } else {
      showCorrectAnswer();
      const selectedButton =
        document.querySelector(`#btnAnswer-${answerID.value[selectedAnswerIndex.value]}`);
      if (selectedButton)
        selectedButton.classList.add('incorrect-answer');
    }
  } else {
    console.log("Could not find the button with the provided selector.")
  }
  selectedAnswerIndex.value = null;
});


function resetBtnClasses() {
  console.log("RESETTING BUTTONS")
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

const showListOfPlayers = ref(false)

const listOfPlayers = () => {
  showListOfPlayers.value = !showListOfPlayers.value;
};

const shouldShowListOfPlayers = computed(() => {
  return showListOfPlayers.value || !isMobile.value;
});

const isMobile = ref(window.innerWidth <= 1000);
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 1000;
});

</script>

<template>
  <header><div id="logo_s">S</div>
    <button class="button" id="iphoneIpadButton" @click="listOfPlayers">Players</button>
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
      <section id="content">
        <ListOfPlayers id="listOfPlayers" v-if="shouldShowListOfPlayers" />
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
      </section>
      <section>
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
#cloud1,
#cloud4,
#cloud2,
#cloud3 {
  position: absolute;
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
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
  top: 15em;
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
  width: 50%;
  height: 100%;
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
  background: #ffdcf4;
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
  gap: 0.5em;
  align-items: center;
  margin-top: 1em;
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
  margin-right: -15em;
  min-width: 318px;
  min-height: 450px;
  z-index: 10;
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

@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4, .rotatedCardBrain {
    display: none;
  }

  #iphoneIpadButton{
    display: block;
    transform: scale(.7);
  }

  main {
    margin-top: -10px;
  }

  #listOfPlayers {
    position: absolute;
    top: 20%;
    left: 5%;
    z-index: 100;
  }

  .deckQuestions {
    font-size: 20px;

  }

}

@media only screen and (min-width: 800px)  and (max-width: 1000px){
  #cloud4, #cloud2, #cloud1{
}

    display: none;
  }
  #iphoneIpadButton{
    display: block;
    left: -5%;
  }
  #listOfPlayers {
    position: absolute;
    top: 20%;
    left: 30%;
    z-index: 100;
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