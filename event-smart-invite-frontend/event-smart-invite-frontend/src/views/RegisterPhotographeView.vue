<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo">📸</div>
        <h1>Créer votre compte photographe</h1>
        <p>Rejoignez Event Smart Invite en tant que photographe</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label>Prénom</label>
            <input 
              v-model="form.prenom" 
              type="text" 
              required 
              placeholder="Votre prénom"
              :class="{ error: errors.prenom }"
            >
            <span v-if="errors.prenom" class="error-text">{{ errors.prenom }}</span>
          </div>
          
          <div class="form-group">
            <label>Nom</label>
            <input 
              v-model="form.nom" 
              type="text" 
              required 
              placeholder="Votre nom"
              :class="{ error: errors.nom }"
            >
            <span v-if="errors.nom" class="error-text">{{ errors.nom }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Email professionnel</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="votre-email@example.com"
            :class="{ error: errors.email }"
          >
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
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
          <label>Entreprise/Studio (optionnel)</label>
          <input 
            v-model="form.entreprise" 
            type="text" 
            placeholder="Nom de votre entreprise ou studio"
          >
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
        <router-link to="/login-photographe" class="link-login">Se connecter</router-link>
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
          <p>En tant que photographe sur Event Smart Invite, vous acceptez :</p>
          <ul>
            <li>De fournir des services photographiques de qualité</li>
            <li>De respecter la confidentialité des événements</li>
            <li>D'uploader uniquement des photos appropriées</li>
            <li>De respecter les droits d'image des participants</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import photographeService from '../services/photographeService';

const router = useRouter();
const isLoading = ref(false);
const showTerms = ref(false);

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  motDePasse: '',
  confirmPassword: '',
  entreprise: '',
  acceptTerms: false
});

const errors = reactive({});

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);

  if (form.prenom.length < 2) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
  }

  if (form.nom.length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!form.email.includes('@')) {
    errors.email = 'Email invalide';
  }

  if (!/^0[1-9]\d{8}$/.test(form.telephone)) {
    errors.telephone = 'Numéro de téléphone invalide (format: 0612345678)';
  }

  if (form.motDePasse.length < 6) {
    errors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (form.motDePasse !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return Object.keys(errors).length === 0;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const response = await photographeService.register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      motDePasse: form.motDePasse,
      entreprise: form.entreprise
    });
    
    alert(`${response.message}!`);
    router.push('/login-photographe');
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
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
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
  border-color: #43cea2;
  box-shadow: 0 0 0 3px rgba(67, 206, 162, 0.1);
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
  color: #43cea2;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-register {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
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
  box-shadow: 0 8px 20px rgba(67, 206, 162, 0.3);
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
  color: #43cea2;
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