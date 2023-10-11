<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import questionCardStack from '../assets/questionCardStack.png';
import questionCardStackFlipped from '../assets/questionCardStackFlipped.png';
import { useGameStore } from '@/stores/roundCount';

const questions = ref('');
const answers = ref([]);
const isCorrect = ref([]);
const nextRound = useGameStore();
const userScoreHolder = useGameStore();
const timerInterval = ref(null);
let selectedAnswerIndex = ref(null);
let correctAnswerIndex = ref(-1);

const imgSrc = ref(questionCardStack);
const isFlipped = computed(() => imgSrc.value === questionCardStackFlipped);

const fetchQuestionAndAnswers = async () => {
  try {
    const response = await fetch('http://localhost:3000/get-question');

    if (!response.ok) {
      throw new Error(`HTTP ERROR; ${response.status}`);
    }
    const data = await response.json();
    questions.value = data.db_question;
    answers.value = data.db_answers;
    isCorrect.value = data.db_isCorrect;

    imgSrc.value = questionCardStackFlipped;

  } catch (error) {
    console.log('ERROR fetching questions in PlayView', error);
  }
};

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    if (useGameStore().remainingTime > 0) {
      useGameStore().remainingTime--;
    } else {
      useGameStore().nextRound();
      fetchQuestionAndAnswers();
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

function userAnswer(index) {
  selectedAnswerIndex.value = index;
  correctAnswerIndex.value = isCorrect.value.findIndex((correctValue) => correctValue === 1);

  if (isCorrect.value[index] === 1) {
    userScoreHolder.userScore++;
    console.log('SCORE: ', userScoreHolder.userScore);
    // TODO Add Green border on the user answer choice btn
  } else {
    console.log('Wrong. Correct was index: ', isCorrect.value[index]);
    console.log('SCORE: ', userScoreHolder.userScore);
    // TODO Add Red border on the user answer choice btn
    // TODO Add green border on the correct answer btn
  }

  selectedAnswerIndex.value = null;
  correctAnswerIndex.value = -1;
  nextRound.nextRound();
  fetchQuestionAndAnswers();
}
</script>

<template>
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
        class="menuButton"
        v-for="(answers, index) in answers"
        id="btnAnswerA"
        :key="index"
        @click="userAnswer(index)"
        :class="{ 'correct-answer': correctAnswerIndex.value === index }"
      >
        {{ answers }}
      </button>
    </div>
  </section>

  <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card" />
</template>

<style scoped>
.rotatedCardBrain {
  position: absolute;
  top: 28em;
  left: -8em;
  transform: rotate(30deg);
}

.deckQuestions {
  position: absolute;
  top: 60%;
  left: 58%;
  transform: translate(-70%, -50%);
  z-index: 1;
  width: fit-content;
  font-size: 24px;
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
  width: 100%;
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
  align-items: center;
  margin-top: 1em;
}

#answerBtns button {
  flex-basis: calc(50% - 10px);
  font-size: 18px;
  width: 6em;
  height: 4em;
  padding: 2px;

  .correct-answer {
    border: 2px solid green;
  }
}

</style>