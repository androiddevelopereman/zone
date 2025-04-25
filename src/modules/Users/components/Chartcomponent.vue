<script setup>
import testData from "..//..//../..//data (1)";
import { ref } from "vue";
const chartOptions = ref({
  chart: {
    type: "area",
    stacked: false,
    height: 350,
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: "zoom",
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    text: "Speed Monitor",
    align: "left",
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    title: {
      text: "Speed",
    },
  },
  xaxis: {
    type: "datetime",
    categories: testData.map((item) => item.last_gps_device),
    title: {
      text: "Time",
    },
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val, cal) {
        const item = testData[cal.dataPointIndex];
        return `Speed: ${item.speed}
               <br/>
               Id: ${item.vehicle_id}
                <br/>
                Name :${item.vehicle_name}
                 <br/>
                 Time: ${item.last_gps_device}
               `;
      },
    },
  },
});
const series = ref([
  {
    name: "Cool",
    data: testData.map((item) => item.speed),
  },
]);
</script>

<template>
  <main>
    <apexchart
      width="100%"
      height="600"
      type="area"
      :options="chartOptions"
      :series="series"
    >
    </apexchart>
  </main>
</template>
