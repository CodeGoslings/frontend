<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 class="mb-6 text-2xl font-bold text-center">
                {{ $t('donationAdmin.report') }}
            </h1>
            <form @submit.prevent="handleDownloadSubmit">
                <div class="mb-4">
                    <label for="year" class="block mb-2 font-medium text-gray-700">{{
                        $t('donationAdmin.year')
                    }}</label>
                    <input
                        type="number"
                        id="year"
                        min="2024"
                        max="2025"
                        v-model="formData.year"
                        :placeholder="$t('donationAdmin.enterYear')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    class="w-full px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    {{ $t('donationAdmin.getReport') }}
                </button>
            </form>
        </div>
        <div class="w-6" />
        <div class="w-full max-w-max p-6 bg-white rounded-lg shadow-lg">
            <h1 class="mb-6 text-2xl font-bold text-center">
                {{ $t('donor.list') }}
            </h1>
            <ul>
                <li v-for="donation in this.donations" :key="donation.id" class="mb-4">
                    <div class="flex items-center justify-center bg-gray-200 rounded p-3">
                        <div>
                            <p class="font-semibold">
                                {{ $t('donor.date') }}: {{ new Date(Date.parse(donation.date)) }}
                            </p>
                            <p v-if="donation.amount != null" class="font-semibold">
                                {{ $t('donor.amount') }}: {{ donation.amount }} BTC
                            </p>
                            <p v-if="donation.description != null" class="font-semibold">
                                {{ $t('donor.description') }}: {{ donation.description }}
                            </p>
                            <p v-if="donation.location != null" class="font-semibold">
                                {{ $t('donor.location') }}: {{ donation.location }}
                            </p>
                        </div>
                        <div class="p-3 space-y-2">
                            <form @submit.prevent="handleAcceptSubmit(donation)">
                                <button
                                    type="submit"
                                    class="w-full px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
                                >
                                    {{ $t('donationAdmin.accept') }}
                                </button>
                            </form>
                            <form @submit.prevent="handleRejectSubmit(donation)">
                                <button
                                    type="submit"
                                    class="w-full px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                    {{ $t('donationAdmin.reject') }}
                                </button>
                            </form>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
    data() {
        return {
            isMaterial: false,
            formData: {
                year: '',
            },
            validationErrors: {},
            donations: [],
        }
    },

    name: 'DonationAdminView',

    computed: {
        userStore() {
            return useUserStore()
        },
    },

    methods: {
        async handleDownloadSubmit() {
            try {
                await this.userStore.getAdminDonationReport(this.formData.year)
                alert(this.$t('donor.donationSuccess'))
            } catch (error) {
                console.error('Failed to make donation', error)
                alert(this.$t('donor.donationFailure'))
            }
        },

        async handleAcceptSubmit(donation) {
            try {
                await this.userStore.acceptDonation(donation)
                alert(this.$t('donor.donationSuccess'))
            } catch (error) {
                console.error('Failed to change donation status', error)
                alert(this.$t('donor.donationFailure'))
            }

            this.donations = this.getDonations()
        },

        async handleRejectSubmit(donation) {
            try {
                await this.userStore.rejectDonation(donation)
                alert(this.$t('donor.donationSuccess'))
            } catch (error) {
                console.error('Failed to change donation status', error)
                alert(this.$t('donor.donationFailure'))
            }

            this.donations = this.getDonations()
        },

        async getDonations() {
            try {
                this.donations = await this.userStore.getDonations()
            } catch (error) {
                console.error('Failed to get donations', error)
            }
        },
    },
    mounted() {
        this.donations = this.getDonations()
    }
}
</script>
