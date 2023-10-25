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
      timerInterval: 1000,
      userScore: 0,
      lives: settings.settings.kidsMode ? 3 : 0
    };

  },

  actions: {
    updateState() {
      const settings = useSettingsStore();
      this.remainingTime = settings.settings.time;
    },

    loseOneLife() {
      if (this.lives >= 0) {
        this.lives--;
      }
    },



    async nextRound() {
      const settings = useSettingsStore();

      if (this.currentRound < settings.settings.rounds) {
        this.currentRound++;
        this.remainingTime = settings.settings.time;
      } else {
        try {
          this.stopTimer();
          await router.push('/result');
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
    },

    getImagePath(userScore) {
      if (userScore >= 0 && userScore < 4 ) {
        return "src/assets/newFGradeNoBG.png";
      } else if (userScore >=4 && userScore < 6) {
        return "src/assets/newDGradeNoBG.png";
      } else if (userScore >=6 && userScore < 8) {
        return "src/assets/newCGradeNoBG.png";
      } else if (userScore === 8) {
        return "src/assets/newBGradeNoBG.png";
      } else if (userScore >=9 && userScore < 11) {
        return "src/assets/newAGradeNoBG.png";
      } else {
        return "src/assets/newFGradeNoBG.png";
      }
    }

  }
});
