<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center">
                {{ isLoginMode ? $t('auth.login') : $t('auth.register') }}
            </h1>

            <form @submit.prevent="handleSubmit">
                <div v-if="!isLoginMode" class="mb-4">
                    <label for="name" class="block text-gray-700 font-medium mb-2">{{
                        $t('auth.name')
                    }}</label>
                    <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        :placeholder="$t('auth.enterName')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <div class="mb-4">
                    <label for="email" class="block text-gray-700 font-medium mb-2">{{ $t('email') }}</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        :placeholder="$t('auth.enterEmail')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <div class="mb-6">
                    <label for="password" class="block text-gray-700 font-medium mb-2">{{
                        $t('auth.password')
                    }}</label>
                    <input
                        type="password"
                        id="password"
                        v-model="formData.password"
                        :placeholder="$t('auth.enterPassword')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                    {{ isLoginMode ? $t('auth.login') : $t('auth.register') }}
                </button>
            </form>

            <p class="text-center text-gray-600 mt-6">
                {{ isLoginMode ? $t('auth.dontHaveAccount') : $t('auth.alreadyHaveAccount') }}
                <button
                    @click="toggleMode"
                    class="text-blue-500 font-medium hover:underline focus:outline-none"
                >
                    {{ isLoginMode ? $t('auth.register') : $t('auth.login') }}
                </button>
            </p>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
    data() {
        return {
            isLoginMode: true,
            formData: {
                name: '',
                email: '',
                password: '',
            },
        }
    },
    computed: {
        userStore() {
            return useUserStore()
        },
    },
    methods: {
        toggleMode() {
            this.isLoginMode = !this.isLoginMode
            this.formData = { name: '', email: '', password: '' }
        },
        async handleSubmit() {
            if (this.isLoginMode) {
                try {
                    await this.userStore.login({
                        email: this.formData.email,
                        password: this.formData.password,
                    })
                    alert(this.$t('auth.loginSuccess'))
                } catch (error) {
                    console.error('Login failed', error)
                    alert(this.$t('auth.loginFailure'))
                }
            } else {
                alert(`${this.$t('auth.registered')} ${this.formData.name}, ${this.formData.email}`)
                this.toggleMode()
            }
        },
    },
}
</script>
