<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6 text-center">
                {{ isLoginMode ? $t('auth.login') : $t('auth.register') }}
            </h1>

            <form @submit.prevent="handleSubmit" v-if="!userInfo">
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
                    <label for="email" class="block text-gray-700 font-medium mb-2">{{
                        $t('auth.email')
                    }}</label>
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

            <div v-if="userInfo" class="mt-4 text-center">
                <h2 class="text-xl font-bold">{{ $t('auth.userInfo') }}</h2>
                <p>
                    <strong>{{ $t('auth.name') }}:</strong> {{ userInfo.name }}
                </p>
                <p>
                    <strong>{{ $t('auth.email') }}:</strong> {{ userInfo.email }}
                </p>
                <button
                    @click="logout"
                    class="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                    {{ $t('auth.logout') }}
                </button>
            </div>

            <p class="text-center text-gray-600 mt-6" v-if="!userInfo">
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
import { useUserStore } from '@/stores/user'
import axios from '@/helpers/axios'

export default {
    data() {
        return {
            isLoginMode: true,
            formData: {
                name: '',
                email: '',
                password: '',
            },
            userInfo: null,
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
                    this.fetchUserInfo()
                } catch (error) {
                    console.error('Login failed', error)
                    alert(this.$t('auth.loginFailure'))
                }
            } else {
                try {
                    await this.userStore.register({
                        name: this.formData.name,
                        email: this.formData.email,
                        password: this.formData.password,
                    })
                    alert(`${this.$t('auth.registered')} ${this.formData.name}, ${this.formData.email}`)
                    this.toggleMode()
                } catch (error) {
                    console.error('Registration failed', error)
                    alert(this.$t('auth.registerFailure'))
                }
            }
        },

        async fetchUserInfo() {
            try {
                const response = await axios.get('/user', {
                    headers: {
                        Authorization: `Bearer ${this.userStore.token}`,
                    },
                })
                this.userInfo = response.data
            } catch (error) {
                console.error('Error fetching user info', error)
                alert(this.$t('auth.userInfoError'))
            }
        },

        logout() {
            this.userStore.logout()
            this.userInfo = null
            alert(this.$t('auth.loggedOut'))
            this.toggleMode()
        },
    },

    watch: {
        'userStore.token'(newToken) {
            if (newToken) {
                this.fetchUserInfo()
            } else {
                this.userInfo = null
            }
        },
    },

    mounted() {
        if (this.userStore.token) {
            this.fetchUserInfo()
        }
    },
}
</script>
