<template>
  <div class="mes-choix">
    <div class="page-header">
      <h2><i class="fas fa-clipboard-list"></i> Mes Choix d'IEF</h2>
    </div>

    <div class="choices-container">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div v-else-if="choices.length > 0" class="choices-list">
        <div v-for="(choice, index) in choices" :key="index" class="choice-item">
          <div class="choice-number">{{ index + 1 }}</div>
          <div class="choice-details">
            <h3>{{ choice.name }}</h3>
          </div>
        </div>
      </div>

      <div v-else class="no-choices">
        <i class="fas fa-info-circle"></i>
        <p>Vous n'avez pas encore fait de choix d'IEF</p>
        <router-link to="/dashboard" class="btn btn-primary">
          Faire mes choix
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const choices = ref([]);
const loading = ref(true);
const user = JSON.parse(localStorage.getItem('user'));

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost/eleve_maitre/api/choix/${user.id_eleve}`);
    if (response.data.status === 'success') {
      choices.value = response.data.choices;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des choix:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.mes-choix {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  background: #007bff;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.choices-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.choice-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.choice-number {
  background: #007bff;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.choice-details h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.no-choices {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.no-choices i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

.no-choices p {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .mes-choix {
    padding: 15px;
  }

  .page-header {
    padding: 15px;
  }

  .page-header h2 {
    font-size: 20px;
  }
}
</style>
