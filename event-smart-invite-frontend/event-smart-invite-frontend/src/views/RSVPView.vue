<template>
  <div class="rsvp-page">
    <div class="rsvp-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de votre invitation...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h2>Invitation non trouvée</h2>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="invite" class="invitation-card">
        <div class="card-header">
          <div class="wedding-rings">💍</div>
          <h1>Vous êtes invité(e) !</h1>
          <div class="couple-names">
            <h2>{{ invite.marie_nom || 'Marie' }} & {{ invite.marie_prenom || 'Jean' }}</h2>
          </div>
        </div>

        <div class="invite-details">
          <div class="guest-info">
            <h3>Cher(e) {{ invite.nom }} {{ invite.prenom }},</h3>
            <p>Nous avons l'honneur de vous inviter à célébrer notre union !</p>
          </div>

          <div class="event-info">
            <div class="info-item">
              <span class="icon">📅</span>
              <div>
                <strong>Date</strong>
                <p>{{ formatDate(invite.date_evenement) }}</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">🕐</span>
              <div>
                <strong>Heure</strong>
                <p>{{ invite.heure_evenement || '14h00' }}</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">📍</span>
              <div>
                <strong>Lieu</strong>
                <p>{{ invite.lieu_evenement || 'Château de Versailles' }}</p>
              </div>
            </div>
          </div>

          <div class="qr-section">
            <h4>Votre QR Code personnel</h4>
            <div class="qr-code">
              <img :src="invite.qr_code" alt="QR Code" />
            </div>
            <p class="qr-instruction">Présentez ce code le jour J pour confirmer votre présence</p>
          </div>
        </div>

        <div class="rsvp-section" v-if="!invite.rsvp">
          <h3>Confirmez-vous votre présence ?</h3>
          <div class="rsvp-buttons">
            <button @click="confirmRSVP('Oui')" class="btn-rsvp yes" :disabled="submitting">
              <span class="icon">✅</span>
              <span>Oui, je serai là !</span>
            </button>
            <button @click="confirmRSVP('Non')" class="btn-rsvp no" :disabled="submitting">
              <span class="icon">❌</span>
              <span>Non, je ne pourrai pas</span>
            </button>
          </div>
        </div>

        <div v-else class="rsvp-confirmed">
          <div :class="['confirmation-badge', invite.rsvp.toLowerCase()]">
            <span v-if="invite.rsvp === 'Oui'">✅ Présence confirmée</span>
            <span v-else>❌ Absence confirmée</span>
          </div>
          <p v-if="invite.rsvp === 'Oui'">
            Merci ! Nous avons hâte de vous voir le jour J 🎉
          </p>
          <p v-else>
            Nous sommes désolés que vous ne puissiez pas être présent(e) 😢
          </p>
          
          <button @click="changeRSVP" class="btn-change">
            Modifier ma réponse
          </button>
        </div>

        <div v-if="invite.rsvp === 'Oui'" class="additional-info">
          <div class="info-card">
            <h4>📸 Photos & Vidéos</h4>
            <p>Les photos et vidéos de l'événement seront disponibles ici le jour J !</p>
          </div>
          
          <div class="info-card">
            <h4>📖 Livre d'or</h4>
            <p>N'hésitez pas à laisser un message dans notre livre d'or numérique.</p>
          </div>
          
          <div class="info-card">
            <h4>🎁 Liste de cadeaux</h4>
            <p>Consultez notre wishlist pour nous faire plaisir.</p>
            <button @click="viewWishlist" class="btn-wishlist">
              Voir la wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const submitting = ref(false);

// Données simulées (à remplacer par l'API)
const invite = ref({
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  telephone: '0612345678',
  email: 'jean.dupont@email.com',
  groupe: 'Famille',
  qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  rsvp: null, // 'Oui', 'Non' ou null
  date_evenement: '2024-06-15',
  heure_evenement: '14h00',
  lieu_evenement: 'Château de Versailles',
  marie_nom: 'Sophie',
  marie_prenom: 'Pierre'
});

const formatDate = (dateStr) => {
  if (!dateStr) return 'À définir';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const confirmRSVP = async (response) => {
  submitting.value = true;
  
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    invite.value.rsvp = response;
    
    // Ici on appellerait l'API backend
    // await rsvpService.updateRSVP(route.params.code, response);
    
  } catch (err) {
    error.value = 'Erreur lors de la confirmation';
  } finally {
    submitting.value = false;
  }
};

const changeRSVP = () => {
  invite.value.rsvp = null;
};

const viewWishlist = () => {
  // Redirection vers la wishlist
  alert('Redirection vers la wishlist');
};

onMounted(async () => {
  try {
    // Simulation de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ici on chargerait les données depuis l'API
    // const response = await rsvpService.getInviteByCode(route.params.code);
    // invite.value = response.data;
    
    loading.value = false;
  } catch (err) {
    error.value = 'Invitation non trouvée ou expirée';
    loading.value = false;
  }
});
</script>

<style scoped>
.rsvp-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.rsvp-container {
  width: 100%;
  max-width: 600px;
}

.loading-state,
.error-state {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
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

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.invitation-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.wedding-rings {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.card-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.couple-names h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
  opacity: 0.95;
}

.invite-details {
  padding: 2rem;
}

.guest-info {
  text-align: center;
  margin-bottom: 2rem;
}

.guest-info h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.guest-info p {
  color: #6c757d;
  font-size: 1.1rem;
}

.event-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.info-item strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.info-item p {
  margin: 0;
  color: #6c757d;
}

.qr-section {
  text-align: center;
  margin-bottom: 2rem;
}

.qr-section h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.qr-code {
  display: inline-block;
  padding: 1rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.qr-code img {
  width: 150px;
  height: 150px;
  display: block;
}

.qr-instruction {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.rsvp-section {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.rsvp-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.rsvp-buttons {
  display: flex;
  gap: 1rem;
}

.btn-rsvp {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-rsvp:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-rsvp.yes {
  background: #28a745;
  color: white;
}

.btn-rsvp.yes:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-rsvp.no {
  background: #dc3545;
  color: white;
}

.btn-rsvp.no:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-rsvp .icon {
  font-size: 2rem;
}

.rsvp-confirmed {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.confirmation-badge {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.confirmation-badge.oui {
  background: #d4edda;
  color: #155724;
}

.confirmation-badge.non {
  background: #f8d7da;
  color: #721c24;
}

.btn-change {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-change:hover {
  background: #5a6268;
}

.additional-info {
  padding: 0 2rem 2rem;
}

.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
}

.info-card h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.info-card p {
  margin: 0 0 1rem 0;
  color: #6c757d;
}

.btn-wishlist {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-wishlist:hover {
  background: #5568d3;
}

@media (max-width: 768px) {
  .rsvp-page {
    padding: 0.5rem;
  }
  
  .card-header {
    padding: 2rem 1.5rem;
  }
  
  .card-header h1 {
    font-size: 2rem;
  }
  
  .couple-names h2 {
    font-size: 1.5rem;
  }
  
  .invite-details {
    padding: 1.5rem;
  }
  
  .rsvp-buttons {
    flex-direction: column;
  }
  
  .qr-code img {
    width: 120px;
    height: 120px;
  }
}
</style>