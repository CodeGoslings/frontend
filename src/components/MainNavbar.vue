<template>
    <nav class="bg-gray-800 text-white p-4">
        <div class="flex justify-between items-center">
            <router-link
                to="/"
                class="flex items-center text-xl font-semibold hover:underline hover:text-gray-200"
            >
                <FontAwesomeIcon class="me-2" icon="home"></FontAwesomeIcon>
                {{ $t('mainNavbar.title') }}
            </router-link>

            <LanguageSelector />
        </div>
    </nav>
</template>

<script>
import LanguageSelector from '@/components/LanguageSelector.vue'

export default {
    name: 'MainNavbar',
    components: {
        LanguageSelector,
    },
}
</script>
