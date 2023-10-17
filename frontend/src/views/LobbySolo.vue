<script setup>
import { useNicknameStore} from "@/stores/nickname";
import SettingsPanel from "@/components/SettingsPanel.vue";

const nickNameStore = useNicknameStore();


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
        <SettingsPanel />
        <div>Nickname: {{ nickNameStore.nickname }} </div>
        <button class="button" id="playBtn">
          <router-link to="/Play" class="routerLinkBtnText">Play</router-link>
        </button>
        <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card">
      </section>
    </section>
  </main>


</template>


<style scoped>

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  z-index: 1;
}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: rotate(30deg);
}
.clouds {
  position: relative;

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
  top: 105%;
  transform: rotate(-5deg);

}
.cloud3 {
  top: -15%;
  left: 60%;
  transform: scaleX(-1);
}
.cloud4 {
  top: -10%;
  left: 5%;
  transform: scaleX(-1);
}

</style>