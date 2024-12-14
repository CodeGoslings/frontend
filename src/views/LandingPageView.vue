<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex flex-col justify-center items-center bg-gray-100 flex-grow">
            <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div class="flex justify-between mt-6">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="navigateToLogin">
                        {{ $t('landingPage.login') }}
                    </button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg" @click="navigateToRegister">
                        {{ $t('landingPage.register') }}
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
            this.$router.push({ name: 'Login' })
        },
        navigateToRegister() {
            this.$router.push({ name: 'Register' })
        },
    },
}
</script>
