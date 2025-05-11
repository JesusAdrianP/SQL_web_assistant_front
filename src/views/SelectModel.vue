<template>
    <div class="select-model-container">
        <div class="logo-title rounded-xl p-6 mb-6">
            <img src="@/assets/logosinfondo.png" alt="SQL Assistant Logo" class="logo-app w-40 mx-auto" />
      </div>
        <h2>Selecciona un Modelo</h2>
        <!-- Dropdown para seleccionar el modelo -->
         <select v-model="selectedModel" @change="handleModelChange">
            <option disabled value="">Selecciona un modelo</option>
            <option value="t5">T5</option>
            <option value="gemini">Gemini</option>
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

export default {
  data() {
    return {
      selectedModel: 't5', // Valor por defecto
      loading: false,
      error: null,
      responseData: null,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(['updateSelectModel']), // Si estás usando Vuex para manejar el estado global
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