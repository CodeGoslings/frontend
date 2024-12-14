import axiosInstance from '@/helpers/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    // State is your data (a.k.a. store's variables)
    state: () => ({
        user: null,
        token: null,
    }),

    // Getters are like computed properties for stores
    getters: {
        isLoggedIn: (state) => !!state.token,
        userName: (state) => (state.user ? state.user.name : 'User name not available'),
    },

    // Actions are for performing operations that modify state
    actions: {
        setUser(userData) {
            this.user = userData
        },
        setToken(token) {
            this.token = token
        },
        logout() {
            this.user = null
            this.token = null
        },
        async login(credentials) {
            try {
                const response = await axiosInstance.post('/auth/login', credentials)
                this.setToken(response.data.token)
                this.setUser(response.data.user)
            } catch (error) {
                console.error('Login failed', error)
                throw error
            }
        },
        async register(credentials) {
            try {
                const response = await axiosInstance.post('/auth/register', credentials)
                this.setToken(response.data.token)
                this.setUser(response.data.user)
            } catch (error) {
                console.error('Registration failed', error)
                throw error
            }
        },
    },
})
