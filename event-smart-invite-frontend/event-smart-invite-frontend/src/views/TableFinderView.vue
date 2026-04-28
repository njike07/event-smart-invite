<template>
  <div class="table-finder-container">
    <div class="finder-header">
      <h1>🔍 Trouvez votre table</h1>
      <p class="couple-names">Mariage Marie & Pierre</p>
      <p class="subtitle">Scannez votre QR code ou recherchez votre nom</p>
    </div>

    <div class="finder-methods">
      <div class="method-card qr-method">
        <div class="method-icon">📱</div>
        <h3>Scanner QR Code</h3>
        <p>Utilisez le QR code de votre invitation</p>
        <button @click="showQRScanner = true" class="btn-qr">
          📷 Ouvrir le scanner
        </button>
      </div>

      <div class="method-card search-method">
        <div class="method-icon">🔍</div>
        <h3>Recherche par nom</h3>
        <p>Saisissez votre nom et prénom</p>
        <div class="search-form">
          <input 
            v-model="searchName" 
            placeholder="Votre nom complet"
            @input="searchGuest"
          />
          <button @click="searchGuest" class="btn-search">
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="foundGuest" class="result-card">
      <div class="result-header">
        <div class="success-icon">✅</div>
        <h2>Table trouvée !</h2>
      </div>
      
      <div class="guest-info">
        <h3>{{ foundGuest.nom }} {{ foundGuest.prenom }}</h3>
        <div class="table-details">
          <div class="table-visual">
            <div class="table-circle">
              <span class="table-number">{{ foundGuest.tableNumber }}</span>
              <div class="seat-highlight" :style="{ transform: `rotate(${(foundGuest.seatNumber - 1) * 45}deg)` }">
                <div class="your-seat">Vous</div>
              </div>
            </div>
          </div>
          
          <div class="table-info">
            <p><strong>📍 Table {{ foundGuest.tableNumber }}</strong></p>
            <p>{{ foundGuest.tableName }}</p>
            <p>🪑 Place {{ foundGuest.seatNumber }}</p>
            <p>👥 {{ foundGuest.tableGuests.length }} personnes à cette table</p>
          </div>
        </div>
      </div>

      <div class="table-companions">
        <h4>Vos compagnons de table :</h4>
        <div class="companions-list">
          <div v-for="companion in foundGuest.tableGuests" :key="companion.id" class="companion-item">
            <div class="companion-avatar">{{ companion.nom.charAt(0) }}</div>
            <span>{{ companion.nom }} {{ companion.prenom }}</span>
          </div>
        </div>
      </div>

      <div class="navigation-help">
        <h4>🗺️ Comment s'y rendre :</h4>
        <div class="room-mini-map">
          <div class="mini-stage">Scène</div>
          <div class="mini-tables">
            <div 
              v-for="table in allTables" 
              :key="table.id"
              class="mini-table"
              :class="{ highlighted: table.number === foundGuest.tableNumber }"
            >
              {{ table.number }}
            </div>
          </div>
          <div class="mini-entrance">Entrée</div>
        </div>
        <p class="direction-text">
          Votre table est {{ getDirectionText(foundGuest.tableNumber) }}
        </p>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div v-if="showQRScanner" class="modal-overlay" @click="showQRScanner = false">
      <div class="modal-content qr-scanner" @click.stop>
        <h2>📱 Scanner QR Code</h2>
        <div class="scanner-area">
          <div class="scanner-frame">
            <div class="scanner-line"></div>
            <p>Placez le QR code dans le cadre</p>
          </div>
          
          <div class="manual-input">
            <p>Ou saisissez le code manuellement :</p>
            <input v-model="qrCode" placeholder="Code de votre invitation" />
            <button @click="processQRCode" class="btn-process">
              Valider
            </button>
          </div>
        </div>
        
        <button @click="showQRScanner = false" class="btn-close">
          Fermer
        </button>
      </div>
    </div>

    <!-- No Result -->
    <div v-if="searchAttempted && !foundGuest" class="no-result">
      <div class="no-result-icon">❌</div>
      <h3>Aucun résultat trouvé</h3>
      <p>Vérifiez l'orthographe de votre nom ou contactez les organisateurs</p>
      <p>📞 Contact : 06 12 34 56 78</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchName = ref('');
const qrCode = ref('');
const foundGuest = ref(null);
const showQRScanner = ref(false);
const searchAttempted = ref(false);

