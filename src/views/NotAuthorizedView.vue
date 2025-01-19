<template>
    <div class="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
        <h1 class="mb-4 text-4xl font-bold text-red-600">{{ $t('notAuthorized.title') }}</h1>
        <p class="mb-6 text-gray-700">{{ $t('notAuthorized.message') }}</p>
        <button
            @click="navigateToLogin"
            class="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {{ $t('notAuthorized.goToLogin') }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'NotAuthorizedView',
    methods: {
        navigateToLogin() {
            this.$router.push({ name: 'Login', query: { mode: 'login' } })
        },
    },
}
</script>
