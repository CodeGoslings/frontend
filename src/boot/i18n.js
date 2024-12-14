import { createI18n } from 'vue-i18n'

const loadLocaleMessages = async (locale) => {
    const messages = await import(`./locales/${locale}.json`)
    return messages.default
}

const i18n = createI18n({
    locale: localStorage.getItem('locale') || 'en',
    fallbackLocale: 'en',
    messages: {},
})

export const setLocale = async (locale) => {
    const messages = await loadLocaleMessages(locale)
    i18n.global.setLocaleMessage(locale, messages)
    i18n.global.locale = locale
}

export default i18n
