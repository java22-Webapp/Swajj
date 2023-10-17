<script setup>
import { ref } from 'vue';
import SettingsPanel from '@/components/SettingsPanel.vue';
import { useNicknameStore } from '@/stores/nickname';

const gameLink = ref('');
const copied = ref(false);
const nickNameStore = useNicknameStore();
const copyButtonRef = ref(null);

async function copyLink(event) {
  try {
    const response = await fetch('http://localhost:3000/generate-game-link');
    const data = await response.json();
    gameLink.value = data.gameLink;
    navigator.clipboard
      .writeText(gameLink.value)
      .then(() => {
        copied.value = true;
        console.log('Copy link copied');
      }).catch((err) => {
      console.error('Failed to copy link:', err);
      copied.value = false;
    });

    const tooltip = document.querySelector('.tooltip');
    const top = event.clientY + 10;
    const left = event.clientX + 10;
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.display = 'block';

    const updateTooltipPosition = (e) => {
      const tooltip = document.querySelector('.tooltip');
      const top = e.clientY + 10;
      const left = e.clientX + 10;
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    document.addEventListener('mousemove', updateTooltipPosition);

    setTimeout(() => {
      tooltip.style.display = 'none';
      document.removeEventListener('mousemove', updateTooltipPosition);
    }, 1000);

  } catch (error) {
    console.error('Error generating game link: ', error);
    copied.value = false;
  }
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
        <SettingsPanel />
        <div>Nickname: {{ nickNameStore.nickname }}</div>
        <button class="button" id="playBtn">
          <router-link to="/Play" class="routerLinkBtnText">Play</router-link>
        </button>
        <button ref="copyButtonRef" @click="copyLink" class="button" id="copyLinkBtn">
          COPY LINK <span class="tooltip">Link copied</span>
        </button>
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
main {
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
}

#copyLinkBtn {
  cursor: pointer;
  position: relative;
}

.tooltip {
  display: none;
  width: fit-content;
  background-color: #333;
  color: #fff;
  font-size: 18px;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: fixed;
  z-index: 1;
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