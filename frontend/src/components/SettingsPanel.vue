<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

const internalSettings = ref({
  kidsMode: true,
  english: true,
  rounds: 15,
  time: 15
});

const settings = computed({
  get: () => {
    return {
      kidsMode: internalSettings.value.kidsMode ? 1 : 2,
      english: internalSettings.value.english ? 1 : 2,
      rounds: internalSettings.value.rounds,
      time: internalSettings.value.time
    };
  }
});

onMounted(() => {
  const settingsStore = useSettingsStore();
  settingsStore.setSettings(settings.value);
  gameStore.remainingTime = settings.value.time;
});

watch(
  settings,
  async (newSettings) => {
    const settingsStore = useSettingsStore();
    settingsStore.setSettings(newSettings);
    gameStore.remainingTime = newSettings.time;
  },
  { deep: true }
);
</script>

<template>
  <section id="settingsPanel">
    <h2>Settings</h2>
    <div id="modeSettings">
      <span class="text">Easy</span>
      <label class="toggleButton">
        <input
          type="checkbox"
          id="modeToggle"
          class="toggleInput"
          v-model="internalSettings.kidsMode"
        />
        <span class="slider"></span>
      </label>
      <span class="text">Regular</span>
    </div>
    <div id="languageSettings">
      <span class="text">English</span>
      <label class="toggleButton">
        <input
          type="checkbox"
          id="languageToggle"
          class="toggleInput"
          v-model="internalSettings.english"
        />
        <span class="slider"></span>
      </label>
      <span class="text">Swedish</span>
    </div>
    <div id="roundSettings">
      <span class="text">Amount of rounds:</span>
      <div id="roundChoices">
        <div>
          <input
            type="radio"
            name="rounds"
            id="rounds10"
            value="10"
            v-model="internalSettings.rounds"
          />
          <label for="rounds10">10</label>
        </div>
        <div>
          <input
            type="radio"
            name="rounds"
            id="rounds15"
            value="15"
            v-model="internalSettings.rounds"
          />
          <label for="rounds15">15</label>
        </div>
        <div>
          <input
            type="radio"
            name="rounds"
            id="rounds20"
            value="20"
            v-model="internalSettings.rounds"
          />
          <label for="rounds20">20</label>
        </div>
      </div>
    </div>
    <div id="timeSettings">
      <span class="text">Seconds per question:</span>
      <div id="timeChoices">
        <div>
          <input type="radio" name="time" id="time10" value="10" v-model="internalSettings.time" />
          <label for="time10">10</label>
        </div>
        <div>
          <input type="radio" name="time" id="time15" value="15" v-model="internalSettings.time" />
          <label for="time15">15</label>
        </div>
        <div>
          <input type="radio" name="time" id="time20" value="20" v-model="internalSettings.time" />
          <label for="time20">20</label>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

#settingsPanel {
  background: var(--button-color);
  border: 1px solid black;
  border-radius: 4px;
  width: fit-content;
  padding: 1rem 2rem;
  font-weight: bold;
}

h2 {
  text-align: center;
}

.toggleInput {
  display: none;
}

.toggleButton {
  position: relative;
  width: 2rem;
  height: 1rem;
  display: inline-block;
  background: darkgray;
  border-radius: 0.5rem;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 1rem;
  height: 1rem;
  background-color: white;
  transition: 300ms;
  border-radius: 50%;
}

.toggleInput:checked + .slider {
  transform: translateX(1rem);
}

#modeSettings,
#languageSettings {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
}

.text {
  display: inline-block;
  text-align: center;
}

input[type='radio'] {
  display: none;
}

#timeSettings label,
#roundSettings label {
  display: inline-block;
  padding: 0.5rem;
  background: var(--background-color);
}

#roundChoices div,
#timeChoices div {
  display: inline-block;
  box-sizing: border-box;
}

#roundChoices div:nth-child(2),
#timeChoices div:nth-child(2) {
  margin: 1rem;
}

#roundChoices,
#timeChoices {
  display: inline-block;
}

#roundSettings,
#timeSettings {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

input[type='radio']:checked + label {
  border: 2px black solid;
}

input[type='radio'] + label {
  border: 2px solid transparent;
  cursor: pointer;
}

</style>
