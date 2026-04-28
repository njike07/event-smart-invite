<template>
  <div class="invitations-page">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">🎫</span>
        <h2>Génération d'Invitations</h2>
      </div>
      <div class="nav-actions">
        <button @click="generateAll" class="btn-generate" :disabled="loading">
          <span>⚡</span> Générer toutes les invitations
        </button>
        <button @click="$router.push('/dashboard-admin')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="stats-section">
        <div class="stat-card total">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ invitations.length }}</h3>
            <p>Total invitations</p>
          </div>
        </div>
        <div class="stat-card generated">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ generatedCount }}</h3>
            <p>Générées</p>
          </div>
        </div>
        <div class="stat-card sent">
          <div class="stat-icon">📤</div>
          <div class="stat-info">
            <h3>{{ sentCount }}</h3>
            <p>Envoyées</p>
          </div>
        </div>
        <div class="stat-card confirmed">
          <div class="stat-icon">💚</div>
          <div class="stat-info">
            <h3>{{ confirmedCount }}</h3>
            <p>Confirmées</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <button 
          v-for="status in ['Tous', 'Générées', 'Envoyées', 'Confirmées', 'En attente']" 
          :key="status"
          @click="selectedStatus = status"
          :class="['filter-btn', { active: selectedStatus === status }]"
        >
          {{ status }}
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Génération en cours...</p>
      </div>

      <div v-else-if="filteredInvitations.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucune invitation</h3>
        <p>Commencez par ajouter des invités dans la gestion des invités</p>
        <button @click="$router.push('/invites')" class="btn-add-invites">
          Gérer les invités
        </button>
      </div>

      <div v-else class="invitations-grid">
        <div v-for="invitation in filteredInvitations" :key="invitation.id" class="invitation-card">
          <div class="card-header">
            <div class="invite-info">
              <h3>{{ invitation.nom }} {{ invitation.prenom }}</h3>
              <span :class="['status-badge', invitation.statut?.toLowerCase()]">
                {{ invitation.statut || 'En attente' }}
              </span>
            </div>
            <div class="qr-code" v-if="invitation.qr_code">
              <img :src="invitation.qr_code" alt="QR Code" />
            </div>
          </div>

          <div class="card-body">
            <div class="detail-item">
              <span class="icon">📱</span>
              <span>{{ invitation.telephone }}</span>
            </div>
            <div class="detail-item">
              <span class="icon">📧</span>
              <span>{{ invitation.email }}</span>
            </div>
            <div class="detail-item" v-if="invitation.lien_unique">
              <span class="icon">🔗</span>
              <span class="link">{{ invitation.lien_unique }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button 
              v-if="!invitation.qr_code" 
              @click="generateInvitation(invitation)" 
              class="btn-generate-single"
              :disabled="loading"
            >
              🎫 Générer
            </button>
            <button 
              v-if="invitation.qr_code && !invitation.date_envoi" 
              @click="sendInvitation(invitation)" 
              class="btn-send"
            >
              📤 Envoyer
            </button>
            <button 
              v-if="invitation.lien_unique" 
              @click="previewInvitation(invitation)" 
              class="btn-preview"
            >
              👁️ Aperçu
            </button>
            <button 
              v-if="invitation.qr_code" 
              @click="downloadQR(invitation)" 
              class="btn-download"
            >
              💾 QR Code
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'aperçu -->
    <div v-if="previewModal" class="modal-overlay" @click.self="previewModal = null">
      <div class="modal preview-modal">
        <div class="modal-header">
          <h2>Aperçu de l'invitation</h2>
          <button @click="previewModal = null" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="invitation-preview">
            <div class="preview-header">
              <h1>💍 Vous êtes invité(e) !</h1>
              <h2>{{ previewModal.nom }} {{ previewModal.prenom }}</h2>
            </div>
            <div class="preview-qr">
              <img :src="previewModal.qr_code" alt="QR Code" />
              <p>Présentez ce QR code le jour J</p>
            </div>
            <div class="preview-actions">
              <button class="btn-rsvp yes">✅ Je serai là</button>
              <button class="btn-rsvp no">❌ Je ne pourrai pas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false);
const selectedStatus = ref('Tous');
const previewModal = ref(null);

