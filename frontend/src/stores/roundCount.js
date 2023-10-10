import {defineStore} from "pinia";


export const useGameStore = defineStore('game', {
  state: () => ({
    currentRound: 1,
    totalRounds: 10,
    remainingTime: 10,
    timerInterval: 1000,
  }),

  actions: {
    nextRound(){
      if (this.currentRound < this.totalRounds) {
        this.currentRound++;
        this.remainingTime = 10;
        console.log("round ++")
      }
    },

    startNextRoundTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval); // Clear any existing timer
      }

      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          console.log("remaining time --");
        } else {
          this.nextRound();
        }
      }, 1000);
    },

  },
});