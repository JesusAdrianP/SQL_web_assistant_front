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
        <h2 class="home-text text-xl font-bold">Consultas</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <h1 class="module-title">Consultas realizadas</h1>
                    <table class="table-base" v-if="data.length > 0">
                        <thead>
                            <tr>
                                <th>Consulta</th>
                                <th>Base de datos</th>
                                <th>Modelo utilizado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(query, index) in data" :key="index" @click="openModal(query.id)">
                                <td>{{ query.nl_query }}</td>
                                <td>{{ query.user_db_name}}</td>
                                <td>{{ query.ai_model_name}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="purple-button" @click="newQuery">Iniciar nuevo chat</button>
                </div>
            </div>
        </div>
        <button @click="goBack" class="back-button">
            <ArrowLeftIcon /> <span> Volver</span>
        </button>
      </div>
      <!-- Modal -->
        <div v-if="isModalOpen" class="overlay" @click.self="closeModal">
            <div class="modal">
                <h2 class="font-bold text-lg mb-2">Detalle de la consulta</h2>
                <div v-if="loading">Cargando...</div>
                <div v-else-if="selectedQuery">
                    <p><strong>Consulta:</strong> {{ selectedQuery.nl_query }}</p>
                    <p><strong>Base de datos:</strong> {{ selectedQuery.user_db_name }}</p>
                    <p><strong>Modelo:</strong> {{ selectedQuery.ai_model_name }}</p>
                    <label style="margin-right: 5px;" for="dropdown">¿El resultado es correcto?</label>
                    <select class="query-value" v-model="selectedValue" @change="onValueChange" id="dropdown">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div v-if="tableData.columns && tableData.columns.length > 0" class="result-table">
                    <table>
                        <thead class="sticky top-0 z-10">
                            <tr>
                                <th v-for="(column, index) in tableData.columns" :key="index">{{ column }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rowIndex) in tableData.query_result" :key="rowIndex">
                                <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-buttons"> 
                    <button class="close-btn" @click="closeModal">Cerrar</button>
                    <button class="update-button" v-if="showUpdateButton" @click="updateQueryValue(selectedQuery.id)">
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
  </template>

<script>
import { ArrowLeftIcon } from 'lucide-vue-next'
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "QueriesView",
    data() {
        return {
            data: [],
            isModalOpen: false,
            selectedQuery:null,
            loading:false,
            tableData: {
                columns: [],
                query_result: [],
            },
            originalValue: null,
            selectedValue: null,
            showUpdateButton: false,
            formToUpdate: {
                is_correct: null,
            },
        };
    },
    mounted() {
        this.fetchData();
    },
    components: {
        ArrowLeftIcon
    },
    methods: {
        goBack() {
            this.$router.go(-1); 
        },
        newQuery() {
            this.$router.push({ name: 'SelectModel' })
        },
        logoutApp() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'InicioView' });
        },
        async fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("/queries/user_queries",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.data = response.data 
                console.log("Mensaje obtenido:", response.data);
            } catch (error) {
                console.error("Error al obtener el mensaje:", error);
                this.mensaje = "Error al cargar el mensaje.";
            }
        },
        async openModal(query_id) {
            this.isModalOpen = true
            this.loading = true
            this.selectedQuery = null
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`/queries/user_queries/${query_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const query_data = response.data
                const query_result_data = query_data.query_result
                const is_correct_query = query_data.is_correct
                this.originalValue = is_correct_query
                this.selectedValue = is_correct_query
                console.log("original value:", this.originalValue)
                console.log("selected value:", this.selectedValue)
                this.tableData.query_result = query_result_data.query_result
                this.tableData.columns = query_result_data.columns
                this.selectedQuery = query_data
            } catch (error) {
                console.log("Error: ", error)
                this.mensaje = `Error al obtener los datos ${error}`
            } finally {
                this.loading = false
            }
        },
        closeModal() {
            this.selectedQuery = null
            this.isModalOpen = false
        },
        onValueChange() {
            this.showUpdateButton = this.selectedValue != this.originalValue
        },
        async updateQueryValue(query_id) {
            const valueToSend = this.selectedValue
            try {
                const token = localStorage.getItem('token')
                this.formToUpdate.is_correct = valueToSend
                const response = await axios.put(`/queries/update_query/${query_id}`, this.formToUpdate,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                console.log("Sent Value:", valueToSend)
                console.log("original value:", this.selectedValue)
                console.log("Response: ", response)
            } catch (error) {
                console.log("Error al actualizar: ", error)
                this.mensaje = `Error al actualizar ${error}`
            } finally {
                this.originalValue = this.selectedValue
                this.showUpdateButton = false
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
  margin: 2rem auto; /* Centra horizontalmente y da espacio arriba/abajo */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Espacio entre el texto y la imagen */
  flex-wrap: wrap; /* Para que se adapte en pantallas pequeñas */
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
  width: 400px;
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
</style>