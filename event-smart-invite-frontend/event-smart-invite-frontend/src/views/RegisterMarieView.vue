<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo">💍</div>
        <h1>Créer votre compte mariés</h1>
        <p>Organisez votre mariage avec Event Smart Invite</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nom du marié</label>
            <input 
              v-model="form.nomMarie" 
              type="text" 
              required 
              placeholder="Prénom Nom"
              :class="{ error: errors.nomMarie }"
            >
            <span v-if="errors.nomMarie" class="error-text">{{ errors.nomMarie }}</span>
          </div>
          
          <div class="form-group">
            <label>Nom de la mariée</label>
            <input 
              v-model="form.nomMariee" 
              type="text" 
              required 
              placeholder="Prénom Nom"
              :class="{ error: errors.nomMariee }"
            >
            <span v-if="errors.nomMariee" class="error-text">{{ errors.nomMariee }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="votre-email@example.com"
            :class="{ error: errors.email }"
          >
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              v-model="form.motDePasse" 
              type="password" 
              required 
              placeholder="Mot de passe sécurisé"
              :class="{ error: errors.motDePasse }"
            >
            <span v-if="errors.motDePasse" class="error-text">{{ errors.motDePasse }}</span>
          </div>
          
          <div class="form-group">
            <label>Confirmer le mot de passe</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              required 
              placeholder="Confirmer le mot de passe"
              :class="{ error: errors.confirmPassword }"
            >
            <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Date du mariage</label>
          <input 
            v-model="form.dateMariage" 
            type="date" 
            required
            :class="{ error: errors.dateMariage }"
          >
          <span v-if="errors.dateMariage" class="error-text">{{ errors.dateMariage }}</span>
        </div>

        <div class="form-group">
          <label>Numéro de téléphone</label>
          <input 
            v-model="form.telephone" 
            type="tel" 
            required 
            placeholder="699151882"
            :class="{ error: errors.telephone }"
          >
          <span v-if="errors.telephone" class="error-text">{{ errors.telephone }}</span>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              v-model="form.acceptTerms" 
              type="checkbox" 
              required
            >
            <span class="checkmark"></span>
            J'accepte les <a href="#" @click.prevent="showTerms = true">conditions d'utilisation</a>
          </label>
        </div>

        <button 
          type="submit" 
          class="btn-register" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Création en cours...' : 'Créer mon compte' }}
        </button>
      </form>

      <div class="register-footer">
        <p>Vous avez déjà un compte ?</p>
        <router-link to="/login-marie" class="link-login">Se connecter</router-link>
      </div>
    </div>

    <!-- Modal conditions d'utilisation -->
    <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Conditions d'utilisation</h3>
          <button @click="showTerms = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <p>En utilisant Event Smart Invite, vous acceptez :</p>
          <ul>
            <li>De fournir des informations exactes</li>
            <li>De respecter la confidentialité des données</li>
            <li>D'utiliser la plateforme de manière responsable</li>
            <li>Les conditions de traitement des données personnelles</li>
            <li>ne pas divulger des informations inaproprier </li>
            <li>Ne poster aucune photos ou video qui viole l'interet d'autrui </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import marieService from '../services/marieService';

const router = useRouter();
const isLoading = ref(false);
const showTerms = ref(false);

const form = reactive({
  nomMarie: '',
  nomMariee: '',
  email: '',
  telephone: '',
  motDePasse: '',
  confirmPassword: '',
  dateMariage: '',
  acceptTerms: false
});

const errors = reactive({});

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);

  if (form.nomMarie.length < 2) {
    errors.nomMarie = 'Le nom doit contenir au moins 2 caractères';
  }

  if (form.nomMariee.length < 2) {
    errors.nomMariee = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!form.email.includes('@')) {
    errors.email = 'Email invalide';
  }

  if (!/^0[1-9]\d{8}$/.test(form.telephone)) {
    errors.telephone = 'Numéro de téléphone invalide (format: 699151882)';
  }

  if (form.motDePasse.length < 6) {
    errors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (form.motDePasse !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  const today = new Date().toISOString().split('T')[0];
  if (form.dateMariage < today) {
    errors.dateMariage = 'La date du mariage ne peut pas être dans le passé';
  }

  return Object.keys(errors).length === 0;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const response = await marieService.register({
      nomMarie: form.nomMarie,
      nomMariee: form.nomMariee,
      email: form.email,
      telephone: form.telephone,
      motDePasse: form.motDePasse,
      dateMariage: form.dateMariage
    });
    
    alert(`${response.message}!`);
    router.push('/login-marie');
  } catch (error) {
    console.error('Erreur inscription:', error);
    alert(error.message || 'Erreur lors de la création du compte');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.register-header h1 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
}

.register-header p {
  color: #6c757d;
  margin: 0;
}

.register-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-group {
  margin: 2rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-register {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.register-footer p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
}

.link-login {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link-login:hover {
  text-decoration: underline;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-body li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-header h1 {
    font-size: 1.5rem;
  }
}
</style>