<template>
    <div class="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-8" >
      <!-- Logo -->
      <div class="logo-title rounded-xl p-6 mb-6">
        <img src="@/assets/logoapp.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
        <h1 class="text-white text-2xl font-bold text-center mt-4" style="margin-bottom: 0px;">SQL</h1>
        <h1 class="text-white text-2xl font-bold text-center mt-4" style="margin-top: -5px; margin-bottom: 0px;">Assistant</h1>
      </div>
  
      <!-- Card -->
      <div class="bg-white max-w-xl w-full rounded-2xl shadow-lg p-8 text-center space-y-6">
        <h2 class="purple-text text-xl font-bold">SQL Assistant</h2>
        <p class="purple-text text-lg font-semibold">
          Tu asistente inteligente para bases de datos SQL
        </p>
        <button class="purple-button">
            <span>
                Empezar ahora
            </span>
        </button>

        <!-- Características -->
        <div class="app-features">
            <div class="text-left" >
                <h3 class="purple-text font-bold text-lg mb-2" style="text-align: center;">Características</h3>
                <ul class="purple-text text-gray-700 list-none" style="list-style: none; text-align: left;">
                    <li>✔ Consulta por voz o texto</li>
                    <li>✔ Compatible con MySQL, PostgreSQL, SQLite y más</li>
                    <li>✔ Interfaz intuitiva</li>
                </ul>
            </div>
            <img src="@/assets/logoinicio.png" alt="logo-pc" >
        </div>
  
        <!-- Cómo funciona -->
        <div class="text-left">
          <h3 class="purple-text font-bold text-lg mb-2">¿Cómo funciona?</h3>
          <p class="purple-text">
            Escribe o expresa qué deseas hacer. Te brindamos la consulta SQL adecuada en segundos.
          </p>
        </div>
  
        <!-- CTA -->
        <a href="#" class="bg-blue-700 text-white py-2 px-6 rounded-full shadow hover:bg-blue-800">
          ¡Empieza a usar SQL Assistant hoy mismo!
        </a>
      </div>
    </div>
  </template>

<script>
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "InicioView",
    data() {
        return {
            mensaje: "Cargando mensaje...",
        };
    },
    mounted() {
        this.obtenerMensaje();
    },
    methods: {
        async obtenerMensaje() {
            try {
                const response = await axios.get("/");
                this.mensaje = response.data.message; // Ajusta según la estructura de tu respuesta
                console.log("Mensaje obtenido:", response.data.message);
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

header {
    background-color: #4CAF50;
    color: white;
    padding: 10px 0;
}

footer {
    margin-top: 20px;
    font-size: 0.9em;
    color: #555;
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
    background-color: #D1B3E0;
}

.text-white {
    color: #FFFFFF;
}

.bg-white {
    background-color: #FFFFFF;
}

.purple-text {
    color: 	#6A1B9A;
}

.purple-button {
    background-color: #6A1B9A;
    color: #FFFFFF;
    padding: 15px;
    border-radius: 10px;
    border: none;
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
</style>