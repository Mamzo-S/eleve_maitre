<template>
    <div class="login">
        <h2>Connectez-vous</h2>
        <form @submit.prevent="login">
            <input type="text" v-model="num_dossier" placeholder="Numéro de dossier" required>
            <input type="password" v-model="motdepasse" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// Champs du formulaire
const num_dossier = ref("");
const motdepasse = ref("");
const errorMessage = ref("");

async function login() {
    try {
        const res = await axios.post("http://localhost:8080/login", {
            num_dossier: num_dossier.value,
            motdepasse: motdepasse.value,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.data.status === "success") {
            console.log("Utilisateur connecté :", res.data.user);
        } else {
            errorMessage.value = res.data.message;
        }
    } catch (err) {
        console.error("Erreur login:", err);
        errorMessage.value = "Une erreur est survenue. Vérifiez vos identifiants.";
    }
}
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    background: #f4f6f8;
}

.login {
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.1);
    width: 300px;
    margin: 80px auto;
    text-align: center;
}

.login input {
    color: black;
    background: #fff;
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.login button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

.login button:hover {
    background: #0056b3;
}

.error {
    margin-top: 10px;
    color: red;
    font-size: 14px;
}
</style>
