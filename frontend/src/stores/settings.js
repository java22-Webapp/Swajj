import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    kidsMode: 1,
    english: 1,
    rounds: 15,
    time: 15,
    lives: 1
  });

  function setSettings(newSettings) {
    this.settings = { ...newSettings };

    if (this.settings.kidsMode) {
      this.settings.lives = 3;
    } else {
      this.settings.lives = 0;
    }
  }
  return { settings, setSettings };
});
