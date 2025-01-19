import axiosInstance from '@/helpers/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    // State is your data (a.k.a. store's variables)
    state: () => ({
        token: null,
    }),

    // Getters are like computed properties for stores
    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    // Actions are for performing operations that modify state
    actions: {
        setToken(token) {
            this.token = token
        },
        getToken() {
            return this.token
        },
        logout() {
            this.token = null
        },
        async login(isAdmin, credentials) {
            try {
                const url = isAdmin ? '/api/donation-admin/login' : '/api/donor/login'
                const response = await axiosInstance.post(url, credentials)
                this.setToken(response.data.token)
            } catch (error) {
                console.error('Login failed', error)
                throw error
            }
        },
        async register(isAdmin, credentials) {
            try {
                const url = isAdmin ? '/api/donation-admin' : '/api/donor'
                await axiosInstance.post(url, credentials)
            } catch (error) {
                console.error('Registration failed', error)
                throw error
            }
        },
        async makeDonation(donation) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${this.getToken()}` },
                }

                axiosInstance({
                    method: 'post',
                    responseType: 'arraybuffer',
                    url: '/api/donation',
                    data: donation,
                    headers: config.headers,
                }).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/pdf' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = 'donation-confirmation.pdf'
                    link.click()
                })
            } catch (error) {
                console.error('Donation failed', error)
                throw error
            }
        },

        async getAdminDonationReport(year) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${this.getToken()}` },
                }

                axiosInstance({
                    method: 'get',
                    responseType: 'arraybuffer',
                    url: `/api/donation/donation-report/${year}`,
                    headers: config.headers,
                }).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/pdf' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = `donation-report-${year}.pdf`
                    link.click()
                })
            } catch (error) {
                console.error('Get donation report failed', error)
                throw error
            }
        },

        async getDonations() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${this.getToken()}` },
                }

                const response = await axiosInstance.get('/api/donation', config)
                return response.data
            } catch (error) {
                console.error('Get donations failed', error)
                throw error
            }
        },

        async acceptDonation(donation) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${this.getToken()}` },
                }

                await axiosInstance.put(`/api/donation/${donation.id}`,
                    {
                        type: donation.type,
                        status: 1,
                        date: donation.date,
                        amount: donation.amount,
                        description: donation.description,
                        location: donation.location
                    },
                    config)
            } catch (error) {
                console.error('Accept donation failed', error)
                throw error
            }
        },

        async rejectDonation(donation) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${this.getToken()}` },
                }

                await axiosInstance.put(`/api/donation/${donation.id}`,
                    {
                        type: donation.type,
                        status: 2,
                        date: donation.date,
                        amount: donation.amount,
                        description: donation.description,
                        location: donation.location
                    },
                    config)
            } catch (error) {
                console.error('Reject donation failed', error)
                throw error
            }


        }
    }
})
