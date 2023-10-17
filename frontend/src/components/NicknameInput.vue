<script setup>
import { useNicknameStore } from "@/stores/nickname";

const nickNameStore = useNicknameStore();


function updateNickname(newNick){
  nickNameStore.setNickname(newNick);
}

</script>

<template>

  <input type="text" :value="nickNameStore.nickname" class="nicknameInput" placeholder="Enter nickname" spellcheck="false" @change="e => updateNickname(e.target.value)">

</template>

<style scoped>

.nicknameInput {
  width: 20em;
  height: 3em;
  border-radius: 0.25em;
  font-size: 24px;
  line-height: 1;
  padding: calc(1.5em - 24px / 2) 1em;
  box-sizing: border-box;
  text-align: center;
  font-family: var(--button-font);
}

.nicknameInput:focus::placeholder {
  color: transparent;
}

input::placeholder {
  font-size: 24px;
  font-family: var(--button-font);
  text-align: center;
}


</style>