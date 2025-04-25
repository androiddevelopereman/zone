<script setup>
import { ref } from "vue";
import data2 from "..//..//..//data2";

const { vehicle_off, idling, driving } = data2.data_pie_chart;
const chartOptions = ref({
  chart: {
    width: 380,
    type: "pie",
  },
  labels: ["Vehicle Off", "Idling", "Driving"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
});
</script>
<template>
  <div>
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="[+vehicle_off, +idling, +driving]"
    >
    </apexchart>
  </div>

  <iframe
    title="Sample Report Demo"
    width="1140"
    height="541.25"
    src="https://playground.powerbi.com/sampleReportEmbed"
    frameborder="0"
    allowFullScreen="true"
  ></iframe>
</template>
