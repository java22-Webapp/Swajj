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
          if (router.currentRoute.value.name === "Play") {
            await router.push('/result');
          }
          else await router.push("/resultMultiplayer");
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

    getImagePath(userScore, totalRounds) {
      const userScoreResult = (userScore / totalRounds)  * 100;

        if (userScoreResult >= 90) {
            return "src/assets/newAGradeNoBG.png";
        } else if (userScoreResult >= 75 ) {
            return "src/assets/newBGradeNoBG.png";
        } else if (userScoreResult >= 55) {
            return "src/assets/newCGradeNoBG.png";
        } else if (userScoreResult >= 45) {
            return "src/assets/newDGradeNoBG.png";
        } else {
            return "src/assets/newFGradeNoBG.png";
        }
    }
  }
});
