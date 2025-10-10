<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'show': showSidebar }">
      <div class="sidebar-header">
        <img :src="`https://ui-avatars.com/api?background=0D8ABC&color=fff&name=${user.prenom_eleve}+${user.nom_eleve}`"
          class="profile-image" alt="Profile" />
        <h3 class="user-name">{{ user.prenom_eleve }} {{ user.nom_eleve }}</h3>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-list-ol"></i>
          Faire mes choix
        </router-link>
        <router-link to="/mes-choix" class="nav-item" active-class="active">
          <i class="fas fa-clipboard-list"></i>
          Voir mes choix
        </router-link>
      </nav>

      <div class="user-info">
        <div class="info-item">
          <span class="label">Email :</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Téléphone :</span>
          <span class="value">{{ user.num_primaire }}</span>
        </div>
        <div class="info-item">
          <span class="label">Date de naissance :</span>
          <span class="value">{{ user.date_naissance }}</span>
        </div>
        <div class="info-item">
          <span class="label">CNI :</span>
          <span class="value">{{ user.cni_eleve }}</span>
        </div>
        <div class="info-item">
          <span class="label">N° BAC :</span>
          <span class="value">{{ user.numero_table_bac }}</span>
        </div>
      </div>

      <button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        Se déconnecter
      </button>
    </aside>

    <!-- Mobile Header -->
    <div class="mobile-header">
      <button @click="toggleSidebar" class="menu-button">
        <i class="fas fa-bars"></i>
      </button>
      <h2 class="page-title">Faire mes choix</h2>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-header">
        <h1>
          <i class="fas fa-list-ol"></i>
          Ordonnez vos choix d'IEF
        </h1>
        <p class="subtitle">Glissez et déposez les éléments pour définir vos préférences</p>
      </div>

      <div class="choices-container">
        <draggable v-model="ief" item-key="id" class="choices-list" handle=".handle">
          <template #item="{ element, index }">
            <div class="choice-item">
              <div class="handle">
                <i class="fas fa-grip-vertical"></i>
              </div>
              <div class="choice-content">
                <div class="choice-number">{{ index + 1 }}</div>
                <div class="choice-name">{{ element.name }}</div>
              </div>
            </div>
          </template>
        </draggable>

        <div class="action-buttons">
          <button @click="saveChoices" class="save-button">
            <i class="fas fa-save"></i>
            Enregistrer mes choix
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showProfile = ref(false);
const toggleProfile = () => (showProfile.value = !showProfile.value);

import draggable from "vuedraggable";
import axios from "axios";
import router from "../router/index";
import { toast } from "vue3-toastify";

const ief = ref([]);
const user = ref([]);

const isMobile = ref(false);
const showSidebar = ref(false);
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

onMounted(() => {
  const checkWidth = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  checkWidth();
  window.addEventListener("resize", checkWidth);
});

onMounted(async () => {
  try {
    const res = await axios.get("https://codeco.education.sn/ien-get/ief");
    const listeIEF = [];
    for (let i = 0; i < res.data.iefs.length; i++) {
      const item = res.data.iefs[i]
      const nouvelIef = {
        name: item.value_ief,
        code_ief: item.code_ief,
      }
      listeIEF.push(nouvelIef)
    }
    ief.value = listeIEF
    listeIEF.sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    );
  } catch (err) {
    console.error("Erreur récupération IEF :", err);
    toast.error("Une erreur est survenue.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
});

user.value = JSON.parse(localStorage.getItem("user"));
// console.log(user);

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

async function saveChoices() {
  try {
    const data = ief.value.map((item, index) => ({
      id_eleve: user.value.id_eleve,
      code_ief: item.code_ief,
      rang: index + 1,
    }));

    console.log("Données envoyées :", data);

    const res = await axios.post("http://localhost/eleve_maitre/api/choix", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.status === "success") {
      toast.success("Choix enregistrés avec succès !", {
        position: "top-right",
        autoClose: 3000
      });
    } else if (res.data.status === "error") {
      toast.error("Erreur lors de l'enregistrement des choix", {
        position: "top-right",
        autoClose: 3000,
      });
    }

  } catch (err) {
    console.error("Erreur lors de l’enregistrement :", err);
    toast.error("Une erreur est survenue. Veuillez réessayer.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
}

.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.user-name {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.sidebar-nav {
  margin-bottom: 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.nav-item i {
  margin-right: 10px;
}

.nav-item:hover, .nav-item.active {
  background: #007bff;
  color: white;
}

.user-info {
  flex-grow: 1;
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.info-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item .label {
  color: #666;
  margin-right: 8px;
}

.logout-button {
  width: 100%;
  padding: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.main-content {
  flex-grow: 1;
  margin-left: 300px;
  padding: 30px;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin: 0;
}

.choices-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.choices-list {
  margin-bottom: 20px;
}

.choice-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.choice-item:hover {
  border-color: #007bff;
  transform: translateX(5px);
}

.handle {
  color: #007bff;
  padding: 0 15px;
  cursor: grab;
}

.choice-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.choice-number {
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.save-button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  margin: 0 auto;
}

.mobile-header {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .mobile-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: white;
    border-bottom: 1px solid #e9ecef;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .menu-button {
    background: none;
    border: none;
    font-size: 20px;
    color: #007bff;
    padding: 5px;
    cursor: pointer;
  }

  .page-title {
    margin: 0;
    font-size: 18px;
  }
}
</style>
