<template>
    <div class="flex space-x-4">
        <button
            v-for="locale in availableLocales"
            :key="locale"
            @click="changeLanguage(locale)"
            class="px-3 py-2 rounded-md font-semibold"
            :class="{
                'bg-blue-600 text-white': locale === currentLocale,
                'bg-gray-200': locale !== currentLocale,
            }"
        >
            {{ locale.toUpperCase() }}
        </button>
    </div>
</template>

<script>
import { setLocale } from '@/boot/i18n'

export default {
    name: 'LanguageSelector',
    data() {
        return {
            availableLocales: ['en', 'es', 'pl'],
        }
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale
        },
    },
    methods: {
        async changeLanguage(locale) {
            localStorage.setItem('locale', locale)
            setLocale(locale)
        },
    },
}
</script>
