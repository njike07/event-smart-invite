<template>
  <div class="table-plan-container">
  <button @click="$router.push('/dashboard-admin')" class="btn-back">
          ← Retour
        </button>
    <div class="table-plan-header">
      <h1>🪑 Plan de Tables</h1>
      <p>Organisez la disposition de votre salle</p>
      
    </div>

    <div class="table-plan-actions">
      <button @click="showAddTable = true" class="btn-add-table">
        ➕ Ajouter une table
      </button>
      <button @click="showQRScanner = true" class="btn-qr-scanner">
        📱 Scanner QR invité
      </button>
      <button @click="autoAssign" class="btn-auto-assign">
        🎯 Attribution automatique
      </button>
    </div>

    <div class="table-plan-layout">
      <div class="room-layout">
        <div class="stage">🎭 Scène</div>
        <div class="tables-grid">
          <div 
            v-for="table in tables" 
            :key="table.id"
            class="table-item"
            :class="{ selected: selectedTable?.id === table.id }"
            @click="selectTable(table)"
            :style="{ 
              gridColumn: table.position.x, 
              gridRow: table.position.y,
              '--seats': table.seats 
            }"
          >
            <div class="table-circle">
              <span class="table-number">{{ table.number }}</span>
              <div class="seats-indicator">
                <div 
                  v-for="seat in table.seats" 
                  :key="seat"
                  class="seat"
                  :class="{ occupied: getSeatGuest(table.id, seat) }"
                ></div>
              </div>
            </div>
            <div class="table-info">
              <span>{{ table.assignedGuests.length }}/{{ table.seats }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-details" v-if="selectedTable">
      <h3>Table {{ selectedTable.number }} - {{ selectedTable.name }}</h3>
      <div class="table-management">
        <div class="assigned-guests">
          <h4>Invités assignés ({{ selectedTable.assignedGuests.length }}/{{ selectedTable.seats }})</h4>
          <div class="guest-list">
            <div v-for="guest in selectedTable.assignedGuests" :key="guest.id" class="guest-item">
              <span>{{ guest.nom }} {{ guest.prenom }}</span>
              <button @click="removeFromTable(guest.id)" class="btn-remove">❌</button>
            </div>
          </div>
        </div>
        
        <div class="available-guests">
          <h4>Invités disponibles</h4>
          <div class="guest-search">
            <input v-model="guestSearch" placeholder="Rechercher un invité..." />
          </div>
          <div class="guest-list">
            <div v-for="guest in filteredAvailableGuests" :key="guest.id" class="guest-item">
              <span>{{ guest.nom }} {{ guest.prenom }}</span>
              <button @click="assignToTable(guest.id)" class="btn-assign">➕</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Table Modal -->
    <div v-if="showAddTable" class="modal-overlay" @click="showAddTable = false">
      <div class="modal-content" @click.stop>
        <h2>Ajouter une table</h2>
        <form @submit.prevent="addTable">
          <div class="form-group">
            <label>Numéro de table</label>
            <input v-model="newTable.number" type="number" required />
          </div>
          <div class="form-group">
            <label>Nom de la table</label>
            <input v-model="newTable.name" placeholder="Ex: Famille, Amis..." />
          </div>
          <div class="form-group">
            <label>Nombre de places</label>
            <input v-model="newTable.seats" type="number" min="2" max="12" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showAddTable = false" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">Ajouter</button>
          </div>
        </form>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div v-if="showQRScanner" class="modal-overlay" @click="showQRScanner = false">
      <div class="modal-content qr-scanner" @click.stop>
        <h2>Scanner QR Code Invité</h2>
        <div class="qr-scanner-area">
          <div class="scanner-placeholder">
            📱 Placez le QR code devant la caméra
          </div>
          <input v-model="qrCode" placeholder="Ou saisissez le code manuellement" />
          <button @click="findGuestByQR" class="btn-find">🔍 Localiser</button>
        </div>
        
        <div v-if="foundGuest" class="guest-location">
          <h3>Invité trouvé !</h3>
          <div class="guest-info">
            <p><strong>{{ foundGuest.nom }} {{ foundGuest.prenom }}</strong></p>
            <p>📍 Table {{ foundGuest.tableNumber }} - {{ foundGuest.tableName }}</p>
            <p>🪑 Place {{ foundGuest.seatNumber }}</p>
          </div>
        </div>
        
        <button @click="showQRScanner = false" class="btn-close">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const tables = ref([
  { 
    id: 1, 
    number: 1, 
    name: 'Famille mariés', 
    seats: 8, 
    position: { x: 2, y: 2 },
    assignedGuests: [
      { id: 1, nom: 'Mme Njike', prenom: 'Claudine' },
      { id: 2, nom: 'Mr Njike', prenom: 'Claude' }
    ]
  },
  { 
    id: 2, 
    number: 2, 
    name: 'Amis proches', 
    seats: 6, 
    position: { x: 4, y: 2 },
    assignedGuests: [
      { id: 3, nom: 'Felix', prenom: 'collette' }
    ]
  },
  { 
    id: 3, 
    number: 3, 
    name: 'Collègues', 
    seats: 8, 
    position: { x: 2, y: 4 },
    assignedGuests: []
  }
]);

const availableGuests = ref([
  { id: 4, nom: 'Kiki', prenom: 'Nana' },
  { id: 5, nom: 'Nana', prenom: 'Hypolithe' },
  { id: 6, nom: 'Kegne', prenom: 'cindy' }
]);

const selectedTable = ref(null);
const showAddTable = ref(false);
const showQRScanner = ref(false);
const guestSearch = ref('');
const qrCode = ref('');
const foundGuest = ref(null);

const newTable = ref({
  number: '',
  name: '',
  seats: 6
});

const filteredAvailableGuests = computed(() => {
  return availableGuests.value.filter(guest => 
    `${guest.nom} ${guest.prenom}`.toLowerCase().includes(guestSearch.value.toLowerCase())
  );
});

const selectTable = (table) => {
  selectedTable.value = table;
};

const getSeatGuest = (tableId, seatNumber) => {
  const table = tables.value.find(t => t.id === tableId);
  return table?.assignedGuests[seatNumber - 1];
};

const assignToTable = (guestId) => {
  if (!selectedTable.value || selectedTable.value.assignedGuests.length >= selectedTable.value.seats) return;
  
  const guest = availableGuests.value.find(g => g.id === guestId);
  if (guest) {
    selectedTable.value.assignedGuests.push(guest);
    availableGuests.value = availableGuests.value.filter(g => g.id !== guestId);
  }
};

const removeFromTable = (guestId) => {
  if (!selectedTable.value) return;
  
  const guest = selectedTable.value.assignedGuests.find(g => g.id === guestId);
  if (guest) {
    selectedTable.value.assignedGuests = selectedTable.value.assignedGuests.filter(g => g.id !== guestId);
    availableGuests.value.push(guest);
  }
};

const addTable = () => {
  const newId = Math.max(...tables.value.map(t => t.id)) + 1;
  tables.value.push({
    id: newId,
    number: parseInt(newTable.value.number),
    name: newTable.value.name,
    seats: parseInt(newTable.value.seats),
    position: { x: 1, y: 1 },
    assignedGuests: []
  });
  
  newTable.value = { number: '', name: '', seats: 6 };
  showAddTable.value = false;
};

const autoAssign = () => {
  // Logique d'attribution automatique simple
  availableGuests.value.forEach(guest => {
    const availableTable = tables.value.find(t => t.assignedGuests.length < t.seats);
    if (availableTable) {
      availableTable.assignedGuests.push(guest);
    }
  });
  availableGuests.value = [];
};

const findGuestByQR = () => {
  // Simulation de recherche par QR code
  const allGuests = [
    ...tables.value.flatMap(table => 
      table.assignedGuests.map(guest => ({
        ...guest,
        tableNumber: table.number,
        tableName: table.name,
        seatNumber: table.assignedGuests.indexOf(guest) + 1
      }))
    )
  ];
  
  foundGuest.value = allGuests.find(g => 
    qrCode.value.includes(g.nom) || qrCode.value.includes(g.prenom)
  ) || {
    nom: 'Martin',
    prenom: 'Sophie',
    tableNumber: 2,
    tableName: 'Amis proches',
    seatNumber: 3
  };
};
</script>

<style scoped>
.table-plan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.table-plan-header {
  text-align: center;
  margin-bottom: 2rem;
}

.table-plan-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.table-plan-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-add-table, .btn-qr-scanner, .btn-auto-assign {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-table {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-qr-scanner {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-auto-assign {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  color: white;
}

.room-layout {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.stage {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 600;
  color: #2c3e50;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 100px);
  gap: 1rem;
  min-height: 400px;
}

.table-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.table-item.selected {
  transform: scale(1.1);
}

.table-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.table-number {
  font-weight: 600;
  font-size: 1.2rem;
}

.seats-indicator {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
}

.seat {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
}

.seat.occupied {
  background: #28a745;
}

.seat:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.seat:nth-child(2) { top: 25%; right: 0; }
.seat:nth-child(3) { top: 50%; right: 0; }
.seat:nth-child(4) { bottom: 25%; right: 0; }
.seat:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%); }
.seat:nth-child(6) { bottom: 25%; left: 0; }
.seat:nth-child(7) { top: 50%; left: 0; }
.seat:nth-child(8) { top: 25%; left: 0; }

.table-info {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
}

.table-details {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.table-management {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.guest-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

.guest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #f8f9fa;
}

.btn-remove, .btn-assign {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-remove {
  background: #dc3545;
  color: white;
}

.btn-assign {
  background: #28a745;
  color: white;
}

.guest-search input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.qr-scanner {
  text-align: center;
}

.scanner-placeholder {
  background: #f8f9fa;
  padding: 3rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 1.2rem;
  color: #6c757d;
}

.guest-location {
  background: #d4edda;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-save, .btn-find, .btn-close {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-save, .btn-find {
  background: #28a745;
  color: white;
}

.btn-close {
  background: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .table-plan-container {
    padding: 1rem;
  }
  
  .table-management {
    grid-template-columns: 1fr;
  }
  
  .tables-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .table-plan-actions {
    flex-direction: column;
  }
}
</style>