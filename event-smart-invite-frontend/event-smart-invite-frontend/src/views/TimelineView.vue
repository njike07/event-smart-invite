<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h1>📅 Planning du Mariage</h1>
      <p>Organisez votre journée parfaite</p>
    </div>

    <div class="timeline-content">
      <div class="timeline-actions">
        <button @click="showAddModal = true" class="btn-add">
          ➕ Ajouter un événement
        </button>
        <button @click="shareTimeline" class="btn-share">
          📤 Partager le planning
        </button>
      </div>

      <div class="timeline-list">
        <div v-for="event in sortedEvents" :key="event.id" class="timeline-item">
          <div class="timeline-time">{{ formatTime(event.time) }}</div>
          <div class="timeline-content-item">
            <div class="timeline-icon">{{ event.icon }}</div>
            <div class="timeline-details">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
              <span class="timeline-location" v-if="event.location">📍 {{ event.location }}</span>
            </div>
            <div class="timeline-actions-item">
              <button @click="editEvent(event)" class="btn-edit">✏️</button>
              <button @click="deleteEvent(event.id)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingEvent" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingEvent ? 'Modifier' : 'Ajouter' }} un événement</h2>
        <form @submit.prevent="saveEvent">
          <div class="form-group">
            <label>Titre</label>
            <input v-model="eventForm.title" required />
          </div>
          <div class="form-group">
            <label>Heure</label>
            <input v-model="eventForm.time" type="time" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="eventForm.description"></textarea>
          </div>
          <div class="form-group">
            <label>Lieu</label>
            <input v-model="eventForm.location" />
          </div>
          <div class="form-group">
            <label>Icône</label>
            <select v-model="eventForm.icon">
              <option value="💒">💒 Cérémonie</option>
              <option value="🥂">🥂 Cocktail</option>
              <option value="🍽️">🍽️ Repas</option>
              <option value="💃">💃 Danse</option>
              <option value="📸">📸 Photos</option>
              <option value="🎉">🎉 Fête</option>
              <option value="🚗">🚗 Transport</option>
              <option value="⭐">⭐ Autre</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">{{ editingEvent ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const events = ref([
  { id: 1, title: 'Cérémonie civile', time: '14:00', description: 'Échange des vœux à la mairie', location: 'Mairie du 16ème', icon: '💒' },
  { id: 2, title: 'Eglise', time: '16:00', description: 'Apéritif avec les invités', location: 'Jardin du château', icon: '🥂' },
  { id: 3, title: 'Dîner', time: '19:30', description: 'Repas de mariage', location: 'Salle de réception', icon: '🍽️' }
]);

const showAddModal = ref(false);
const editingEvent = ref(null);
const eventForm = ref({
  title: '',
  time: '',
  description: '',
  location: '',
  icon: '⭐'
});

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => a.time.localeCompare(b.time));
});

const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const editEvent = (event) => {
  editingEvent.value = event;
  eventForm.value = { ...event };
};

const deleteEvent = (id) => {
  if (confirm('Supprimer cet événement ?')) {
    events.value = events.value.filter(e => e.id !== id);
  }
};

const saveEvent = () => {
  if (editingEvent.value) {
    const index = events.value.findIndex(e => e.id === editingEvent.value.id);
    events.value[index] = { ...eventForm.value };
  } else {
    events.value.push({
      ...eventForm.value,
      id: Date.now()
    });
  }
  closeModal();
};

const closeModal = () => {
  showAddModal.value = false;
  editingEvent.value = null;
  eventForm.value = { title: '', time: '', description: '', location: '', icon: '⭐' };
};

const shareTimeline = () => {
  const url = `${window.location.origin}/timeline-public`;
  navigator.clipboard.writeText(url);
  alert('Lien copié ! Partagez le planning avec vos invités.');
};
</script>

<style scoped>
.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.timeline-header {
  text-align: center;
  margin-bottom: 2rem;
}

.timeline-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.timeline-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-add, .btn-share {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-share {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.timeline-item {
  display: flex;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.timeline-time {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  font-weight: 600;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-content-item {
  flex: 1;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.timeline-icon {
  font-size: 1.5rem;
}

.timeline-details {
  flex: 1;
}

.timeline-details h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.timeline-details p {
  margin: 0 0 0.25rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.timeline-location {
  font-size: 0.8rem;
  color: #28a745;
}

.timeline-actions-item {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #ffc107;
}

.btn-delete {
  background: #dc3545;
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
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-save {
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

.btn-save {
  background: linear-gradient(135def, #28a745 0%, #20c997 100%);
  color: white;
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-time {
    min-width: auto;
  }
  
  .timeline-actions {
    flex-direction: column;
  }
}
</style>