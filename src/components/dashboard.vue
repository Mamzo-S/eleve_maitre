<template>
  <div class="mobile-topbar d-md-none text-start p-1 d-flex">
    <img :src="`https://ui-avatars.com/api?background=0D8ABC&color=fff&name=${user.prenom_eleve}+${user.nom_eleve}`"
      class="rounded-circle profile-icone" width="60" height="60" @click="toggleProfile" />
    <p class="name"><b> {{ user.prenom_eleve + user.nom_eleve }} </b></p>
  </div>
  <div class="layout">
    <!-- Profil gauche -->
    <aside class="profil" v-show="!isMobile || (isMobile && showProfile)">
      <div class="text-center p-4">
        <div class="img mb-4">
          <img
            :src="`https://ui-avatars.com/api?background=0D8ABC&color=fff&name=${user.prenom_eleve}+${user.nom_eleve}`"
            class="rounded-circle" width="80" height="80" />
        </div>
        <h4 class="text-warning">Bienvenue {{ user.prenom_eleve }} </h4>
        <p><b>Nom :</b> <span> {{ user.nom_eleve }} </span></p>
        <p><b>Email :</b> <span> {{ user.email }} </span></p>
        <p><b>Téléphone :</b> <span> {{ user.num_primaire }} </span></p>
        <p><b>Date de naissance :</b> <span> {{ user.date_naissance }} </span></p>
        <p><b>Lieu de naissance :</b> <span> {{ user.lieu_naissance }} </span></p>
        <p><b>CNI :</b> <span> {{ user.cni_eleve }} </span></p>
        <p><b>Numero de table BAC :</b> <span> {{ user.numero_table_bac }} </span></p>
        <b-button variant="danger" @click="logout" class="mt-3">
          Se déconnecter
        </b-button>
      </div>
    </aside>

    <!-- Liste IEF droite -->
    <main class="content" v-show="!isMobile || (isMobile && !showProfile)">
      <div class="align-items-center mb-4 mt-4">
        <h2 class="mt-2">Veuillez ordonner votre liste de choix d'IEF</h2>
      </div>

      <div class="ief-scroll">
        <draggable v-model="ief" item-key="id">
          <template #item="{ element }">
            <div class="d-flex align-items-center p-2 border rounded mb-2 ief">
              <img src="../assets/drag.png" width="15px">
              <span class="ms-3">{{ element.name }}</span>
            </div>
          </template>
        </draggable>
      </div>

      <div class="mt-3 button-save">
        <b-button variant="primary" @click="saveChoices">
          Enregistrer
        </b-button>
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

<style>
.layout {
  display: flex;
  height: 90vh;
  width: 100%;
}

.profil {
  width: 30%;
  background-color: #042b56;
  color: white;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 16px;
  margin: 20px 0;
}

.content {
  flex: 1;
  background-color: #8ae6ffba;
  padding: 10px;
  margin: 20px 0;
  height: 100vh;
}

.ief-scroll {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  margin-left: 28%;
  padding-right: 28%;
}

.content .ief{
    background-color: white;
  }

p {
  text-align: left;
}

/* ---------- RESPONSIVE---------- */

.profile-icon {
  cursor: pointer;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    height: auto;
  }

  .content {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 16px;
    background-color: transparent;
  }

  .content h2 {
    color: #0064cf;
    /* margin-top: 40px; */
  }

  .ief-scroll {
    max-height: calc(70vh - 100px);
    overflow-y: auto;
    margin-left: 20%;
    padding-right: 20%;
  }

  .content .ief{
    background-color: #8acaff80;
  }

  .profil {
    width: 100%;
    height: auto;
    margin: 30px 0;
    padding: 16px;
    background-color: transparent;
    color: black;
  }

  .name {
    font-size: 1.5rem;
    margin: 35px 10px;
  }

  .profil span {
    color: #0064cf;
    font-weight: 600;
  }

  .profil p {
    font-size: large;
  }

  .profil[v-show="true"] {
    display: block;
  }

  .content[v-show="true"] {
    display: block;
  }

  .mobile-topbar {
    background-color: #0064cf;
    color: white;
  }

  .profile-icone {
    cursor: pointer;
    border-radius: 50%;
    margin: 25px 5px;
  }
}
</style>
