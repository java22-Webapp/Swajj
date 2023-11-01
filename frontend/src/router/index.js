import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import LobbySolo from '../views/LobbySolo.vue'
import GameStart from "@/views/PlayView.vue";
import ResultView from "@/views/ResultView.vue";
import InviteeView from "@/views/InviteeView.vue";
import playMultiplayer from "@/views/playMultiplayerView.vue";
import ResultMultiplayerView from "@/views/ResultMultiplayerView.vue"
import LobbyMultiplayer from "@/views/LobbyMultiplayer.vue";

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
            path: '/multiplayer/:roomId',
            name: 'MultiplayerTwo',
            component: LobbyMultiplayer
        },
        {
            path: '/play',
            name: 'Play',
            component: GameStart
        },
        {
            path: '/playMultiplayer/:roomId',
            name: 'PlayMultiplayer',
            component: playMultiplayer
        },
        {
            path: '/result',
            name: 'Result',
            component: ResultView
        },
        {
            path: '/join',
            name: 'Invitee',
            component: InviteeView
        },
        {
            path: '/join/:roomId',
            name: 'InviteeTwo',
            component: InviteeView
        },
        {
            path: '/resultMultiplayer/:roomId',
            name: 'ResultMultiplayer',
            component: ResultMultiplayerView
        }

    ]
})

export default router