// Données simulées (à remplacer par l'API)
const invitations = ref([
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: '0612345678',
    email: 'jean.dupont@email.com',
    groupe: 'Famille',
    statut: 'Générée',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    lien_unique: 'https://app.com/rsvp/abc123',
    date_envoi: null,
    rsvp: null
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Marie',
    telephone: '0687654321',
    email: 'marie.martin@email.com',
    groupe: 'Amis',
    statut: 'Envoyée',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    lien_unique: 'https://app.com/rsvp/def456',
    date_envoi: '2024-01-15',
    rsvp: 'Oui'
  }
]);

const filteredInvitations = computed(() => {
  if (selectedStatus.value === 'Tous') return invitations.value;
  return invitations.value.filter(inv => inv.statut === selectedStatus.value);
});

const generatedCount = computed(() => 
  invitations.value.filter(inv => inv.qr_code).length
);

const sentCount = computed(() => 
  invitations.value.filter(inv => inv.date_envoi).length
);

const confirmedCount = computed(() => 
  invitations.value.filter(inv => inv.rsvp === 'Oui').length
);

const generateAll = async () => {
  loading.value = true;
  // Simulation de génération
  setTimeout(() => {
    invitations.value.forEach(inv => {
      if (!inv.qr_code) {
        inv.qr_code = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        inv.lien_unique = `https://app.com/rsvp/${Math.random().toString(36).substr(2, 9)}`;
        inv.statut = 'Générée';
      }
    });
    loading.value = false;
  }, 2000);
};

const generateInvitation = (invitation) => {
  invitation.qr_code = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  invitation.lien_unique = `https://app.com/rsvp/${Math.random().toString(36).substr(2, 9)}`;
  invitation.statut = 'Générée';
};

const sendInvitation = (invitation) => {
  invitation.date_envoi = new Date().toISOString().split('T')[0];
  invitation.statut = 'Envoyée';
  alert(`Invitation envoyée à ${invitation.nom} ${invitation.prenom}`);
};

const previewInvitation = (invitation) => {
  previewModal.value = invitation;
};

const downloadQR = (invitation) => {
  const link = document.createElement('a');
  link.href = invitation.qr_code;
  link.download = `qr-${invitation.nom}-${invitation.prenom}.png`;
  link.click();
};

onMounted(() => {
  // Charger les invitations depuis l'API
});
</script>

<style scoped>
.invitations-page {
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

.btn-generate {
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

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.stats-section {
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
.stat-card.generated { border-color: #28a745; }
.stat-card.sent { border-color: #17a2b8; }
.stat-card.confirmed { border-color: #20c997; }

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
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  margin-bottom: 2rem;
}

.btn-add-invites {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add-invites:hover {
  background: #5568d3;
}

.invitations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.invitation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.invitation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.invite-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.générée { background: #d4edda; color: #155724; }
.status-badge.envoyée { background: #d1ecf1; color: #0c5460; }
.status-badge.confirmée { background: #d1f2eb; color: #0a3622; }
.status-badge.en_attente { background: #fff3cd; color: #856404; }

.qr-code {
  width: 60px;
  height: 60px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
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

.link {
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-actions button {
  flex: 1;
  min-width: 80px;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-generate-single {
  background: #667eea;
  color: white;
}

.btn-generate-single:hover {
  background: #5568d3;
}

.btn-send {
  background: #17a2b8;
  color: white;
}

.btn-send:hover {
  background: #138496;
}

.btn-preview {
  background: #6f42c1;
  color: white;
}

.btn-preview:hover {
  background: #5a2d91;
}

.btn-download {
  background: #28a745;
  color: white;
}

.btn-download:hover {
  background: #218838;
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.preview-modal {
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

.invitation-preview {
  text-align: center;
}

.preview-header h1 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.preview-header h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.preview-qr {
  margin-bottom: 2rem;
}

.preview-qr img {
  width: 150px;
  height: 150px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.btn-rsvp {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-rsvp.yes {
  background: #28a745;
  color: white;
}

.btn-rsvp.no {
  background: #dc3545;
  color: white;
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

  .stats-section {
    grid-template-columns: 1fr 1fr;
  }

  .invitations-grid {
    grid-template-columns: 1fr;
  }

  .preview-actions {
    flex-direction: column;
  }
}
</style>