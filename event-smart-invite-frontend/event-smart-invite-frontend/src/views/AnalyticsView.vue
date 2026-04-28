<template>
  <div class="analytics-container">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📊</span>
        <h2>Statistiques</h2>
      </div>
      <button @click="$router.push('/dashboard-admin')" class="btn-back">
        ← Retour
      </button>
    </nav>
    <div class="analytics-header">
      <h1>📊 Analytics & Statistiques</h1>
      <p>Tableau de bord complet de votre événement</p>
    </div>

    <div class="container">
      <div class="stats-overview">
      <div class="stat-card primary">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ totalGuests }}</h3>
          <p>Invités totaux</p>
          <span class="stat-trend positive">+{{ newGuestsThisWeek }} cette semaine</span>
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ confirmedGuests }}</h3>
          <p>Confirmations</p>
          <span class="stat-percentage">{{ confirmationRate }}%</span>
        </div>
      </div>
      
      <div class="stat-card warning">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>{{ pendingGuests }}</h3>
          <p>En attente</p>
          <span class="stat-percentage">{{ pendingRate }}%</span>
        </div>
      </div>
      
      <div class="stat-card danger">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <h3>{{ declinedGuests }}</h3>
          <p>Refus</p>
          <span class="stat-percentage">{{ declineRate }}%</span>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3>📈 Évolution des confirmations</h3>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="(day, index) in confirmationChart" :key="index" class="chart-bar">
              <div class="bar" :style="{ height: day.percentage + '%' }"></div>
              <span class="bar-label">{{ day.day }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <h3>🥧 Répartition par groupe</h3>
        <div class="pie-chart">
          <div class="pie-segment famille" :style="{ '--percentage': groupStats.famille }">
            <span class="pie-label">Famille {{ groupStats.famille }}%</span>
          </div>
          <div class="pie-segment amis" :style="{ '--percentage': groupStats.amis }">
            <span class="pie-label">Amis {{ groupStats.amis }}%</span>
          </div>
          <div class="pie-segment collegues" :style="{ '--percentage': groupStats.collegues }">
            <span class="pie-label">Collègues {{ groupStats.collegues }}%</span>
          </div>
          <div class="pie-segment autres" :style="{ '--percentage': groupStats.autres }">
            <span class="pie-label">Autres {{ groupStats.autres }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detailed-stats">
      <div class="detail-card">
        <h3>📸 Photos</h3>
        <div class="detail-stats">
          <div class="detail-item">
            <span class="detail-label">Photos uploadées</span>
            <span class="detail-value">{{ photoStats.uploaded }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Photos validées</span>
            <span class="detail-value">{{ photoStats.approved }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">En attente</span>
            <span class="detail-value">{{ photoStats.pending }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h3>🎁 Wishlist</h3>
        <div class="detail-stats">
          <div class="detail-item">
            <span class="detail-label">Cadeaux proposés</span>
            <span class="detail-value">{{ wishlistStats.total }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Cadeaux offerts</span>
            <span class="detail-value">{{ wishlistStats.offered }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Valeur totale</span>
            <span class="detail-value">{{ wishlistStats.totalValue }}€</span>
          </div>
        </div>
      </div>
      
      <div class="detail-card">
        <h3>📖 Livre d'or</h3>
        <div class="detail-stats">
          <div class="detail-item">
            <span class="detail-label">Messages reçus</span>
            <span class="detail-value">{{ guestbookStats.total }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Note moyenne</span>
            <span class="detail-value">{{ guestbookStats.averageRating }}/5</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Messages publiés</span>
            <span class="detail-value">{{ guestbookStats.published }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-feed">
      <h3>📋 Activité récente</h3>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">{{ activity.icon }}</div>
          <div class="activity-content">
            <p>{{ activity.message }}</p>
            <span class="activity-time">{{ formatTime(activity.time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

console.log('AnalyticsView component loaded');

// Données simulées
const totalGuests = ref(150);
const confirmedGuests = ref(98);
const pendingGuests = ref(35);
const declinedGuests = ref(17);
const newGuestsThisWeek = ref(12);

const confirmationRate = computed(() => totalGuests.value > 0 ? Math.round((confirmedGuests.value / totalGuests.value) * 100) : 0);
const pendingRate = computed(() => totalGuests.value > 0 ? Math.round((pendingGuests.value / totalGuests.value) * 100) : 0);
const declineRate = computed(() => totalGuests.value > 0 ? Math.round((declinedGuests.value / totalGuests.value) * 100) : 0);

const confirmationChart = ref([
  { day: 'Lun', percentage: 20 },
  { day: 'Mar', percentage: 45 },
  { day: 'Mer', percentage: 60 },
  { day: 'Jeu', percentage: 75 },
  { day: 'Ven', percentage: 85 },
  { day: 'Sam', percentage: 95 },
  { day: 'Dim', percentage: 100 }
]);

const groupStats = ref({
  famille: 35,
  amis: 40,
  collegues: 15,
  autres: 10
});

const photoStats = ref({
  uploaded: 245,
  approved: 198,
  pending: 47
});

const wishlistStats = ref({
  total: 45,
  offered: 28,
  totalValue: 3250
});

const guestbookStats = ref({
  total: 32,
  averageRating: 4.8,
  published: 28
});

const recentActivities = ref([
  {
    id: 1,
    type: 'confirmation',
    icon: '✅',
    message: 'Sophie Martin a confirmé sa présence',
    time: '2024-06-15T14:30:00'
  },
  {
    id: 2,
    type: 'photo',
    icon: '📸',
    message: '15 nouvelles photos uploadées par le photographe',
    time: '2024-06-15T13:45:00'
  },
  {
    id: 3,
    type: 'wishlist',
    icon: '🎁',
    message: 'Jean Dupont a offert "Service à thé"',
    time: '2024-06-15T12:20:00'
  },
  {
    id: 4,
    type: 'guestbook',
    icon: '📖',
    message: 'Nouveau message dans le livre d\'or',
    time: '2024-06-15T11:15:00'
  }
]);

const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.analytics-container {
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

.analytics-header {
  text-align: center;
  margin-bottom: 2rem;
}

.analytics-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
}

.stat-card.primary { border-color: #667eea; }
.stat-card.success { border-color: #28a745; }
.stat-card.warning { border-color: #ffc107; }
.stat-card.danger { border-color: #dc3545; }

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.stat-content p {
  margin: 0.25rem 0;
  color: #6c757d;
  font-weight: 600;
}

.stat-trend {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #d4edda;
  color: #155724;
}

.stat-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chart-card h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 200px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: all 0.3s;
}

.bar-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
}

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0% 35%,
    #f093fb 35% 75%,
    #43cea2 75% 90%,
    #ffc107 90% 100%
  );
  margin: 0 auto;
  position: relative;
}

.detailed-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.detail-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.detail-card > .detail-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-label {
  color: #6c757d;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.activity-feed {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.activity-feed h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.activity-icon.confirmation { background: #d4edda; }
.activity-icon.photo { background: #d1ecf1; }
.activity-icon.wishlist { background: #fff3cd; }
.activity-icon.guestbook { background: #f8d7da; }

.activity-content p {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-weight: 500;
}

.activity-time {
  font-size: 0.8rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 1rem;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .chart-bars {
    height: 150px;
  }
  
  .pie-chart {
    width: 150px;
    height: 150px;
  }
}
</style>