<template>
  <div class="invites-page">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">💍</span>
        <h2>Gestion des Invités</h2>
      </div>
      <div class="nav-actions">
        <button @click="showModal = true" class="btn-add">
          <span>➕</span> Ajouter un invité
        </button>
        <button @click="$router.push('/dashboard-admin')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ inviteStore.totalInvites }}</h3>
            <p>Total invités</p>
          </div>
        </div>
        <div class="stat-card famille">
          <div class="stat-icon">👨‍👩‍👧‍👦</div>
          <div class="stat-info">
            <h3>{{ inviteStore.groupCounts.Famille }}</h3>
            <p>Famille</p>
          </div>
        </div>
        <div class="stat-card amis">
          <div class="stat-icon">🤝</div>
          <div class="stat-info">
            <h3>{{ inviteStore.groupCounts.Amis }}</h3>
            <p>Amis</p>
          </div>
        </div>
        <div class="stat-card collegues">
          <div class="stat-icon">💼</div>
          <div class="stat-info">
            <h3>{{ inviteStore.groupCounts.Collègues }}</h3>
            <p>Collègues</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <button 
          v-for="group in ['Tous', 'Famille', 'Amis', 'Collègues', 'Autres']" 
          :key="group"
          @click="selectedGroup = group"
          :class="['filter-btn', { active: selectedGroup === group }]"
        >
          {{ group }}
        </button>
      </div>

      <div v-if="inviteStore.loading" class="loading">Chargement...</div>
      
      <div v-else-if="filteredInvites.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucun invité</h3>
        <p>Commencez par ajouter votre premier invité</p>
      </div>

      <div v-else class="invites-grid">
        <div v-for="invite in filteredInvites" :key="invite.id" class="invite-card">
          <div class="invite-header">
            <div class="invite-avatar">{{ invite.nom.charAt(0) }}{{ invite.prenom.charAt(0) }}</div>
            <div class="invite-info">
              <h3>{{ invite.nom }} {{ invite.prenom }}</h3>
              <span :class="['badge', invite.groupe.toLowerCase()]">{{ invite.groupe }}</span>
            </div>
          </div>
          <div class="invite-details">
            <div class="detail-item">
              <span class="icon">📱</span>
              <span>{{ invite.telephone }}</span>
            </div>
          </div>
          <div class="invite-actions">
            <button @click="editInvite(invite)" class="btn-edit">✏️ Modifier</button>
            <button @click="confirmDelete(invite)" class="btn-delete">🗑️ Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editMode ? 'Modifier' : 'Ajouter' }} un invité</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <form @submit.prevent="saveInvite" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Nom *</label>
              <input v-model="form.nom" required />
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input v-model="form.prenom" required />
            </div>
          </div>
          <div class="form-group">
            <label>Téléphone WhatsApp *</label>
            <input v-model="form.telephone" type="tel" required />
          </div>
          <div class="form-group">
            <label>Groupe *</label>
            <select v-model="form.groupe" required>
              <option value="Famille">Famille</option>
              <option value="Amis">Amis</option>
              <option value="Collègues">Collègues</option>
              <option value="Autres">Autres</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="deleteModal" class="modal-overlay" @click.self="deleteModal = null">
      <div class="modal modal-small">
        <div class="modal-header">
          <h2>Confirmer la suppression</h2>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer <strong>{{ deleteModal.nom }} {{ deleteModal.prenom }}</strong> ?</p>
        </div>
        <div class="modal-footer">
          <button @click="deleteModal = null" class="btn-cancel">Annuler</button>
          <button @click="deleteInvite" class="btn-delete">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInviteStore } from '../stores/inviteStore';

const inviteStore = useInviteStore();
const showModal = ref(false);
const editMode = ref(false);
const selectedGroup = ref('Tous');
const deleteModal = ref(null);

const form = ref({
  nom: '',
  prenom: '',
  telephone: '',
  groupe: 'Famille'
});

const filteredInvites = computed(() => {
  if (selectedGroup.value === 'Tous') return inviteStore.invites;
  return inviteStore.invitesByGroup(selectedGroup.value);
});

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
  form.value = { nom: '', prenom: '', telephone: '', groupe: 'Famille' };
};

const editInvite = (invite) => {
  editMode.value = true;
  form.value = { ...invite };
  showModal.value = true;
};

const saveInvite = async () => {
  try {
    if (editMode.value) {
      await inviteStore.updateInvite(form.value.id, form.value);
    } else {
      await inviteStore.addInvite(form.value);
    }
    closeModal();
  } catch (error) {
    alert('Erreur lors de l\'enregistrement');
  }
};

const confirmDelete = (invite) => {
  deleteModal.value = invite;
};

const deleteInvite = async () => {
  try {
    await inviteStore.deleteInvite(deleteModal.value.id);
    deleteModal.value = null;
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
};

onMounted(() => {
  inviteStore.fetchInvites();
});
</script>

<style scoped>
.invites-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
  color: #2c3e50;
  font-size: 1.5rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #5a6268;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
}

.stat-card.total { border-color: #667eea; }
.stat-card.famille { border-color: #f5576c; }
.stat-card.amis { border-color: #43cea2; }
.stat-card.collegues { border-color: #f093fb; }

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  color: #6c757d;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-btn:hover {
  border-color: #667eea;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
}

.invites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.invite-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.invite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.invite-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.invite-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.invite-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.famille { background: #fee; color: #f5576c; }
.badge.amis { background: #e8f8f5; color: #43cea2; }
.badge.collègues { background: #f3e5f5; color: #f093fb; }
.badge.autres { background: #e3f2fd; color: #2196f3; }

.invite-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.invite-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.btn-edit {
  background: #e3f2fd;
  color: #2196f3;
}

.btn-edit:hover {
  background: #2196f3;
  color: white;
}

.btn-delete {
  background: #fee;
  color: #e74c3c;
}

.btn-delete:hover {
  background: #e74c3c;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-small {
  max-width: 400px;
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

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
}

.modal-body {
  padding: 2rem;
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
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel {
  background: #e9ecef;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }

  .container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .invites-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
