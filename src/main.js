// import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import i18n, { setLocale } from './boot/i18n'

// Stuff connect with registering icons library globally
// eslint-disable-next-line no-unused-vars
import iconsLibrary from './boot/iconsLibrary'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'

const app = createApp(App)

setLocale('en').then(() => {
    app.use(createPinia())
    app.use(router)
    app.use(i18n)
    app.component('FontAwesomeIcon', FontAwesomeIcon)

    app.mount('#app')
})