// Données simulées
const guestDatabase = [
  {
    id: 1,
    nom: 'Martin',
    prenom: 'Sophie',
    tableNumber: 2,
    tableName: 'Amis proches',
    seatNumber: 3,
    qrCode: 'QR123456',
    tableGuests: [
      { id: 2, nom: 'Dupont', prenom: 'Jean' },
      { id: 3, nom: 'Leroy', prenom: 'Claire' },
      { id: 4, nom: 'Bernard', prenom: 'Paul' }
    ]
  },
  {
    id: 5,
    nom: 'Dubois',
    prenom: 'Marie',
    tableNumber: 1,
    tableName: 'Famille',
    seatNumber: 1,
    qrCode: 'QR789012',
    tableGuests: [
      { id: 6, nom: 'Dubois', prenom: 'Pierre' },
      { id: 7, nom: 'Moreau', prenom: 'Anne' }
    ]
  }
];

const allTables = ref([
  { id: 1, number: 1, position: 'avant-gauche' },
  { id: 2, number: 2, position: 'avant-droite' },
  { id: 3, number: 3, position: 'centre-gauche' },
  { id: 4, number: 4, position: 'centre-droite' },
  { id: 5, number: 5, position: 'arriere-gauche' },
  { id: 6, number: 6, position: 'arriere-droite' }
]);

const searchGuest = () => {
  searchAttempted.value = true;
  foundGuest.value = guestDatabase.find(guest => 
    `${guest.nom} ${guest.prenom}`.toLowerCase().includes(searchName.value.toLowerCase()) ||
    `${guest.prenom} ${guest.nom}`.toLowerCase().includes(searchName.value.toLowerCase())
  );
};

const processQRCode = () => {
  searchAttempted.value = true;
  foundGuest.value = guestDatabase.find(guest => 
    guest.qrCode === qrCode.value || 
    qrCode.value.includes(guest.nom) ||
    qrCode.value.includes(guest.prenom)
  );
  showQRScanner.value = false;
};

const getDirectionText = (tableNumber) => {
  const directions = {
    1: 'à l\'avant à gauche, près de la scène',
    2: 'à l\'avant à droite, près de la scène',
    3: 'au centre à gauche',
    4: 'au centre à droite',
    5: 'à l\'arrière à gauche',
    6: 'à l\'arrière à droite'
  };
  return directions[tableNumber] || 'dans la salle';
};
</script>

<style scoped>
.table-finder-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.finder-header {
  text-align: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.finder-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.couple-names {
  font-size: 1.5rem;
  color: #e74c3c;
  font-weight: 600;
  margin: 0.5rem 0;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
}

.finder-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.method-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
}

.method-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.method-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.method-card p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.btn-qr, .btn-search {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-qr {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  width: 100%;
}

.search-form {
  display: flex;
  gap: 0.5rem;
}

.search-form input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.result-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.result-header h2 {
  color: #28a745;
  margin: 0;
}

.guest-info h3 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.table-details {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.table-visual {
  position: relative;
}

.table-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  position: relative;
}

.seat-highlight {
  position: absolute;
  top: -15px;
  left: 50%;
  transform-origin: 50px 65px;
}

.your-seat {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.table-info p {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.table-companions h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.companions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.companion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e9ecef;
  border-radius: 20px;
}

.companion-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.navigation-help {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #e8f5e8;
  border-radius: 12px;
}

.navigation-help h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.room-mini-map {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  position: relative;
  height: 150px;
}

.mini-stage {
  background: #ffd700;
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.mini-tables {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mini-table {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.mini-table.highlighted {
  background: #28a745;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.mini-entrance {
  background: #6c757d;
  color: white;
  padding: 0.25rem;
  text-align: center;
  border-radius: 4px;
  font-size: 0.7rem;
}

.direction-text {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
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
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
}

.scanner-area {
  text-align: center;
}

.scanner-frame {
  background: #f8f9fa;
  border: 3px dashed #667eea;
  border-radius: 12px;
  padding: 3rem;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #667eea;
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(200px); }
}

.manual-input {
  margin-top: 2rem;
}

.manual-input input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin: 1rem 0;
  box-sizing: border-box;
}

.btn-process, .btn-close {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 0.5rem;
}

.btn-process {
  background: #28a745;
  color: white;
}

.btn-close {
  background: #dc3545;
  color: white;
}

.no-result {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
}

.no-result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-result h3 {
  color: #dc3545;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .table-finder-container {
    padding: 1rem 0.5rem;
  }
  
  .finder-methods {
    grid-template-columns: 1fr;
  }
  
  .table-details {
    flex-direction: column;
    text-align: center;
  }
  
  .search-form {
    flex-direction: column;
  }
}
</style>