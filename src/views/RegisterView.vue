<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 class="mb-6 text-2xl font-bold text-center">
                {{ isLoginMode ? $t('auth.login') : $t('auth.register') }}
            </h1>

            <form @submit.prevent="handleSubmit" v-if="!userInfo">
                <div v-if="!isLoginMode" class="mb-4">
                    <label for="name" class="block mb-2 font-medium text-gray-700">{{
                        $t('auth.name')
                    }}</label>
                    <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        :placeholder="$t('auth.enterName')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                        @blur="validateField('name')"
                    />
                    <p v-if="validationErrors.name" class="text-sm text-red-500">
                        {{ validationErrors.name }}
                    </p>
                </div>

                <div class="mb-4">
                    <label for="email" class="block mb-2 font-medium text-gray-700">{{
                        $t('auth.email')
                    }}</label>
                    <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        :placeholder="$t('auth.enterEmail')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                        @blur="validateField('email')"
                    />
                    <p v-if="validationErrors.email" class="text-sm text-red-500">
                        {{ validationErrors.email }}
                    </p>
                </div>

                <div class="mb-6">
                    <label for="password" class="block mb-2 font-medium text-gray-700">{{
                        $t('auth.password')
                    }}</label>
                    <input
                        type="password"
                        id="password"
                        v-model="formData.password"
                        :placeholder="$t('auth.enterPassword')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                        @blur="validateField('password')"
                    />
                    <p v-if="validationErrors.password" class="text-sm text-red-500">
                        {{ validationErrors.password }}
                    </p>
                </div>

                <button
                    type="submit"
                    class="w-full px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
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
                    class="px-4 py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                >
                    {{ $t('auth.logout') }}
                </button>
            </div>

            <p class="mt-6 text-center text-gray-600" v-if="!userInfo">
                {{ isLoginMode ? $t('auth.dontHaveAccount') : $t('auth.alreadyHaveAccount') }}
                <button
                    @click="toggleMode"
                    class="font-medium text-blue-500 hover:underline focus:outline-none"
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
            validationErrors: {},
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

        validateField(field) {
            const value = this.formData[field]
            this.validationErrors[field] = ''

            if (field === 'name' && !this.isLoginMode) {
                if (!value) {
                    this.validationErrors.name = this.$t('auth.errors.nameRequired')
                }
            } else if (field === 'email') {
                if (!value) {
                    this.validationErrors.email = this.$t('auth.errors.emailRequired')
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    this.validationErrors.email = this.$t('auth.errors.invalidEmail')
                }
            } else if (field === 'password') {
                if (!value) {
                    this.validationErrors.password = this.$t('auth.errors.passwordRequired')
                } else if (value.length < 6) {
                    this.validationErrors.password = this.$t('auth.errors.passwordTooShort')
                }
            }
        },

        async handleSubmit() {
            if (this.isLoginMode) {
                const requiredFields = ['email', 'password']
                requiredFields.forEach(this.validateField)
                if (Object.values(this.validationErrors).some((error) => error)) {
                    return
                }

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
                const requiredFields = ['name', 'email', 'password']
                requiredFields.forEach(this.validateField)
                if (Object.values(this.validationErrors).some((error) => error)) {
                    return
                }

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

        updateMode() {
            this.isLoginMode = this.$route.query.mode === 'login'
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

        this.updateMode()
    },
}
</script>
