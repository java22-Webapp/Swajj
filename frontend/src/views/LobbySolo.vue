<script setup>
import { useNicknameStore} from "@/stores/nickname";
import SettingsPanel from "@/components/SettingsPanel.vue";

const nickNameStore = useNicknameStore();


</script>

<template>
  <section>
    <SettingsPanel />
    <div>Nickname: {{ nickNameStore.nickname }} </div>
    <button class="menuButton" id="playBtn">
      <router-link to="/Play" class="routerLinkBtnText">Play</router-link>
    </button>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card">
  </section>


</template>


<style scoped>

section {
  margin-top: 8em;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4em;
}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: rotate(30deg);
}

</style>