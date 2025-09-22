<template >
    <!-- Logo -->
    <div class="logo-title rounded-xl p-6 mb-6" style="background-color: #573672;">
        <img src="@/assets/logoapp.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
    </div>
    <div class="form-container">
        <div class="database-connection">
            <h1>Inicia Sesión</h1>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" id="email" v-model="form.username" required />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" v-model="form.password" required />
                </div>
                <button type="submit">Iniciar Sesión</button>
                <p class="signup-text">
                    ¿No tienes una cuenta? <a href="#" @click="goToSignUp">Regístrate</a>
                </p>
            </form>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "LoginView",
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            errorMessage: ''
        };
    },
    methods: {
        goToSignUp(){
            this.$router.push({ name: 'SignUp' })
        },
        goToView () {
            this.$router.push({ name: 'SelectModel' })
        },
        async submitForm() {
            try {
                const response = await axios.post("/users/login", 
                    new URLSearchParams({
                        username: this.form.username,
                        password: this.form.password
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                console.log("Inicio de sesión exitoso:", response.data);
                localStorage.setItem("token", response.data.access_token);
                this.goToView()
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                this.errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
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

.form-container {
    background-color: #573672;
    height: 100%;
}

.signup-text {
    color: #2c3e50;
}

.signup-text a {
    color: #2c3e50;
    font-weight: 600;
    text-decoration: none;
}

.signup-text a:hover {
    text-decoration: underline;
}
</style>