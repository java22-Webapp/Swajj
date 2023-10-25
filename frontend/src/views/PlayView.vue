<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import questionCardStack from '../assets/questionCardStack.png';
import questionCardStackFlipped from '../assets/questionCardStackFlipped.png';
import { useGameStore } from '@/stores/game';
import { useSettingsStore } from '@/stores/settings';
import fullHeart from '../assets/fullHeart.png';
import emptyHeart from '../assets/emptyHeart.png';

const settingsStore = useSettingsStore();
const questions = ref('');
const answers = ref([]);
const isCorrect = ref([]);
const answerID = ref([]);
const nextRound = useGameStore();
const userScoreHolder = useGameStore();
const gameLives = useGameStore();
const timerInterval = ref(null);
let selectedAnswerIndex = ref(null);
let correctAnswerIndex = ref(-1);
const buttonDisabled = ref(false);

const answersCombo = computed(() => {
  const result = [];
  for (let i = 0; i < answers.value.length; i++) {
    result.push({answer_text: answers.value[i], id: answerID.value[i]});
  }
  return result;
})

const imgSrc = ref(questionCardStack);
const isFlipped = computed(() => imgSrc.value === questionCardStackFlipped);

const fetchQuestionAndAnswers = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/get-question?kidsMode=${settingsStore.settings.kidsMode}&english=${settingsStore.settings.english}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ERROR; ${response.status}`);
    }
    const data = await response.json();
    questions.value = data.db_question;
    answers.value = data.db_answers;
    isCorrect.value = data.db_isCorrect;
    answerID.value = data.db_answerId;

    imgSrc.value = questionCardStackFlipped;
  } catch (error) {
    console.log('ERROR fetching questions in PlayView', error);
  }
};

const startTimer = () => {
  useGameStore().updateState();
  timerInterval.value = setInterval(() => {
    if (useGameStore().remainingTime > 0) {
      useGameStore().remainingTime--;
    } else {
      showCorrectAnswer();
      clearInterval(timerInterval.value);
      setTimeout(()=> {
        resetBtnClasses();
        useGameStore().nextRound();
        fetchQuestionAndAnswers();
        startTimer();
      }, 2000);
    }
  }, 1000);
};

onMounted(() => {
  fetchQuestionAndAnswers();
  startTimer();
});

onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
});

function userAnswer(e, index) {
  if (buttonDisabled.value) return;

  buttonDisabled.value = true;
  e.target.classList.add("selected-answer");

  selectedAnswerIndex.value = index;

  correctAnswerIndex.value = isCorrect.value.findIndex((correctValue) => correctValue === 1);
  let goToNextRound = false;

  if (isCorrect.value[index] === 1) {
    clearInterval(timerInterval.value);
    userScoreHolder.userScore++;
    e.target.classList.add("correct-answer")
    goToNextRound = true;
  } else {
    e.target.classList.add("incorrect-answer")
    if (settingsStore.settings.kidsMode === 2) {
      useGameStore().loseOneLife();
      console.log("EXTRA LIVES LEFT::: ", useGameStore().lives)

      if (useGameStore().lives < 0) {
        showCorrectAnswer();
        goToNextRound = true;
        e.target.classList.add("selected-answer");

      } else {
        e.target.classList.add("incorrect-answer")
        e.target.disabled = true;

      }
    } else {
      showCorrectAnswer();
      goToNextRound = true;
    }
  }

  selectedAnswerIndex.value = null;
  correctAnswerIndex.value = -1;

  if (goToNextRound) {
    setTimeout(() => {
      resetBtnClasses();
      nextRound.nextRound();
      fetchQuestionAndAnswers();
      buttonDisabled.value = false;
      startTimer();
    }, 3000)
  } else {
    buttonDisabled.value = false;
  }
}
function resetBtnClasses() {
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("correct-answer")
    buttons[i].classList.remove("incorrect-answer")
    buttons[i].classList.remove("selected-answer")
    clearInterval(timerInterval.value);
  }
}

function showCorrectAnswer(){
  const indexOfCorrectAnswer = isCorrect.value.findIndex((correctValue) => correctValue === 1);

  const buttons = document.getElementsByClassName("button");
  [...buttons].forEach((btn)=> {
    if (btn.dataset.key === indexOfCorrectAnswer + "") {
      btn.classList.add("correct-answer")
    }
  })
}

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

    <section>
      <div class="showRound">
        <RoundCounter />
      </div>
    </section>
    <section class="QNA">
      <div id="deckDiv">
        <div class="deckQuestions">{{ questions }}</div>
        <img id="idleDeck" :src="imgSrc" :class="{ flipped: isFlipped }" alt="Card deck" />
      </div>

      <div class="hearts" v-if="settingsStore.settings.kidsMode === 2">
      <img v-for="l in settingsStore.settings.kidsMode ? 3 : 0"
           :src="l <= gameLives.lives ? fullHeart : emptyHeart"
           :alt="l <= gameLives.lives ? 'Full Heart' : 'Empty Heart'"
           :key="l"
      />
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
.incorrect-answer{
  border: 0.25em solid red;
}
.selected-answer{
  background-color: #91B2B3;
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

@media only screen and (min-width: 800px)  and (max-width: 1000px){
  #cloud4, #cloud2 {
    display: none;
  }

  main{
    margin-top: -10px;
  }
  #cloud1 {
    top: 10%;
    left: -5%;
    transform: scale(0.5);
  }

  #cloud3 {
    left: 60%;
    transform: scale(0.5) scaleX(-1);
  }

  .deckQuestions{
    font-size: 20px;
  }

  .rotatedCardBrain {
    transform: scale(0.5) rotate(40deg);
  }
}

@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4{
    display: none;
  }
  main{
    margin-top: 40px;
  }
  .deckQuestions{
    font-size: 16px;
  }
  .rotatedCardBrain {
    top: 30%;
    left: -40%;
    transform: scale(0.3) rotate(40deg);
  }
}

</style>

