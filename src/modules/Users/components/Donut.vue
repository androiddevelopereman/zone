<script setup>
import { ref } from 'vue'
import data2 from '..//..//..//data2'


const dataForDonutChart = ref(data2.dataForDonutChart || {});


const series = ref(Object.values(dataForDonutChart.value).map(Number));

const chartOptions = ref({
    chart: {
        type: 'donut',
    },
    title: {
        text: 'Distribution of Speeds',
        align: 'left',
    },
    labels: Object.keys(dataForDonutChart.value),
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
});

console.log(series.value);
</script>

<template>
    <main>
        <apexchart width="100%" height="600" type="donut" :options="chartOptions" :series="series" />
    </main>
</template>
