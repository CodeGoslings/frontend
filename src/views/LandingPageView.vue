<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-col items-center justify-center flex-grow bg-gray-100">
            <!-- Box for Login and Register -->
            <div class="w-full max-w-md p-8 mb-6 bg-white rounded-lg shadow-lg">
                <h2 class="mb-4 text-xl font-semibold text-center">{{ $t('landingPage.welcome') }}</h2>
                <div class="flex justify-between mt-4">
                    <button
                        class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        @click="navigateToLogin"
                    >
                        {{ $t('landingPage.login') }}
                    </button>
                    <button
                        class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                        @click="navigateToRegister"
                    >
                        {{ $t('landingPage.register') }}
                    </button>
                </div>
            </div>

            <!-- Box for Map and Admin -->
            <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 class="mb-4 text-xl font-semibold text-center">{{ $t('landingPage.actions') }}</h2>
<!--                <div class="flex justify-between mt-4">-->
<!--                    <button-->
<!--                        class="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"-->
<!--                        @click="navigateToMap"-->
<!--                    >-->
<!--                        {{ $t('landingPage.map') }}-->
<!--                    </button>-->
<!--                    <button-->
<!--                        class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"-->
<!--                        @click="navigateToAdmin"-->
<!--                    >-->
<!--                        {{ $t('landingPage.adminPanel') }}-->
<!--                    </button>-->
<!--                </div>-->
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
        navigateToAdmin() {
            this.$router.push({ name: 'AdminPanel' })
        },
    },
}
</script>
