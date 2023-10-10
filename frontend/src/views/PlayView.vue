<script setup>
import RoundCounter from '@/components/RoundCounter.vue';
import { ref, onMounted } from 'vue';

const questions = ref('');
const answers = ref([]);

const fetchQuestionAndAnswers = async () => {
  try {
    const response = await fetch('http://localhost:3000/get-question');

    if (!response.ok) {
      throw new Error(`HTTP ERROR; ${response.status}`)
    }
    const data = await response.json();
    questions.value = data.db_question;
    answers.value = data.db_answers;
    console.log("FETCHED DATA: ", data)
  } catch (error) {
    console.log('ERROR fetching questions in PlayView', error);
  }
};

onMounted(fetchQuestionAndAnswers);
</script>

<template>
  <section>
    <div class="showRound">
      <RoundCounter />
    </div>
  </section>
  <section class="QNA">
    <div>{{ questions }}</div>
    <div id="answerBtns">
      <button class="menuButton" id="btnAnswerA"> {{ answers[0] }}</button>
      <button class="menuButton" id="btnAnswerB"> {{ answers[1] }}</button>
      <button class="menuButton" id="btnAnswerC"> {{ answers[2] }}</button>
      <button class="menuButton" id="btnAnswerD"> {{ answers[3] }}</button>
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



}
</style>