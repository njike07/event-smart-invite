<template>
  <div class="guestbook-container">
    <div class="guestbook-header">
      <h1>📖 Livre d'Or</h1>
      <p>Messages et félicitations de vos invités</p>
    </div>

    <div class="guestbook-stats">
      <div class="stat-card">
        <div class="stat-icon">💌</div>
        <div class="stat-info">
          <h3>{{ messages.length }}</h3>
          <p>Messages reçus</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <h3>{{ averageRating.toFixed(1) }}</h3>
          <p>Note moyenne</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📤</div>
        <div class="stat-info">
          <h3>{{ approvedMessages }}</h3>
          <p>Messages publiés</p>
        </div>
      </div>
    </div>

    <div class="guestbook-actions">
      <button @click="shareGuestbook" class="btn-share">
        📤 Partager le livre d'or
      </button>
      <button @click="exportMessages" class="btn-export">
        📄 Exporter PDF
      </button>
    </div>

    <div class="messages-container">
      <div class="filter-tabs">
        <button 
          @click="currentFilter = 'all'" 
          :class="{ active: currentFilter === 'all' }"
          class="filter-tab"
        >
          Tous ({{ messages.length }})
        </button>
        <button 
          @click="currentFilter = 'pending'" 
          :class="{ active: currentFilter === 'pending' }"
          class="filter-tab"
        >
          En attente ({{ pendingMessages }})
        </button>
        <button 
          @click="currentFilter = 'approved'" 
          :class="{ active: currentFilter === 'approved' }"
          class="filter-tab"
        >
          Approuvés ({{ approvedMessages }})
        </button>
      </div>

      <div class="messages-list">
        <div v-for="message in filteredMessages" :key="message.id" class="message-card">
          <div class="message-header">
            <div class="author-info">
              <div class="author-avatar">{{ message.author.charAt(0).toUpperCase() }}</div>
              <div class="author-details">
                <h4>{{ message.author }}</h4>
                <span class="message-date">{{ formatDate(message.date) }}</span>
              </div>
            </div>
            <div class="message-rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= message.rating }">⭐</span>
            </div>
          </div>
          
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
          
          <div class="message-actions">
            <button 
              v-if="!message.approved" 
              @click="approveMessage(message.id)"
              class="btn-approve"
            >
              ✅ Approuver
            </button>
            <button 
              v-if="message.approved" 
              @click="unapproveMessage(message.id)"
              class="btn-unapprove"
            >
              ❌ Masquer
            </button>
            <button @click="deleteMessage(message.id)" class="btn-delete">
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const messages = ref([
  {
    id: 1,
    author: 'Mama Magni',
    content: 'Félicitations pour ce magnifique mariage ! Vous formez un couple parfait. Que votre amour grandisse chaque jour davantage. Plein de bonheur pour votre nouvelle vie à deux !',
    rating: 5,
    date: '2024-06-15T18:30:00',
    approved: true
  },
  {
    id: 2,
    author: 'Jean Claude',
    content: 'Quelle belle cérémonie ! Merci pour cette journée inoubliable. Longue vie aux mariés !',
    rating: 5,
    date: '2024-06-15T19:15:00',
    approved: true
  },
  {
    id: 3,
    author: 'Sophie Njike',
    content: 'Très émue par votre union. Vous rayonnez de bonheur ! Tous mes vœux de bonheur.',
    rating: 4,
    date: '2024-06-15T20:00:00',
    approved: false
  },
  {
    id: 4,
    author: 'Ton philomenne',
    content: 'Superbe soirée, organisation parfaite ! Bravo aux mariés et merci pour cette fête magnifique.',
    rating: 5,
    date: '2024-06-15T21:30:00',
    approved: true
  }
]);

const currentFilter = ref('all');

const filteredMessages = computed(() => {
  switch (currentFilter.value) {
    case 'pending':
      return messages.value.filter(m => !m.approved);
    case 'approved':
      return messages.value.filter(m => m.approved);
    default:
      return messages.value;
  }
});

const pendingMessages = computed(() => messages.value.filter(m => !m.approved).length);
const approvedMessages = computed(() => messages.value.filter(m => m.approved).length);

const averageRating = computed(() => {
  if (messages.value.length === 0) return 0;
  const sum = messages.value.reduce((acc, msg) => acc + msg.rating, 0);
  return sum / messages.value.length;
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const approveMessage = (id) => {
  const message = messages.value.find(m => m.id === id);
  if (message) message.approved = true;
};

const unapproveMessage = (id) => {
  const message = messages.value.find(m => m.id === id);
  if (message) message.approved = false;
};

const deleteMessage = (id) => {
  if (confirm('Supprimer ce message définitivement ?')) {
    messages.value = messages.value.filter(m => m.id !== id);
  }
};

const shareGuestbook = () => {
  const url = `${window.location.origin}/guestbook-public`;
  navigator.clipboard.writeText(url);
  alert('Lien du livre d\'or copié ! Partagez-le avec vos invités.');
};

const exportMessages = () => {
  alert('Export PDF en cours de développement...');
};
</script>

<style scoped>
.guestbook-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.guestbook-header {
  text-align: center;
  margin-bottom: 2rem;
}

.guestbook-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.guestbook-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.guestbook-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-share, .btn-export {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-share {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-export {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.message-card:hover {
  transform: translateY(-2px);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.author-details h4 {
  margin: 0;
  color: #2c3e50;
}

.message-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.message-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1rem;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.message-content {
  margin-bottom: 1rem;
}

.message-content p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.message-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-approve, .btn-unapprove, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-unapprove {
  background: #ffc107;
  color: #212529;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .guestbook-container {
    padding: 1rem;
  }
  
  .guestbook-actions {
    flex-direction: column;
  }
  
  .filter-tabs {
    flex-direction: column;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .message-actions {
    flex-wrap: wrap;
  }
}
</style>