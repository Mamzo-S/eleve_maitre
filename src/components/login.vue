<template>
    <div class="login">
        <h2>Connectez-vous</h2>
        <form @submit.prevent="login">
            <input type="text" v-model="num_tel" placeholder="Numéro de telephone" required>
            <input type="password" v-model="mdp" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "../router/index";

// Champs du formulaire
const num_tel = ref("");
const mdp = ref("");
const errorMessage = ref("");

async function login() {
    try {
        const res = await axios.post("http://localhost/eleve_maitre/api/login", {
            num_primaire: num_tel.value,
            password: mdp.value,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.data.status === "success") {
            // console.log("Utilisateur connecté :", res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            await router.push('/dashboard');
        } else {
            errorMessage.value = res.data.message;
        }
    } catch (err) {
        console.error("Erreur login:", err);
        errorMessage.value = "Identifiants invalides";
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
    margin: 160px auto;
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
    margin: 20px 0;
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
