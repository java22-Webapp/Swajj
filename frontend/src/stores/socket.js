import { defineStore } from "pinia";
import { io } from 'socket.io-client';

export const useSocketStore = defineStore( {
  id: 'socket',

  state: () => ({
    socket: null,
    connected: false,
  }),

  actions: {
    initializeSocket() {
      if (!this.socket) {
        this.socket = io('http://localhost:3000');
        console.log("SOCKET INITIALIZED");
        this.socket.on('connect', () => {
          this.connected = true;
        });

        this.socket.on('disconnect', () => {
          this.connected = false;
        });
      }
    },

    emit(event, payload) {
      if (this.socket) {
        this.socket.emit(event, payload);
      }
    },

    on(event, callback) {
      if (this.socket) {
        this.socket.on(event, callback);
      }
    },

    off(event, callback) {
      if (this.socket) {
        this.socket.off(event, callback);
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    },
  },
});