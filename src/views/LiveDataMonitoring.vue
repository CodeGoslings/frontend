<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h1 class="mb-6 text-2xl font-bold text-center">
                    {{ $t('liveMonitoring.liveData') }}
                </h1>
            </div>
            <div class="h-3"/>
            <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <Chart type="bar" :data="{
                    labels: dataTypes,
                    datasets: [{
                        label: '# of different data types',
                        data: [assignmentData.length, resourceData.length, affectedIndividualsData.length],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1
                    }],
                    }"/>
            </div>
            <div class="h-3"/>
            <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <Chart type="pie" :data="{
                    labels: ['Material donations', 'Monetary donations'],
                    datasets: [{
                        data: [resourceData.filter(function(x) {return x.type === 1}).length, resourceData.filter(function(x) {return x.type === 0}).length],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1
                    }],
                }"/>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '@/stores/user.js'

export default {
    name: 'LivedataMonitoring',
    data() {
        return {
            timer: null,
            dataTypes: [
                'assignments',
                'resources',
                'affected individuals'
            ],
            assignmentData: [],
            resourceData: [],
            affectedIndividualsData: [],
        };
    },

    computed: {
        userStore() {
            return useUserStore()
        },
    },

    methods: {
        async getAssignmentData() {
            this.assignmentData = await this.userStore.getLiveAssignmentData()
        },
        async getResourceData() {
            this.resourceData = await this.userStore.getLiveResourceData()
        },
        async getAffectedIndividualsData() {
            this.affectedIndividualsData = await this.userStore.getLiveIndividualData()
        }
    },

    mounted: function () {
        this.timer = setInterval(() => {
            this.getResourceData()
            this.getAssignmentData()
            this.getAffectedIndividualsData()
            console.log(this.resourceData)
        }, 5000)
    },

    beforeUnmount() {
        clearInterval(this.timer)
    }
}
</script>
