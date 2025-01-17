<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-col items-center justify-center flex-grow bg-gray-100">
            <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div class="flex justify-between mt-6">
                    <button class="px-4 py-2 text-white bg-blue-600 rounded-lg" @click="navigateToLogin">
                        {{ $t('landingPage.login') }}
                    </button>
                    <button class="px-4 py-2 text-white bg-green-600 rounded-lg" @click="navigateToRegister">
                        {{ $t('landingPage.register') }}
                    </button>
                </div>
                <div class="mt-4">
                    <button
                        class="w-full px-4 py-2 text-white bg-purple-600 rounded-lg"
                        @click="navigateToMap"
                    >
                        {{ $t('landingPage.map') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LandingPage',
    methods: {
        navigateToLogin() {
            this.$router.push({ name: 'Login', query: { mode: 'login' } })
        },
        navigateToRegister() {
            this.$router.push({ name: 'Register', query: { mode: 'register' } })
        },
        navigateToMap() {
            this.$router.push({ name: 'Map' })
        },
    },
}
</script>
