<template>
  <div class="timeline-public-container">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📅</span>
        <h2>Programme du Mariage</h2>
      </div>
      <div class="nav-actions">
        <button @click="$router.push('/dashboard-marie')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="timeline-header">
      <h1>📅 Programme du Mariage</h1>
      <p class="couple-names">Marie & Pierre</p>
      <p class="wedding-date">Samedi 15 Juin 2024</p>
    </div>

    <div class="timeline-public">
      <div v-for="event in sortedEvents" :key="event.id" class="timeline-event">
        <div class="event-time">
          <div class="time-circle">
            <span>{{ formatTime(event.time) }}</span>
          </div>
          <div class="time-line" v-if="!isLastEvent(event)"></div>
        </div>
        <div class="event-content">
          <div class="event-card">
            <div class="event-icon">{{ event.icon }}</div>
            <div class="event-details">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
              <div v-if="event.location" class="event-location">
                📍 {{ event.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-footer">
      <div class="info-card">
        <h3>📍 Informations pratiques</h3>
        <div class="info-item">
          <strong>Dress code :</strong> Tenue de soirée
        </div>
        <div class="info-item">
          <strong>Parking :</strong> Disponible sur place
        </div>
        <div class="info-item">
          <strong>Contact :</strong> 06 12 34 56 78
        </div>
      </div>
      
      <div class="actions">
        <button @click="addToCalendar" class="btn-calendar">
          📅 Ajouter au calendrier
        </button>
        <button @click="shareTimeline" class="btn-share">
          📤 Partager
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const events = ref([
  { id: 1, title: 'Cérémonie civile', time: '14:00', description: 'Échange des vœux à la mairie', location: 'Mairie du 16ème', icon: '💒' },
  { id: 2, title: 'Cocktail', time: '16:00', description: 'Apéritif avec les invités', location: 'Jardin du château', icon: '🥂' },
  { id: 3, title: 'Photos de groupe', time: '17:30', description: 'Séance photo avec tous les invités', location: 'Parc du château', icon: '📸' },
  { id: 4, title: 'Dîner', time: '19:30', description: 'Repas de mariage', location: 'Salle de réception', icon: '🍽️' },
  { id: 5, title: 'Ouverture du bal', time: '22:00', description: 'Première danse des mariés', location: 'Piste de danse', icon: '💃' },
  { id: 6, title: 'Soirée dansante', time: '22:30', description: 'Fête jusqu\'au bout de la nuit !', location: 'Salle de réception', icon: '🎉' }
]);

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => a.time.localeCompare(b.time));
});

const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const isLastEvent = (event) => {
  const sorted = sortedEvents.value;
  return sorted[sorted.length - 1].id === event.id;
};

const addToCalendar = () => {
  const startDate = '20240615T140000Z';
  const endDate = '20240616T020000Z';
  const title = 'Mariage Romarique & Pierre';
  const details = 'Programme complet du mariage';
  const location = 'Banquet du tagidor';
  
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  
  window.open(googleUrl, '_blank');
};

const shareTimeline = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Programme du Mariage - Romarique & Pierre',
      text: 'Découvrez le programme de notre mariage !',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié dans le presse-papier !');
  }
};
</script>

<style scoped>
.timeline-public-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
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
  align-items: center;
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

.timeline-header {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.timeline-public {
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
}

.timeline-header h1 {
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

.wedding-date {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

.timeline-public {
  margin-bottom: 2rem;
}

.timeline-event {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
}

.time-circle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  z-index: 2;
  position: relative;
}

.time-line {
  width: 3px;
  height: 60px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
  margin-top: 10px;
  border-radius: 2px;
}

.event-content {
  flex: 1;
}

.event-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

.event-icon {
  font-size: 2rem;
  margin-top: 0.25rem;
}

.event-details h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.event-details p {
  color: #6c757d;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.event-location {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
}

.timeline-footer {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.timeline-footer .info-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.info-item {
  margin-bottom: 0.75rem;
  color: #6c757d;
}

.info-item strong {
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-calendar, .btn-share {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-calendar {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-share {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-calendar:hover, .btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .timeline-public-container {
    padding: 1rem 0.5rem;
  }
  
  .timeline-header {
    padding: 1.5rem;
  }
  
  .timeline-header h1 {
    font-size: 1.5rem;
  }
  
  .couple-names {
    font-size: 1.2rem;
  }
  
  .time-circle {
    width: 60px;
    height: 60px;
    font-size: 0.8rem;
  }
  
  .event-card {
    padding: 1rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>