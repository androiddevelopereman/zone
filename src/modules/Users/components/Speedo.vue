<script setup>
import { ref, onMounted } from 'vue'
// Include the core fusioncharts file from core
import FusionCharts from 'fusioncharts/core'

// Include the Angular Gauge chart from viz folder
import AngularGauge from 'fusioncharts/viz/angulargauge'

// Include the candy theme
import CandyTheme from 'fusioncharts/themes/es/fusioncharts.theme.candy'

// Add the chart and theme as dependency
FusionCharts.addDep(AngularGauge)
FusionCharts.addDep(CandyTheme)

// Chart Data Source
const dataSource = {
    chart: {
        caption: "Speedometer",
        lowerlimit: '0',
        upperlimit: '200',
        showvalue: '1',
        numbersuffix: '%',
        theme: 'candy',
        showtooltip: '0',
    },
    colorrange: {
        color: [
            {
                minvalue: '0',
                maxvalue: '5',
                code: '#62B58F',
            },
            {
                minvalue: '5',
                maxvalue: '90',
                code: '#62B51F',
            },
            {
                minvalue: '90',
                maxvalue: '120',
                code: '#FFC533',
            },
            {
                minvalue: '75',
                maxvalue: '200',
                code: '#FF3333',
            },
        ],
    },
    dials: {
        dial: [
            {
                value: '81',
            },
        ],
    },
}

onMounted(() => {
    // Wait for FusionCharts to be ready
    FusionCharts.ready(() => {
        // Create an Instance with chart options and render the chart
        const myChart = new FusionCharts({
            type: 'angulargauge',
            renderAt: 'chart-container',
            width: '100%',
            height: '100%',
            dataFormat: 'json',
            dataSource,
        })

        myChart.render()
    })
})
</script>

<template>
    <main>
        <div id="chart-container"></div>
    </main>
</template>

<style scoped>
#chart-container {
    width: 100%;
    height: 400px;
}
</style>
