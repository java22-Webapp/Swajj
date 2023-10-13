import { defineStore } from 'pinia';
import router from '@/router/index.js';
import { useSettingsStore } from '@/stores/settings';

export const useGameStore = defineStore('game', {
  state: () => {
    const settings = useSettingsStore();
    return {
      currentRound: 1,
      totalRounds: settings.settings.rounds,
      remainingTime: settings.settings.time,
      timerInterval: null,
      userScore: 0
    };
  },

  actions: {
    async nextRound() {
      const settings = useSettingsStore();

      if (this.currentRound < settings.settings.rounds) {
        this.currentRound++;
        this.remainingTime = settings.settings.time;
      } else {
        try {
          this.stopTimer();
          await router.push('/result');
          console.log('pushing to /result');
        } catch (error) {
          if (error.name !== 'NavigationDuplicated') {
            console.error(error);
          }
        }
      }
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    startNextRoundTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }
  }
});
