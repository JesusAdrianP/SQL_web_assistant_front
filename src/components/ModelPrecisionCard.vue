<template>
  <div class="card">
    <h3 class="model-name">{{ model.model_name }}</h3>
    <p class="precision">{{ model.performance }}%</p>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: model.performance + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModelPrecisionCard",
  props: {
    model: {
      type: Object,
      required: true,
      // { name: 'GPT-4', precision: 92 }
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
  width: 220px;
}

.model-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.precision {
  font-size: 22px;
  font-weight: bold;
  color: #1e88e5;
  margin-bottom: 12px;
}

.progress-bar {
  background-color: #e0e0e0;
  border-radius: 8px;
  height: 10px;
  width: 100%;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #42b983, #1e88e5);
  transition: width 0.4s ease;
}
</style>
