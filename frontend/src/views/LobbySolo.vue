<script setup>
import { useNicknameStore} from "@/stores/nickname";
import SettingsPanel from "@/components/SettingsPanel.vue";

const nickNameStore = useNicknameStore();

</script>

<template>
  <header><div id="logo_s">S</div>
  </header>
  <main>
    <section class="clouds">
      <img id="cloud1" src="../assets/gultNyttNy1.png" alt="Medium yellow cloud" />
      <img id="cloud2" src="../assets/gultNyttNy2.png" alt="Big yellow cloud" />
      <img id="cloud3" src="../assets/gultNyttNy3.png" alt="Bigger yellow cloud" />
      <img id="cloud4" src="../assets/gultNyttNy.png" alt="Small yellow cloud" />
    </section>
    <img class="rotatedCardBrain" src="../assets/cardBrainYellow.png" alt="Brain holding a card">
    <section id="settingsSection">
        <SettingsPanel id="settingsPanel" />
        <div id="nicknameField">Nickname: {{ nickNameStore.nickname }} </div>
        <button class="button" id="playBtn">
          <router-link to="/Play" class="routerLinkBtnText">Play</router-link>
        </button>
    </section>
  </main>
</template>

<style scoped>
#logo_s {
  background-color: var(--background-color);
  font-family: var(--logo-font);
  font-size: 6em;
  margin-left: 0.25em;
  color: var(--card-color);
  text-shadow: -0.5px -1px 0 #000,
  1px -1px 0 #000,
  -0.5px 1px 0 #000,
  1px 1px 0 #000;
}

* {
  box-sizing: border-box;
}

main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

#settingsPanel {
  z-index: 10;
  font-size: 24px;
}

#nicknameField {
  z-index: 10;
}

#cloud1, #cloud4, #cloud2, #cloud3 {
  position: absolute;
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

#settingsSection {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.rotatedCardBrain {
  position: absolute;
  top: 20em;
  left: -8em;
  transform: scale(0.7) rotate(40deg);
}

@media only screen and (min-width: 320px) and (max-width: 799px){
  #cloud1, #cloud2, #cloud3, #cloud4, .rotatedCardBrain{
    display: none;
  }

  main{
    margin-top: -10px;
  }

  #settingsPanel{
    transform: scale(0.7);
    width: max-content;
  }

  #nicknameField, #playBtn {
    margin-top: -10px;
    }
}

@media only screen and (min-width: 800px)  and (max-width: 1440px){
  #cloud4, #cloud2, #cloud1 {
    display: none;
  }

  main{
    margin-top: -10px;
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