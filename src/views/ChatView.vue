<template>
    <div class="principal-container">
        <div class="model-select">
            <h2>Cambia el Modelo</h2>
            <!-- Dropdown para seleccionar el modelo -->
            <select v-model="selectedModel" @change="handleModelChange">
                <option disabled value="">Selecciona un modelo</option>
                <option v-for="model in models" :key="model.id" :value="model">
                    {{ model.model_name }}
                </option>
            </select>
            <button @click="goBack" class="back-button">
                <ArrowLeftIcon /> <span> Volver</span>
            </button>
        </div>
        <div class="chat-container">
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="message.sender">
                    <p>{{ message.text }}</p>
                </div>
                <div v-if="isLoading" class="loading-indicator">
                    <div class="spinner"></div>
                </div>
                <div v-if="tableData.columns && tableData.columns.length > 0" class="result-table">
                    <table>
                        <thead>
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
            </div>
            <div class="input-container">
                <input
                v-model="userInput"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Escribe tu mensaje..."
                />
                 <button @click="sendMessage" :disabled="isLoading">Enviar</button>
                </div>
            </div>
    </div>
</template>

<script>
import { ArrowLeftIcon } from 'lucide-vue-next'
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "ChatView",
    data() {
        return {
            models: [],
            selectedModel: '', // Valor por defecto
            loading: false,
            error: null,
            messages: [],
            userInput: "",
            isLoading: false,
            tableData: {
                columns: [],
                query_result: [],
            },
        };
    },
    components: {
        ArrowLeftIcon
    },
    computed: {
        ...mapGetters(['getSelectedModel']), // Si estás usando Vuex para manejar el estado global
    },
    methods: {
        goBack() {
            this.$router.go(-1); 
        },
        async sendMessage() {
            if (this.userInput.trim() === "") return;

            // Add user message to the chat
            this.messages.push({ text: this.userInput, sender: "user" });

            const userMessage = this.userInput;
            this.userInput = "";
            this.isLoading = true; // Show loading indicator

            try {
                // Call the API to get the bot response
                const response = await axios.post(`/${this.getSelectedModel}/execute_query/`, {
                    query: userMessage,
                });
                this.tableData.columns = response.data.columns; // Get columns from the response
                this.tableData.query_result = response.data.query_result; // Get query result from the response
                // Add bot response to the chat
                this.messages.push({ text: "Resultados obtenidos. Consulta la tabla abajo.", sender: "bot" });
                console.log("url: ", `/${this.getSelectedModel}/execute_query/`)
                console.log("Respuesta del bot:", response.data.sql_query);
            } catch (error) {
                console.error("Error fetching bot response:", error);
                this.messages.push({
                    text: "Lo siento, hubo un error al obtener la respuesta. Prueba con otro modelo o reestructura la pregunta.",
                    sender: "bot",
                });
            } finally {
                this.isLoading = false;
            }
        },
        ...mapActions(['updateSelectModel']), // Si estás usando Vuex para manejar el estado global
        async fetchModels() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/ai_models/get_models',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.models = response.data;
                console.log('Modelos obtenidos:', this.models);
            } catch (error) {
                this.error = 'Error al cargar los modelos.';
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async handleModelChange() {
            this.loading = true;
            this.error = null; // Limpiar el error anterior
            // Limpiar el estado antes de hacer la nueva solicitud
            try {
                localStorage.setItem('selectedModel', this.selectedModel.id);
                localStorage.setItem('selectedModelName', this.selectedModel.model_name);
                await this.updateSelectModel({ id: this.selectedModel.id, model_name: this.selectedModel.model_name });
                console.log('Modelo actualizado:', this.selectedModel.model_name);
            } catch (error) {
                this.error = 'Error al actualizar el modelo.';
                console.log(error);
            } finally {
                this.loading = false;
                this.isLoading = false;
                console.log('Modelo seleccionado:', this.selectedModel.id);
                console.log('Modelo obtenido:', localStorage.getItem('selectedModel'));
            }
        },
    },
    mounted() {
        this.fetchModels();
    }
};
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    margin-left: 0px;
    margin-right: 0px;
    width: 100%;
}

.model-select h2 {
  color: #391872;
}

.model-select select {
  color: #391872;
  border-radius: 10px;
  border: 2px solid #bfafdf;
  padding: 8px;
  margin-right: 10px;
}

.messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f9f9f9;
}

.messages .user {
    text-align: right;
    margin: 5px 0;
}

.messages .bot {
    text-align: left;
    margin: 5px 0;
}

.messages p {
    display: inline-block;
    padding: 10px;
    border-radius: 8px;
    max-width: 70%;
}

.messages .user p {
    background-color: #6A1B9A;
    color: #fff;
}

.messages .bot p {
    background-color: #fae5e6;
    color: #6A1B9A;
}

.input-container {
    display: flex;
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ccc;
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

button {
    padding: 10px 20px;
    background-color: #6A1B9A;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover:enabled {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 4px solid #ccc;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.result-table {
    margin: 20px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #6A1B9A;
    color: white;
}

td {
    background-color: #f9f9f9;
}

.principal-container {
    display: flex;
    flex-direction: row;
}

.model-select {
    width: 30%;
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
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.back-button:hover {
    background-color: #5b4288;
    color: #ffffff;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>