import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import LobbySolo from '../views/LobbySolo.vue'
import GameStart from "@/views/PlayView.vue";
import ResultView from "@/views/ResultView.vue";
import InviteeView from "@/views/InviteeView.vue";

export const router = createRouter({
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
        },
        {
            path: '/result',
            name: 'Result',
            component: ResultView
        },
        {
            path: '/inviteeView',
            name: 'invitee',
            component: InviteeView
        }

    ]
})

export default router