<template >
    <div class="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-8" >
      <!-- Logo -->
      <div class="logo-title rounded-xl p-6 mb-6">
        <img src="@/assets/logosinfondo.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
        <h1 class="text-white text-2xl font-bold text-center mt-4" style="margin-bottom: 0px;">SQL Assistant</h1>
        <a href="#" @click="logoutApp">
            <img class="logout-icon" src="@/assets/logout.png" alt="logout">
        </a>
      </div>
      <div class="bg-white max-w-xl w-full rounded-2xl shadow-lg p-8 text-center space-y-6">
        <h2 class="home-text text-xl font-bold">Inicio</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <div class="form-container">
                        <div class="database-connection">
                            <h1>Conecta tu base de datos</h1>
                            <form @submit.prevent="submitForm">
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
                                <button type="submit">Conectar</button>
                            </form>
                            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        </div>
                    </div>
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
    name: "DatabaseConnection",
    data() {
        return {
            form: {
                db_name: '',
                db_port: '',
                db_user: '',
                db_host: '',
                db_schema: '',
                user_id: localStorage.getItem('user_id'),
            },
            errorMessage: ''
        };
    },
    methods: {
        logoutApp() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'InicioView' });
        },
        goToView () {
            this.$router.push({ name: 'DatabasesView' })
        },
        async submitForm() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post("/user_dbs/register_db", this.form, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Conexión a la base de datos exitosa:", response.data);
                this.goToView()
            } catch (error) {
                console.error("Error al conectar a la base de datos:", error);
                this.errorMessage = "Error al conectar a la base de datos. Verifica tus credenciales.";
            }
        }
    }
};
</script>

<style scoped>
.database-connection {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    padding: 8px;
    box-sizing: border-box;
}

.home-text {
    color: #2c3e50;
    text-align: left;
    font-size: 45px;
    margin-top: 0px;
}

button {
    padding: 10px 15px;
    background-color: #5b4288;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

button:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    margin-top: 15px;
    font-weight: bold;
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
    padding: 20px 60px;
    height: 100%;
    background-color: #fbfafb;
}

.purple-text {
    color: 	#6A1B9A;
}

.module-block {
    flex: 1;
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
</style>