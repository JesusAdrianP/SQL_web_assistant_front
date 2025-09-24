<template>
    <div class="select-model-container">
        <div class="logo-title rounded-xl p-6 mb-6">
            <img src="@/assets/logosinfondo.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
      </div>
        <h2>Selecciona un Modelo y una Base de Datos</h2>
        <!-- Dropdown para seleccionar el modelo -->
        <div class="dropdown-container">
          <select v-model="selectedModel" @change="handleModelChange">
            <option disabled value="">Selecciona un modelo</option>
            <option v-for="model in models" :key="model.id" :value="model">
              {{ model.model_name }}
            </option>
          </select>
          <select v-model="selectedDb" @change="handleDbChange">
            <option disabled value="">Selecciona una base de datos</option>
            <option v-for="db in databases" :key="db.id" :value="db">
              {{ db.db_name }}
            </option>
          </select>
        </div>
        <div v-if="loading">Cargando...</div>
        <div v-if="error" class="error">Error: {{ error }}</div>
        <div v-if="responseData">
            <pre>{{ responseData }}</pre>
        </div>
        <button class="next-button" @click="goToView" :disabled="isLoading">Siguiente</button>
    </div>
    <button @click="goBack" class="back-button">
      <ArrowLeftIcon /> <span> Volver</span>
    </button>
</template>

<script>
import { ArrowLeftIcon } from 'lucide-vue-next'
import { mapActions } from 'vuex';
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url

export default {
  data() {
    return {
      models: [],
      selectedModel: '', // Valor por defecto
      databases: [],
      selectedDb: '', // Valor por defecto
      loading: false,
      error: null,
      responseData: null,
      isLoading: false,
    };
  },
  components: {
    ArrowLeftIcon
  },
  methods: {
    goBack() {
      this.$router.go(-1); 
    },
    ...mapActions(['updateSelectModel', 'updateSelectDb']),
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
      }
    },
    async fetchDatabases() {
      this.loading = true;
      this.error = null; // Limpiar el error anterior
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/user_dbs/user_dbs_names', 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        this.databases = response.data;
        console.log('Bases de datos obtenidas:', this.databases);
      } catch (error) {
        this.error = 'Error al cargar los modelos.';
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async handleDbChange() {
        this.loading = true;
        this.error = null; // Limpiar el error anterior
      // Limpiar el estado antes de hacer la nueva solicitud
      try {
        localStorage.setItem('selectedDb', this.selectedDb.id);
        localStorage.setItem('selectedDbName', this.selectedDb.db_name);
        await this.updateSelectDb({ id: this.selectedDb.id, db_name: this.selectedDb.db_name });
        console.log('Base de datos actualizada:', this.selectedDb.db_name);
      } catch (error) {
        this.error = 'Error al actualizar la base de datos.';
        console.log(error);
      } finally {
        this.loading = false;
        this.isLoading = false;
        console.log('Base de datos seleccionada:', this.selectedDb.id);
      }
    },
    goToView () {
      this.$router.push({ name: 'ChatView' })
    }
  },
  mounted() {
    this.fetchModels();
    this.fetchDatabases();
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

.dropdown-container {
  margin-bottom: 20px;
}

.next-button {
  margin-top: 20px;
}
</style>