<template>
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
                <label for="db_password">Contraseña de la base de datos:</label>
                <input type="password" id="db_password" v-model="form.db_password" required />
            </div>
            <div class="form-group">
                <label for="db_host">Host de la base de datos:</label>
                <input type="text" id="db_host" v-model="form.db_host" required />
            </div>
            <button type="submit">Conectar</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
                db_user: '',
                db_password: '',
                db_host: ''
            },
            errorMessage: ''
        };
    },
    methods: {
        goToView () {
            this.$router.push({ name: 'ChatView' })
        },
        async submitForm() {
            try {
                const response = await axios.post("/generate_db_connection/", this.form);
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
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
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
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    margin-top: 15px;
    font-weight: bold;
}
</style>