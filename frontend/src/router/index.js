import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import LobbySolo from '../views/LobbySolo.vue'
import GameStart from "@/views/PlayView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: Home,
        },
        {
            path: '/solo',
            name: 'Solo',
            component: LobbySolo,
        },
        {
            path: '/multiplayer',
            name: 'Multiplayer',
            component: () => import('../views/LobbyMultiplayer.vue')
        },
        {
            path: '/play',
            name: 'Play',
            component: GameStart
        }
    ]
})

export default router