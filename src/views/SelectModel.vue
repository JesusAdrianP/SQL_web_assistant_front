<template>
    <div class="select-model-container">
        <div class="logo-title rounded-xl p-6 mb-6">
            <img src="@/assets/logosinfondo.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
      </div>
        <h2>Selecciona un Modelo</h2>
        <!-- Dropdown para seleccionar el modelo -->
         <select v-model="selectedModel" @change="handleModelChange">
            <option disabled value="">Selecciona un modelo</option>
            <option v-for="model in models" :key="model.id" :value="model.model_name">
              {{ model.model_name }}
            </option>
        </select>
        <div v-if="loading">Cargando...</div>
        <div v-if="error" class="error">Error: {{ error }}</div>
        <div v-if="responseData">
            <pre>{{ responseData }}</pre>
        </div>
        <button @click="goToView" :disabled="isLoading">Siguiente</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url

export default {
  data() {
    return {
      models: [],
      selectedModel: '', // Valor por defecto
      loading: false,
      error: null,
      responseData: null,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(['updateSelectModel']),
    async fetchModels() {
      this.loading = true;
      this.error = null; // Limpiar el error anterior
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
        await this.updateSelectModel(this.selectedModel);
        console.log('Modelo actualizado:', this.selectedModel);
      } catch (error) {
        this.error = 'Error al actualizar el modelo.';
        console.log(error);
      } finally {
        this.loading = false;
        this.isLoading = false;
        console.log('Modelo seleccionado:', this.selectedModel);
      }
    },
    goToView () {
      this.$router.push({ name: 'ChatView' })
    }
  },
  mounted() {
    this.fetchModels();
  }
};
</script>

<style scoped>
.error {
  color: red;
}

.select-model-container {
  background-color: #f9f4fe;
  height: 100vh;;
}

.select-model-container h2 {
  color: #391872;
}

.select-model-container select {
  color: #391872;
  border-radius: 10px;
  border: 2px solid #bfafdf;
  padding: 8px;
  margin-right: 10px;
}

.select-model-container select:focus {
  border: 2px solid #391872;
}

button {
    padding: 10px 20px;
    background-color: #6A1B9A;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

button:hover:enabled {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>