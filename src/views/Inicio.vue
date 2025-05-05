<template>
    <div class="inicio">
        <header class="flex justify-between items-center p-6 bg-purple-800 text-white">
            <h1 class="text-2xl font-bold">SQL Assistant</h1>
            <nav>
                <ul class="flex gap-6 text-sm">
                    <li><a href="#features" class="hover:underline">Funciones</a></li>
                    <li><a href="#how-it-works" class="hover:underline">Cómo funciona</a></li>
                    <li><a href="#contact" class="hover:underline">Contacto</a></li>
                </ul>
            </nav>
        </header>
        <main>
            <p>{{ mensaje }}</p>
        </main>
        <section class="bg-purple-700 text-white text-center py-20 px-6">
            <h2 class="text-4xl font-bold mb-4">Tu asistente inteligente para bases de datos SQL</h2>
            <p class="text-lg mb-8">Consulta, genera y entiende tus datos con lenguaje natural.</p>
            <a href="#start" class="bg-white text-purple-700 font-semibold px-6 py-3 rounded shadow-lg hover:bg-gray-100">
                Empezar ahora
            </a>
        </section>
        <section id="features" class="py-20 px-6 bg-gray-100 text-center">
            <h3 class="text-3xl font-semibold mb-10">Características</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <h4 class="text-xl font-bold mb-2">Consulta por voz o texto</h4>
                    <p>Habla o escribe lo que necesitas saber, nosotros traducimos a SQL.</p>
                </div>
                <div>
                    <h4 class="text-xl font-bold mb-2">Soporte multibase</h4>
                    <p>Compatible con MySQL, PostgreSQL, SQLite y más.</p>
                </div>
                <div>
                    <h4 class="text-xl font-bold mb-2">Interfaz intuitiva</h4>
                    <p>Interacción sencilla, ideal para principiantes y expertos.</p>
                </div>
            </div>
        </section>
        <section id="how-it-works" class="py-20 px-6 text-center">
            <h3 class="text-3xl font-semibold mb-10">¿Cómo funciona?</h3>
            <ol class="text-left max-w-2xl mx-auto space-y-4 text-lg">
                <li>1. Escribe o habla tu pregunta sobre los datos.</li>
                <li>2. El asistente interpreta y genera una consulta SQL.</li>
                <li>3. Ves los resultados y puedes refinarlos con un clic.</li>
            </ol>
        </section>
        <section class="bg-purple-600 text-white py-20 text-center">
            <h3 class="text-3xl font-semibold mb-6">¡Empieza a usar SQL Assistant hoy mismo!</h3>
            <a href="#start" class="bg-white text-purple-700 font-semibold px-6 py-3 rounded shadow-lg hover:bg-gray-100">
                Crear cuenta gratis
            </a>
        </section>
        <router-link to="/chat">Ir al Chat </router-link>
        <router-link to="/db_connection">Conectar Base de Datos</router-link>
        <footer id="contact" class="bg-purple-800 text-white text-center py-6 text-sm">
            <p>&copy; 2025 SQL Assistant. Todos los derechos reservados.</p>
        </footer>
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
</style>