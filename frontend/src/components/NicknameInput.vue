<script setup>
import { useNicknameStore } from "@/stores/nickname";

const nickNameStore = useNicknameStore();


function updateNickname(newNick){
  nickNameStore.setNickname(newNick);
}

</script>

<template>

  <input type="text" :value="nickNameStore.nickname" class="nicknameInput" placeholder="Nickname" @change="e => updateNickname(e.target.value)">

</template>

<style scoped>

.nicknameInput {
  width: 18em;
}

</style>