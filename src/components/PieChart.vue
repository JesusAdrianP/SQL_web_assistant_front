<script>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    labels: Array,
    data: Array
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'Uso de modelos',
            data: this.data,
            backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336']
          }
        ]
      }
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    }
  }
}
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>
