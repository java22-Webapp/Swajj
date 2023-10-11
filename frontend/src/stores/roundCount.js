import {defineStore} from "pinia";
import router from "@/router/index.js";



export const useGameStore = defineStore('game', {
  state: () => ({
    currentRound: 1,
    totalRounds: 10,
    remainingTime: 10,
    timerInterval: 1000,
    userScore: 0
  }),

  actions: {
   async nextRound() {
        if (this.currentRound < this.totalRounds) {
          this.currentRound++;
          this.remainingTime = 10;
          console.log("current round: ", this.currentRound)
          console.log("total rounds: ", this.totalRounds)
        }
        else if (this.currentRound === this.totalRounds) {
          try {
            await router.push("/result")
            console.log("pushing to /result")
          } catch (error) {
            if (error.name !== "NavigationDuplicated") {
              console.error(error)
            }
          }
      }
        else {
          this.stopTimer();
        }
      },
    

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null;
    }},

    startNextRoundTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval); // Clear any existing timer
      }

    },

  },
});


//this.timerInterval = setInterval(() => {
//  if (this.remainingTime > 0) {
//    this.remainingTime--;
//  } else {
//    this.stopTimer();
//    this.nextRound();
//  }
//}, 1000);