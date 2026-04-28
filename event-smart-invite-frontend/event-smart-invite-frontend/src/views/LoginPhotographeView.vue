<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-card">
        <div class="card-header">
          <div class="icon-badge photographe">📸</div>
          <h1>Connexion Photographe</h1>
          <p class="subtitle">Partagez vos plus beaux clichés</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="telephone">
              <span class="label-icon">📱</span>
              Numéro de téléphone
            </label>
            <input 
              id="telephone"
              v-model="telephone" 
              type="tel" 
              placeholder="0612345678" 
              required 
              autocomplete="tel"
            />
          </div>
          
          <div class="form-group">
            <label for="password">
              <span class="label-icon">🔒</span>
              Mot de passe
            </label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              required 
              autocomplete="current-password"
            />
          </div>
          
          <button type="submit" class="btn-submit photographe" :disabled="loading">
            <span v-if="!loading">Se connecter</span>
            <span v-else class="loading">
              <span class="spinner"></span>
              Connexion...
            </span>
          </button>
          
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </form>
        
        <div class="card-footer">
          <p class="switch-text">Pas encore de compte ?</p>
          <router-link to="/register-photographe" class="register-link">📸 Créer un compte photographe</router-link>
          
          <div class="divider"></div>
          
          <p class="switch-text">Vous êtes :</p>
          <div class="switch-links">
            <router-link to="/login" class="link admin">👨💼 Admin</router-link>
            <router-link to="/login-marie" class="link marie">💑 Mariés</router-link>
          </div>
          <router-link to="/" class="back-link">← Retour à l'accueil</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const telephone = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.loginPhotographe(telephone.value, password.value);
    router.push('/dashboard-photographe');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  padding: 1rem;
}

.login-wrapper {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  padding: 2.5rem 2rem;
  text-align: center;
  color: white;
}

.icon-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  opacity: 0.95;
  font-size: 0.95rem;
  font-weight: 300;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1.1rem;
}

input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #f8f9fa;
}

input:focus {
  outline: none;
  border-color: #43cea2;
  background: white;
  box-shadow: 0 0 0 4px rgba(67, 206, 162, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
  color: white;
}

.btn-submit.photographe {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(67, 206, 162, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: #fee;
  border-left: 4px solid #e74c3c;
  border-radius: 8px;
  color: #c0392b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.card-footer {
  padding: 1.5rem 2rem 2rem;
  background: #f8f9fa;
  text-align: center;
}

.switch-text {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.switch-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.link {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.link.admin {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.link.admin:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.link.marie {
  color: #f5576c;
  background: rgba(245, 87, 108, 0.1);
}

.link.marie:hover {
  background: #f5576c;
  color: white;
  border-color: #f5576c;
}

.back-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: #43cea2;
}

.register-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.register-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 206, 162, 0.3);
}

.divider {
  height: 1px;
  background: #e9ecef;
  margin: 1.5rem 0;
}

@media (max-width: 480px) {
  .card-header {
    padding: 2rem 1.5rem;
  }
  
  .icon-badge {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
  
  .card-footer {
    padding: 1.5rem;
  }
  
  .switch-links {
    flex-direction: column;
  }
}
</style>
