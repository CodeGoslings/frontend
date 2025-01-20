<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 class="mb-6 text-2xl font-bold text-center">
                {{ $t('donor.new') }}
            </h1>
            <form @submit.prevent="handleSubmit">
                <div v-if="!isMaterial" class="mb-4">
                    <label for="amount" class="block mb-2 font-medium text-gray-700">{{
                            $t('donor.amount')
                        }}</label>
                    <input
                        type="number"
                        min="0"
                        step=".01"
                        id="amount"
                        v-model="formData.amount"
                        :placeholder="$t('donor.enterAmount')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <div v-if="isMaterial" class="mb-6">
                    <label for="description" class="block mb-2 font-medium text-gray-700">{{
                            $t('donor.description')
                        }}</label>
                    <input
                        type="text"
                        id="description"
                        v-model="formData.description"
                        :placeholder="$t('donor.enterDescription')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <div v-if="isMaterial" class="mb-6">
                    <label for="location" class="block mb-2 font-medium text-gray-700">{{
                            $t('donor.location')
                        }}</label>
                    <input
                        type="text"
                        id="location"
                        v-model="formData.location"
                        :placeholder="$t('donor.enterLocation')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring focus:outline-none"
                    />
                </div>

                <div class="mb-6">
                    <label for="isMaterial" class="block mb-2 font-medium text-gray-700">{{
                            $t('donor.isMaterial')
                        }}</label>
                    <ToggleSwitch v-model="isMaterial" />
                </div>

                <button
                    type="submit"
                    class="w-full px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    {{$t('donor.add') }}
                </button>
            </form>
        </div>
        <div class="w-6"/>
        <div class="w-full max-w-max p-6 bg-white rounded-lg shadow-lg">
            <h1 class="mb-6 text-2xl font-bold text-center">
                {{ $t('donor.list') }}
            </h1>
            <ul>
                <li v-for="donation in this.donations" :key="donation.id" class="mb-4">
                    <div class="flex justify-between bg-gray-200 rounded p-3">
                        <div>
                            <p class="font-semibold">{{ $t('donor.date') }}: {{ new Date(Date.parse(donation.date)) }}</p>
                            <p v-if="donation.amount != null" class="font-semibold">{{ $t('donor.amount') }}: {{ donation.amount }} BTC</p>
                            <p v-if="donation.description != null" class="font-semibold">{{ $t('donor.description') }}: {{ donation.description }}</p>
                            <p v-if="donation.location != null" class="font-semibold">{{ $t('donor.location') }}: {{ donation.location }}</p>
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
                amount: '',
                description: '',
                location: ''
            },
            validationErrors: {},
            donations: [],
        }
    },

    name: 'DonorView',

    computed: {
        userStore() {
            return useUserStore()
        },
    },

    methods: {
        async handleSubmit() {
            if (this.isMaterial) {
                try {
                    await this.userStore.makeDonation({
                        type: 1,
                        status: 0,
                        date: new Date().toISOString(),
                        amount: null,
                        description: this.formData.description,
                        location: this.formData.location
                    })
                    alert(this.$t('donor.donationSuccess'))
                } catch (error) {
                    console.error('Failed to make donation', error)
                    alert(this.$t('donor.donationFailure'))
                }
            } else {
                try {
                    await this.userStore.makeDonation({
                        type: 0,
                        status: 0,
                        date: new Date().toISOString(),
                        amount: this.formData.amount,
                        description: null,
                        location: null
                    })
                    alert(this.$t('donor.donationSuccess'))
                } catch (error) {
                    console.error('Failed to make donation', error)
                    alert(this.$t('donor.donationFailure'))
                }
            }
            this.donations = this.getDonations()
        },

        async getDonations() {
            try {
                this.donations = await this.userStore.getDonations()
            } catch (error) {
                console.error('Failed to get donations', error)
            }
        }
    },
    mounted() {
        this.donations = this.getDonations()
    },
}

</script>
