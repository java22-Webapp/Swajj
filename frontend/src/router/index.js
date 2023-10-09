import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Solo from '../views/LobbySolo.vue'


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
            component: Solo,
        },
        {
            path: '/multiplayer',
            name: 'Multiplayer',
            component: () => import('../views/LobbyMultiplayer.vue')
        }
    ]
})

export default router