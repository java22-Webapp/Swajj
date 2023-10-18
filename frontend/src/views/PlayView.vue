<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import questionCardStack from '../assets/questionCardStack.png';
import questionCardStackFlipped from '../assets/questionCardStackFlipped.png';
import { useGameStore } from '@/stores/game';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const questions = ref('');
const answers = ref([]);
const isCorrect = ref([]);
const answerID = ref([]);
const nextRound = useGameStore();
const userScoreHolder = useGameStore();
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
  clearInterval(timerInterval.value);
  buttonDisabled.value = true;

  e.target.classList.add("selected-answer");

  selectedAnswerIndex.value = index;
  correctAnswerIndex.value = isCorrect.value.findIndex((correctValue) => correctValue === 1);

  if (isCorrect.value[index] === 1) {
    userScoreHolder.userScore++;
    e.target.classList.add("correct-answer")

  } else {
    e.target.classList.add("incorrect-answer")
    showCorrectAnswer();

  }

  selectedAnswerIndex.value = null;
  correctAnswerIndex.value = -1;
  setTimeout(()=> {
    resetBtnClasses();
    nextRound.nextRound();
    fetchQuestionAndAnswers();
    buttonDisabled.value = false;
    startTimer();
  }, 3000)
}

function resetBtnClasses() {
  const buttons = document.getElementsByClassName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("correct-answer")
    buttons[i].classList.remove("incorrect-answer")
    buttons[i].classList.remove("selected-answer")
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
  <section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
  </section>
  </section>
  </main>
</template>

<style scoped>
.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: rotate(30deg);
  z-index: 0;
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
  padding: 1em;
  margin: 0 auto;
  font-family: var(--timer-round-font);
  z-index: 1;
  background: #FFDCF4;
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
.incorrect-answer{
  border: 0.25em solid red;
}
.selected-answer{
  background-color: #91B2B3;
}
.clouds {
  position: relative;
  z-index: 0;

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
  top: 68%;
  transform: rotate(-5deg);

}
.cloud3 {
  top: -15%;
  left: 60%;
  transform: scaleX(-1);
}
.cloud4 {
  top: -9%;
  left: 5%;
  transform: scaleX(-1);
}
</style>

