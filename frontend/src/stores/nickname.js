import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNicknameStore = defineStore('nickname', () => {
  const nickname = ref("")
  function setNickname(newNick) {
    this.nickname = newNick;
  }

  return { nickname, setNickname }
})
