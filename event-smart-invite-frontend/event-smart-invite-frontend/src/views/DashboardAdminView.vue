<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">💍</span>
        <h2>Event Smart Invite</h2>
      </div>
      <div class="nav-user">
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.nom || "Admin" }}</span>
        </div>
        <button @click="handleLogout" class="btn-logout">
          <span class="logout-icon">🚪</span>
          Déconnexion
        </button>
      </div>
    </nav>

    <div class="dashboard-container">
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Tableau de bord Administrateur</h1>
          <div class="welcome-card">
            <div class="welcome-icon">👨💼</div>
            <div class="welcome-text">
              <h2>Bienvenue {{ authStore.user?.nom || "Admin" }} !</h2>
              <p>Gérez votre plateforme Event Smart Invite</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <div class="action-grid">
            <div class="action-card admin">
              <div class="card-icon">💑</div>
              <h3>Créer compte</h3>
              <p>Créez un nouveau compte <br> (marier / photographe)</p>
              <button @click="showCreateMarieForm = true" class="btn-action">
                Créer
              </button>
            </div>

            <div class="action-card admin">
              <div class="card-icon">👥</div>
              <h3>Gestion des invités</h3>
              <p>Ajouter les nouveau invites</p>

              <router-link to="/invites" class="btn-action">
                Accéder
              </router-link>
            </div>

            <div class="action-card admin">
              <div class="card-icon">🎫</div>
              <h3>Génération invitations</h3>
              <p>envoie des invitations avec QR codes</p>
               <router-link to="/invitations" class="btn-action">
                Accéder
              </router-link>
            </div>

            <div class="action-card admin">
              <div class="card-icon">📸</div>
              <h3>Validation photos</h3>
              <p>Validez ou rejetez les photos uploadées</p>
              <button
                @click="navigateTo('/galerie?from=admin')"
                class="btn-action"
              >
                Accéder
              </button>
            </div>

            <div class="action-card admin">
              <div class="card-icon">🪑</div>
              <h3>Plan de tables</h3>
              <p>Organisez la disposition des tables et places</p>
              <button @click="navigateTo('/table-plan')" class="btn-action">
                Accéder
              </button>
            </div>

            <div class="action-card admin">
              <div class="card-icon">📊</div>
              <h3>Statistiques</h3>
              <p>Consultez les statistiques de l'événement</p>
              <button @click="navigateTo('/analytics')" class="btn-action">
                Accéder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal création compte mariés -->
    <div v-if="showCreateMarieForm" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>💑 Créer un compte mariés</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="createMarieAccount" class="marie-form">
          <div class="form-group">
            <label>Nom du marié</label>
            <input
              v-model="marieForm.nomMarie"
              type="text"
              required
              placeholder="Prénom Nom"
            />
          </div>

          <div class="form-group">
            <label>Nom de la mariée</label>
            <input
              v-model="marieForm.nomMariee"
              type="text"
              required
              placeholder="Prénom Nom"
            />
          </div>

          <div class="form-group">
            <label>Numéro de téléphone</label>
            <input
              v-model="marieForm.telephone"
              type="tel"
              required
              placeholder="0612345678"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="marieForm.email"
              type="email"
              required
              placeholder="couple@example.com"
            />
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input
              v-model="marieForm.motDePasse"
              type="password"
              required
              placeholder="Mot de passe sécurisé"
            />
          </div>

          <div class="form-group">
            <label>Date du mariage</label>
            <input v-model="marieForm.dateMariage" type="date" required />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Annuler
            </button>
            <button type="submit" class="btn-create" :disabled="isCreating">
              {{ isCreating ? "Création..." : "Créer le compte" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal création compte photographe -->
    <div
      v-if="showCreatePhotographeForm"
      class="modal-overlay"
      @click="closePhotographeModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>📸 Créer un compte photographe</h3>
          <button @click="closePhotographeModal" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="createPhotographeAccount" class="marie-form">
          <div class="form-group">
            <label>Prénom</label>
            <input
              v-model="photographeForm.prenom"
              type="text"
              required
              placeholder="Prénom"
            />
          </div>

          <div class="form-group">
            <label>Nom</label>
            <input
              v-model="photographeForm.nom"
              type="text"
              required
              placeholder="Nom"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="photographeForm.email"
              type="email"
              required
              placeholder="email@example.com"
            />
          </div>

          <div class="form-group">
            <label>Numéro de téléphone</label>
            <input
              v-model="photographeForm.telephone"
              type="tel"
              required
              placeholder="0612345678"
            />
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input
              v-model="photographeForm.motDePasse"
              type="password"
              required
              placeholder="Mot de passe sécurisé"
            />
          </div>

          <div class="form-group">
            <label>Entreprise/Studio (optionnel)</label>
            <input
              v-model="photographeForm.entreprise"
              type="text"
              placeholder="Nom de l'entreprise"
            />
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="closePhotographeModal"
              class="btn-cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn-create"
              :disabled="isCreatingPhotographe"
            >
              {{ isCreatingPhotographe ? "Création..." : "Créer le compte" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import marieService from "../services/marieService";
import photographeService from "../services/photographeService";

const router = useRouter();
const authStore = useAuthStore();

const showCreateMarieForm = ref(false);
const isCreating = ref(false);
const showCreatePhotographeForm = ref(false);
const isCreatingPhotographe = ref(false);

const marieForm = reactive({
  nomMarie: "",
  nomMariee: "",
  email: "",
  telephone: "",
  motDePasse: "",
  dateMariage: "",
});

const photographeForm = reactive({
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  motDePasse: "",
  entreprise: "",
});

const closeModal = () => {
  showCreateMarieForm.value = false;
  Object.keys(marieForm).forEach((key) => {
    marieForm[key] = "";
  });
};

const closePhotographeModal = () => {
  showCreatePhotographeForm.value = false;
  Object.keys(photographeForm).forEach((key) => {
    photographeForm[key] = "";
  });
};

const createMarieAccount = async () => {
  isCreating.value = true;
  try {
    const response = await marieService.createByAdmin({
      nomMarie: marieForm.nomMarie,
      nomMariee: marieForm.nomMariee,
      email: marieForm.email,
      telephone: marieForm.telephone,
      motDePasse: marieForm.motDePasse,
      dateMariage: marieForm.dateMariage,
    });

    alert(response.message);
    closeModal();
  } catch (error) {
    console.error("Erreur création compte:", error);
    alert(error.message || "Erreur lors de la création du compte");
  } finally {
    isCreating.value = false;
  }
};

const createPhotographeAccount = async () => {
  isCreatingPhotographe.value = true;
  try {
    const response = await photographeService.createByAdmin({
      prenom: photographeForm.prenom,
      nom: photographeForm.nom,
      email: photographeForm.email,
      telephone: photographeForm.telephone,
      motDePasse: photographeForm.motDePasse,
      entreprise: photographeForm.entreprise,
    });

    alert(response.message);
    closePhotographeModal();
  } catch (error) {
    console.error("Erreur création compte photographe:", error);
    alert(error.message || "Erreur lors de la création du compte");
  } finally {
    isCreatingPhotographe.value = false;
  }
};

const navigateTo = (path) => {
  console.log("Navigation vers:", path);
  try {
    router.push(path);
  } catch (error) {
    console.error("Erreur navigation:", error);
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  font-size: 2rem;
}

.navbar h2 {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
}

.badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.admin {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.logout-icon {
  font-size: 1.1rem;
}

.dashboard-container {
  padding: 2rem;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-icon {
  font-size: 3.5rem;
  animation: wave 2s infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

.welcome-text h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.75rem;
}

.welcome-text p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: currentColor;
  opacity: 0.05;
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.action-card.admin {
  border-color: #667eea;
  color: #667eea;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.action-card p {
  color: #6c757d;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.btn-action {
  padding: 0.625rem 1.5rem;
  background: currentColor;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-action:hover {
  opacity: 0.9;
  transform: translateX(5px);
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
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.marie-form {
  padding: 1.5rem;
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
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
