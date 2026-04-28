<template>
  <div class="guestbook-public-container">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📖</span>
        <h2>Livre d'Or</h2>
      </div>
      <div class="nav-actions">
        <button @click="$router.push('/dashboard-marie')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="guestbook-header">
      <div class="header-content">
        <h1>📖 Livre d'Or</h1>
        <p class="couple-names">Marie & Pierre</p>
        <p class="subtitle">Laissez-nous un message de félicitations</p>
      </div>
    </div>

    <div class="message-form-container">
      <form @submit.prevent="submitMessage" class="message-form">
        <div class="form-group">
          <label>Votre nom</label>
          <input v-model="messageForm.author" required placeholder="Votre nom complet" />
        </div>
        
        <div class="form-group">
          <label>Votre message</label>
          <textarea 
            v-model="messageForm.content" 
            required 
            placeholder="Écrivez vos félicitations et vos vœux de bonheur..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Votre note pour cette soirée</label>
          <div class="rating-input">
            <span 
              v-for="n in 5" 
              :key="n"
              @click="messageForm.rating = n"
              class="star-input"
              :class="{ active: n <= messageForm.rating }"
            >
              ⭐
            </span>
          </div>
        </div>
        
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">💌 Envoyer mon message</span>
          <span v-else>📤 Envoi en cours...</span>
        </button>
      </form>
    </div>

    <div class="messages-public">
      <h2>💬 Messages des invités</h2>
      <div class="messages-grid">
        <div v-for="message in approvedMessages" :key="message.id" class="message-public-card">
          <div class="message-public-header">
            <div class="author-avatar">{{ message.author.charAt(0).toUpperCase() }}</div>
            <div class="author-info">
              <h4>{{ message.author }}</h4>
              <div class="message-rating">
                <span v-for="n in message.rating" :key="n" class="star">⭐</span>
              </div>
            </div>
            <span class="message-date">{{ formatDate(message.date) }}</span>
          </div>
          <div class="message-public-content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="modal-overlay" @click="showSuccess = false">
      <div class="modal-content success" @click.stop>
        <div class="success-icon">✅</div>
        <h3>Message envoyé !</h3>
        <p>Merci pour vos félicitations. Votre message sera visible après validation.</p>
        <button @click="showSuccess = false" class="btn-close">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const messages = ref([
  {
    id: 1,
    author: 'Papa Tagni',
    content: 'Félicitations pour ce magnifique mariage ! Vous formez un couple parfait. Que votre amour grandisse chaque jour davantage.',
    rating: 5,
    date: '2024-06-15T18:30:00',
    approved: true
  },
  {
    id: 2,
    author: 'Christelle ',
    content: 'Quelle belle cérémonie ! Merci pour cette journée inoubliable. Longue vie aux mariés !',
    rating: 5,
    date: '2024-06-15T19:15:00',
    approved: true
  },
  {
    id: 4,
    author: 'le couple Nana ',
    content: 'Superbe soirée, organisation parfaite ! Bravo aux mariés et merci pour cette fête magnifique.',
    rating: 5,
    date: '2024-06-15T21:30:00',
    approved: true
  },
  {
    id: 5,
    author: 'Claire Ndi',
    content: 'Très émue par cette belle union. Vous rayonnez de bonheur ! Plein de bonheur pour votre nouvelle vie.',
    rating: 4,
    date: '2024-06-15T22:00:00',
    approved: true
  }
]);

const messageForm = ref({
  author: '',
  content: '',
  rating: 5
});

const loading = ref(false);
const showSuccess = ref(false);

const approvedMessages = computed(() => {
  return messages.value.filter(m => m.approved).sort((a, b) => new Date(b.date) - new Date(a.date));
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const submitMessage = async () => {
  loading.value = true;
  
  // Simulation d'envoi
  setTimeout(() => {
    const newMessage = {
      id: Date.now(),
      ...messageForm.value,
      date: new Date().toISOString(),
      approved: false
    };
    
    messages.value.push(newMessage);
    
    // Reset form
    messageForm.value = {
      author: '',
      content: '',
      rating: 5
    };
    
    loading.value = false;
    showSuccess.value = true;
  }, 1500);
};
</script>

<style scoped>
.guestbook-public-container {
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

.guestbook-header {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
}

.guestbook-header .header-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.message-form-container {
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.messages-public {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.guestbook-header h1 {
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

.message-form-container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 4px rgba(245, 87, 108, 0.1);
}

.rating-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.star-input {
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.3s;
}

.star-input.active {
  opacity: 1;
  transform: scale(1.1);
}

.btn-submit {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.messages-public {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.messages-public h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.messages-grid {
  display: grid;
  gap: 1.5rem;
}

.message-public-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 16px;
  border-left: 4px solid #f5576c;
  transition: transform 0.3s;
}

.message-public-card:hover {
  transform: translateX(5px);
}

.message-public-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.author-info {
  flex: 1;
}

.author-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.message-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 0.9rem;
}

.message-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.message-public-content p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
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
  text-align: center;
  max-width: 400px;
  margin: 1rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-content h3 {
  color: #28a745;
  margin-bottom: 1rem;
}

.btn-close {
  padding: 0.75rem 2rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .guestbook-public-container {
    padding: 1rem 0.5rem;
  }
  
  .guestbook-header, .message-form-container, .messages-public {
    padding: 1.5rem;
  }
  
  .message-public-header {
    flex-wrap: wrap;
  }
  
  .message-date {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>