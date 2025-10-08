<template>
  <!--  <Login />-->
  <div class="layout">
    <!-- Profil gauche -->
    <aside class="profil">
      <div class="text-center p-4">
        <div class="img mb-4">
          <img
            :src="`https://ui-avatars.com/api?background=0D8ABC&color=fff&name=${user.prenom_eleve}+${user.nom_eleve}`"
            class="rounded-circle" width="80" height="80" />
        </div>
        <h4 class="text-warning">Bienvenue {{ user.prenom_eleve }} </h4>
        <p><b>Nom :</b> {{ user.nom_eleve }} </p>
        <p><b>Email :</b> {{ user.email }} </p>
        <p><b>Téléphone :</b> {{ user.num_primaire }} </p>
        <p><b>Date de naissance :</b> {{ user.date_naissance }} </p>
        <p><b>Lieu de naissance :</b> {{ user.lieu_naissance }} </p>
        <p><b>CNI :</b> {{ user.cni_eleve }} </p>
        <p><b>Numero de table BAC :</b> {{ user.numero_table_bac }} </p>
        <b-button variant="danger" @click="logout" class="mt-2">
          Se déconnecter
        </b-button>
      </div>
    </aside>

    <!-- Liste IEF droite -->
    <main class="content">
      <!-- <b-card> -->
      <div class="align-items-center mb-4 mt-5">
        <h2 class="mt-2">Veuillez ordonner votre liste de choix d'IEF</h2>
      </div>

      <div class="ief-scroll">
        <draggable v-model="ief" item-key="id">
          <template #item="{ element }">
            <div class="d-flex align-items-center p-2 border rounded mb-2 bg-light">
              <!-- <span class="me-2 text-muted">≡</span> -->
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
      <!-- </b-card> -->
    </main>
  </div>
  <!-- <Footer /> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";
import axios from "axios";
import router from "../router/index";
import { toast } from "vue3-toastify";

const ief = ref([]);
const user = ref([]);

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

    if ( res.data.status === "success") {
      toast.success("Choix enregistrés avec succès !", {
        position: "top-right",
        autoClose: 3000
      });
    } else if ( res.data.status === "error") {
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
  padding: 20px;
  margin: 20px 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #8ae6ffba;
  padding: 10px;
  margin: 20px 0;
  height: 100vh;
}

.ief-scroll {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  margin-left: 32%;
  padding-right: 32%;
}

p {
  text-align: left;
}

/* ---------- RESPONSIVE---------- */
@media (max-width: 768px) {
  .layout {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 12px;
  }

  .profil {
    position: static;
    top: auto;
    width: 100%;
    min-height: 350px;
    margin: 2;
    padding: 16px;
    border-radius: 8px;
  }

  .content {
    /* width: 100%; */
    margin: 0;
    padding: 12px;
    background-color: transparent;
  }

  .ief-scroll {
    margin-left: 10px;
    max-height: calc(60vh);
    padding-right: 0;
  }

  .content h2 {
    font-size: 1.1rem;
  }

  .profil .img img {
    width: 64px;
    height: 64px;
  }

  .button-save {
    padding-bottom: 60px;
  }
}
</style>
