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
        <h2 class="home-text text-xl font-bold">Bases de datos</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <h1 class="module-title">Bases de datos sincronizadas</h1>
                    <table class="table-base" v-if="paginatedData.length > 0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha de Sincronización</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(db, index) in paginatedData" :key="index" @click="openModal(db.id)">
                                <td>{{ db.db_name }}</td>
                                <td>{{ new Date(db.created_at).toLocaleString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="no-data">No hay bases de datos sincronizadas.</div>
                    <div class="pagination" v-if="data.length > perPage">
                        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
                        <span>Página {{ currentPage }} de {{ totalPages }}</span>
                        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
                    </div>
                    <button class="purple-button" @click="syncDatabases">Sincronizar nueva Base de datos</button>
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
                <h2 class="font-bold text-lg mb-2">Detalles de la base de datos</h2>
                <div v-if="loading">Cargando...</div>
                <div v-else-if="selectedDb">
                    <div class="database-info">
                        <form >
                            <div class="form-group">
                                <label for="db_name">Nombre de la base de datos:</label>
                                <input type="text" id="db_name" v-model="form.db_name" required />
                            </div>
                            <div class="form-group">
                                <label for="db_user">Usuario de la base de datos:</label>
                                <input type="text" id="db_user" v-model="form.db_user" required />
                            </div>
                            <div class="form-group">
                                <label for="db_port">Puerto de la base de datos:</label>
                                <input type="text" id="db_port" v-model="form.db_port" required />
                            </div>
                            <div class="form-group">
                                <label for="db_host">Host de la base de datos:</label>
                                <input type="text" id="db_host" v-model="form.db_host" required />
                            </div>
                            <div class="form-group">
                                <label for="db_schema">Esquema base de datos:</label>
                                <input type="text" id="db_schema" v-model="form.db_schema" required />
                            </div>
                            <div class="form-group">
                                <label for="db_password">Contraseña de la base de datos:</label>
                                <input type="password" id="db_password" v-model="form.db_password" required />
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-buttons"> 
                    <button class="close-btn" @click="closeModal">Cerrar</button>
                    <button class="update-button" v-if="onValueChange" @click="updateDbData(selectedDb.id)">
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
  </template>

<script>
import { ArrowLeftIcon } from 'lucide-vue-next'
import isEqual from 'lodash/isEqual'
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "DatabasesView",
    data() {
        return {
            data: [],
            currentPage: 1,
            perPage: 10,
            loading: false,
            selectedDb: null,
            isModalOpen: false,
            form: {
                db_name: '',
                db_port: '',
                db_user: '',
                db_host: '',
                db_schema: '',
                db_password: ''
            },
            originalData: {
                db_name: '',
                db_port: '',
                db_user: '',
                db_host: '',
                db_schema: '',
                db_password: ''
            }
        };
    },
    mounted() {
        this.fetchData();
    },
    components: {
        ArrowLeftIcon
    },
    computed: {
        totalPages() {
            return Math.ceil(this.data.length / this.perPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.data.slice(start, end);
        },
        onValueChange() {
            return !isEqual(this.form, this.originalData)
        }
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'HomeView' }); 
        },
        syncDatabases() {
            this.$router.push({ name: 'DatabaseConnection' })
        },
        logoutApp() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'InicioView' });
        },
        async fetchData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("/user_dbs/user_dbs",
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
        async openModal(user_db_id) {
            this.isModalOpen = true
            this.loading = true
            this.selectedQuery = null
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`/user_dbs/user_db/${user_db_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const user_db_data = response.data
                console.log(user_db_data)
                this.selectedDb = user_db_data
                console.log("selectedDb: ", this.selectedDb.id)
                this.originalData.db_name = user_db_data.db_name
                this.originalData.db_port = user_db_data.db_port
                this.originalData.db_user = user_db_data.db_user
                this.originalData.db_host = user_db_data.db_host
                this.originalData.db_schema = user_db_data.db_schema
                this.form = { ...this.originalData }
            } catch (error) {
                console.log("Error: ", error)
                this.mensaje = `Error al obtener los datos ${error}`
            } finally {
                this.loading = false
            }
        },
        closeModal() {
            this.selectedDb = null
            this.isModalOpen = false
        },
        getChangedFields() {
            const changed = {}
            
            Object.keys(this.form).forEach(key => {
                if (!isEqual(this.form[key], this.originalData[key])) {
                    changed[key] = String(this.form[key])
                }
            })
            return changed
        },
        async updateDbData(user_db_id) {
            try {
                const token = localStorage.getItem('token')
                const valuesToUpdate = this.getChangedFields()
                console.log("values to update: ", valuesToUpdate)
                const response = await axios.put(`/user_dbs/update_db/${user_db_id}`, valuesToUpdate,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
                console.log("Response: ", response)
                alert("Datos actualizados con éxito")
            } catch (error) {
                console.log("Error al actualizar: ", error)
                this.mensaje = `Error al actualizar ${error}`
            } finally {
                this.originalData = { ...this.form }
                this.originalData.db_password = this.form.db_password = ''
                this.showUpdateButton = false
            }
        },
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
  gap: 10px;
}

.page-btn {
  background-color: #6a1b9a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-base tbody tr:hover {
    background-color: #f4f5f8;
    cursor: pointer;
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
  width: 90%;
  max-height: 85vh;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  align-items: center;
  align-content: center;
}

.modal-buttons {
    display: flex;
    gap: 20px;
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

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.database-info input {
  width: 50%;
  padding: 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  font-size: 0.95rem;
}

.database-info input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.database-info .form-group {
    margin-bottom: 15px;
}
</style>