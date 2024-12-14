import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPageView.vue'
import LoginRegisterPage from '@/views/RegisterView.vue'

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

    next()
})

export default router
