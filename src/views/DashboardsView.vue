<template>
    <div class="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-8" >
      <!-- Logo -->
      <div class="logo-title rounded-xl p-6 mb-6">
        <img src="@/assets/logosinfondo.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
        <h1 class="text-white text-2xl font-bold text-center mt-4" style="margin-bottom: 0px;">SQL Assistant</h1>
        <a href="#" @click="logoutApp">
            <img class="logout-icon" src="@/assets/logout.png" alt="logout">
        </a>
      </div>
  
      <!-- Card -->
      <div class="bg-white max-w-xl w-full rounded-2xl shadow-lg p-8 text-center space-y-6">
        <h2 class="home-text text-xl font-bold">Dashboards</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <h1 class="module-title">Rendimiento y uso</h1>
                    <div>
                        <select class="query-value" v-model="selectedDb" @change="handleDbChange">
                            <option disabled value="">Selecciona una base de datos</option>
                            <option v-for="db in databases" :key="db.id" :value="db">
                                {{ db.db_name }}
                            </option>
                        </select>
                        <button class="purple-button" @click="filterByDb">Filtrar</button>
                    </div>
                    <div class="graphics">
                        <div class="dashboard">
                            <h2>Uso de Modelos en Consultas</h2>
                            <PieChart :labels="modelLabels" :data="modelUsage" />
                        </div>
                        <div class="dashboard">
                            <h2>Precisión de los Modelos en Consultas</h2>
                            <BarChart :labels="modelLabels" :correct="modelCorrect" :incorrect="modelIncorrect"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button @click="goBack" class="back-button">
            <ArrowLeftIcon /> <span> Volver</span>
        </button>
      </div>
    </div>
  </template>

<script>
import PieChart from '@/components/PieChart.vue'
import BarChart from '@/components/BarChart.vue'
import { ArrowLeftIcon } from 'lucide-vue-next'
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "DashboardsView",
    data() {
        return {
            modelLabels: [],
            modelUsage: [],
            modelCorrect: [],
            modelIncorrect: [],
            data: [],
            loading:false,
            databases:[],
            selectedDb: '',
            error: null,
        };
    },
    mounted() {
        this.fetchData();
        this.fetchDatabases();
    },
    components: {
        ArrowLeftIcon,
        PieChart,
        BarChart
    },
    methods: {
        goBack() {
            this.$router.go(-1); 
        },
        logoutApp() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'InicioView' });
        },
        async fetchDatabases() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/user_dbs/user_dbs_names', 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.databases = response.data;
                console.log('Bases de datos obtenidas:', this.databases);
            } catch (error) {
                this.error = 'Error al cargar los modelos.';
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("/ai_models/calculate_model_performance",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log('Datos obtenidos:', response.data);
                this.modelUsage = response.data.performance_stats.map(item => item.usage_percentage);
                this.modelLabels = response.data.performance_stats.map(item => item.model_name);
                this.modelCorrect = response.data.performance_stats.map(item => item.correct_quantity);
                this.modelIncorrect = response.data.performance_stats.map(item => item.incorrect_quantity);
                console.log('Datos obtenidos:', this.models);
            } catch (error) {
                console.error("Error al obtener el mensaje:", error);
                this.mensaje = "Error al cargar el mensaje.";
            }
        },
        async filterByDb() {
            try {
                const token = localStorage.getItem('token')
                const user_db_id = this.selectedDb.id
                const response = await axios.get(`/queries/user_queries?user_db_id=${user_db_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                this.data = response.data
            } catch (error) {
                console.log("Error: ", error)
                this.mensaje = `Error al obtener los datos ${error}`
            }
        }
    },
};
</script>

<style scoped>
.inicio {
    text-align: center;
    font-family: Arial, sans-serif;
    margin: 20px;
}

.min-h-screen {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.logo-app {
    border-radius: 20px;
}

.logo-title {
    padding: 30px 0px;
    background-color: #5b4288;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.text-white {
    color: #FFFFFF;
    width: 100%;
    text-align: left;
}

.bg-white {
    background-color: #FFFFFF;
}

.purple-text {
    color: 	#6A1B9A;
}

.purple-button {
    background-color: #5b4288;
    color: #FFFFFF;
    padding: 15px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

.purple-button:hover {
  background-color: #7d42a2; 
  border-color: #7d42a2; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  transform: translateY(-3px); 
}

.app-features {
    display: flex;
    flex-direction: row;
    width: 80%;
    margin: 0 auto;
}

.app-features {
  width: 80%;
  margin: 2rem auto; 
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; 
  flex-wrap: wrap; 
}

.home-text {
    color: #2c3e50;
    text-align: left;
    font-size: 45px;
    margin-top: 0px;
}

.bg-white {
    padding: 20px 60px;
    height: 100%;
    background-color: #fbfafb;
}

.app-modules {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 100%;
}

.module-row {
    display: flex;
    flex-direction: row;
    gap: 40px;
    width: 100%;
}

.module-block {
    flex: 1;
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.module-block img {
    height: 120px;
    width: 120px;
}

.module-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.module-label {
    margin-top: 10px;
    font-size: 26px;
    color: #333;
    font-weight: 600;
}

.logout-icon {
    height: 80px;
    width: 80px;
    cursor: pointer;
    padding: 0px 40px;
}

.table-base {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.table-base thead {
    background-color: #f4f5f8;
}

.table-base th, .table-base td {
    padding: 8px;
}
.table-base tr {
    border-radius: 8px;
}

.table-base tbody tr:not(:last-child) {
    border-bottom: 1px solid #cccccc82;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #2c3e50;
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 5px;
}

.back-button:hover {
    background-color: #5b4288;
    color: #ffffff;
}

.module-title{
    margin-top: 0px;
}

.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 85vh;
  text-align: left;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.close-btn {
  margin-top: 15px;
  padding: 10px 15px;
  background: #5b4288;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.update-button {
    margin-top: 15px;
    padding: 10px 15px;
    background: #5b4288;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.close-btn:hover {
    background-color: #0056b3;
}

.update-button:hover {
    background-color: #0056b3;
}

.modal-buttons {
    display: flex;
    gap: 20px;
}

.result-table {
    flex: 1;                
    max-height: 50vh;       
    overflow-y: auto;       
    margin-bottom: 1rem;
}

.result-table thead {
    position: sticky;
    top: 0;
    background-color: #5b4288;
    color: #fff;
}

.result-table thead th{
    padding: 5px;
}

#dropdown {
    margin-bottom: 8px;
}

.query-value {
  color: #391872;
  border-radius: 10px;
  border: 2px solid #bfafdf;
  padding: 8px;
  margin-right: 10px;
}

.query-value select:focus {
  border: 2px solid #391872;
}

.graphics {
    width: 100%;
    display: flex;
    gap: 80px;
}

.dashboard {
    flex: 1;
    max-width: 45%; /* 🔹 cada gráfico ocupa aprox la mitad */
    background: #fff;
    padding: 1rem;
}

.dashboard canvas{
    max-height: 300px;
}
</style>