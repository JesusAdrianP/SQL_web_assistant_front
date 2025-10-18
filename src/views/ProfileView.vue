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
        <h2 class="home-text text-xl font-bold">Perfil</h2>
        <div class="app-modules">
            <div class="module-row">
                <div class="module-block">
                    <div class="profile-module-header">
                        <img src="@/assets/profile_logo.png" alt="Profile Logo"/>
                        <h1 class="module-title">Perfil</h1>
                    </div>
                    <div class="profile-info">
                        <form >
                            <div class="form-group">
                                <label for="username">Nombre de usuario</label>
                                <input type="text" id="username" v-model="form.username" required />
                            </div>
                            <div class="form-group">
                                <label for="email">Correo electrónico</label>
                                <input type="text" id="email" v-model="form.email" required />
                            </div>
                            <div class="form-group">
                                <label for="password">Contraseña</label>
                                <input type="password" id="password" v-model="form.password" required />
                            </div>
                            <button class="purple-button save-btn" type="submit" :disabled="!hasChanges">Guardar cambios</button>
                        </form>
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
import { ArrowLeftIcon } from 'lucide-vue-next'
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url

export default {
    name: "ProfileView",
    data() {
        return {
            originalUserData: {
                username: '',
                email: ''
            },
            form: {
                username: '',
                email: '',
                password: ''
            },
            loading:false,
            originalValue: null,
            selectedValue: null,
            showUpdateButton: false,
        };
    },
    mounted() {
        this.fetchUserData();
    },
    components: {
        ArrowLeftIcon
    },
    methods:{
        goBack() {
            this.$router.go(-1); 
        },
        async fetchUserData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.form.email = response.data.email
                this.form.username = response.data.username
                this.originalUserData.email = response.data.email
                this.originalUserData.username = response.data.username
                console.log("Mensaje obtenido:", response.data);
                console.log("original data:", this.originalUserData)
            } catch (error) {
                console.error("Error al obtener el mensaje:", error);
                this.mensaje = "Error al cargar el mensaje.";
            }
        }
    },
    computed: {
        hasChanges() {
            const usernameChanged = this.form.username !== this.originalUserData.username;
            const emailChanged = this.form.email !== this.originalUserData.email;
            const passwordFilled = this.form.password && this.form.password.trim() !== "";
    
            return usernameChanged || emailChanged || passwordFilled;
        },
    }
}
</script>

<style scoped>

.save-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background-color: #43a047;
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

input {
  width: 50%;
  padding: 0.8rem;
  border: 1px solid #cbd5e0;
  border-radius: 10px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  font-size: 0.95rem;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.form-group {
    margin-bottom: 15px;
}

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

.logout-icon {
    height: 80px;
    width: 80px;
    cursor: pointer;
    padding: 0px 40px;
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

.module-block {
    flex: 1;
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.module-title{
    margin-top: 0px;
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

.update-button:hover {
    background-color: #0056b3;
}

</style>