<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'ModelAccuracyChart',
  components: { Bar },
  props: {
    labels: Array,
    correct: Array,   // cantidad de respuestas correctas
    incorrect: Array  // cantidad de respuestas incorrectas
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'Correctas',
            backgroundColor: '#4ECDC4',
            data: this.correct
          },
          {
            label: 'Incorrectas',
            backgroundColor: '#FF6B6B',
            data: this.incorrect
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Respuestas Correctas vs Incorrectas' }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    }
  }
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>