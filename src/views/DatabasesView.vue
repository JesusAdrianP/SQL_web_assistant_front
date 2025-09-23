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
        <h2 class="home-text text-xl font-bold">Inicio</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <h1>Bases de datos sincronizadas</h1>
                    <table class="table-base" v-if="data.length > 0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha de Sincronización</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(db, index) in data" :key="index">
                                <td>{{ db.db_name }}</td>
                                <td>{{ db.db_user }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="purple-button" @click="syncDatabases">Sincronizar nueva Base de datos</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  </template>

<script>
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "DatabasesView",
    data() {
        return {
            data: [],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        syncDatabases() {
            this.$router.push({ name: 'DatabaseConnection' })
        },
        logoutApp() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'InicioView' });
        },
        goToView () {
            this.$router.push({ name: 'LoginView' })
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
                this.data = response.data // Ajusta según la estructura de tu respuesta
                console.log("Mensaje obtenido:", response.data);
            } catch (error) {
                console.error("Error al obtener el mensaje:", error);
                this.mensaje = "Error al cargar el mensaje.";
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
</style>