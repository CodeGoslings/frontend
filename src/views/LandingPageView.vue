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
            <div class="w-full max-w-fit p-8 bg-white rounded-lg shadow-lg">
                <h2 class="mb-4 text-xl font-semibold text-center">{{ $t('landingPage.actions') }}</h2>
                <SelectButton v-model="monitoringChoice" :options="monitoringOptions" />
                <div class="flex justify-center mt-4">
                    <form @submit.prevent="handleDownloadSubmit">
                        <div v-if="monitoringChoice === 'assignments' || monitoringChoice === 'resources'" class="mb-4">
                            <input
                                type="number"
                                id="year"
                                min="2024"
                                max="2025"
                                v-model="year"
                                :placeholder="$t('landingPage.year')"
                                class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            class="w-full px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            {{ $t('landingPage.getReport') }}
                        </button>
                    </form>
                </div>
                <div class="flex justify-center mt-4">
                    <button
                        class="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                        @click="navigateToLiveData"
                    >
                        {{ $t('landingPage.liveData') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { useUserStore } from '@/stores/user.js'

export default {
    data() {
        return {
            monitoringOptions: [
                'assignments',
                'resources',
                'affected individuals'
            ],
            monitoringChoice: '',
            year: ''
        }
    },

    computed: {
        userStore() {
            return useUserStore()
        },
    },

    name: 'LandingPage',
    methods: {
        navigateToLogin() {
            this.$router.push({ name: 'Login', query: { mode: 'login' } })
        },
        navigateToRegister() {
            this.$router.push({ name: 'Register', query: { mode: 'register' } })
        },
        navigateToLiveData() {
            this.$router.push({ name: 'LiveDataMonitoring' })
        },

        async handleDownloadSubmit() {
            try {
                switch (this.monitoringChoice) {
                    case 'assignments':
                        await this.userStore.downloadAssignmentReport(this.year)
                        break
                    case 'resources':
                        await this.userStore.downloadResourceReport(this.year)
                        break
                    case 'affected individuals':
                        await this.userStore.downloadAffectedIndividualsReport()
                        break
                    default:
                        console.error('Invalid monitoring choice')
                        alert(this.$t('landingPage.invalidChoice'))
                        return
                }
                alert(this.$t('donor.donationSuccess'))
            } catch (error) {
                console.error('Failed to change donation status', error)
                alert(this.$t('donor.donationFailure'))
            }
        },
    },
}
</script>
