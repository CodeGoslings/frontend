import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPageView.vue'
import LoginRegisterPage from '@/views/RegisterView.vue'
import MapView from '../views/MapView.vue'
import { useUserStore } from '@/stores/user'

const routes = [
    {
        path: '/',
        component: LandingPage,
        name: 'Home',
        meta: { title: 'HACS - Home' },
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginRegisterPage,
        meta: { title: 'Login' },
    },
    {
        path: '/register',
        name: 'Register',
        component: LoginRegisterPage,
        meta: { title: 'Register' },
    },
    {
        path: '/map',
        name: 'Map',
        component: MapView,
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: () => import('@/views/AdminPanelMockView.vue'),
        meta: { title: 'Admin Panel', requiresAuth: true, roles: ['admin'] },
    },
    {
        path: '/not-authorized',
        name: 'NotAuthorized',
        component: () => import('@/views/NotAuthorizedView.vue'),
        meta: { title: 'Not Authorized' },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const availableLanguages = ['en', 'es', 'pl']
    const defaultLang = 'en'
    const storedLang = localStorage.getItem('locale') || defaultLang
    if (!availableLanguages.includes(storedLang)) {
        localStorage.setItem('locale', defaultLang)
    }

    import('@/boot/i18n').then(({ setLocale }) => {
        setLocale(storedLang)
    })

    const userStore = useUserStore()

    if (to.meta.requiresAuth && to.meta.roles) {
        if (!to.meta.roles.some((role) => userStore.hasRole(role))) {
            return next({ name: 'NotAuthorized' })
        }
    }

    next()
})

export default router
