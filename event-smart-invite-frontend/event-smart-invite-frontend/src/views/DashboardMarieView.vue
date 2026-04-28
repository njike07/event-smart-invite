<template>
  <div class="dashboard">
    <!-- Navigation avec design amélioré -->
    <nav class="navbar">
      <div class="nav-brand">
        <div class="logo-container">
          <span class="logo">💍</span>
          <div class="brand-text">
            <h2>Event Smart Invite</h2>
            <span class="tagline">Votre mariage parfait</span>
          </div>
        </div>
      </div>
      <div class="nav-user">
        <button @click="handleLogout" class="btn-logout">
          <span class="logout-icon">🚪</span>
          Déconnexion
        </button>
      </div>
    </nav>

    <div class="dashboard-container">
      <div class="marie-dashboard">
        <!-- Hero section avec design premium -->
        <div class="welcome-hero">
          <div class="hero-background">
            <div class="floating-hearts">
              <span class="heart heart-1">💕</span>
              <span class="heart heart-2">💖</span>
              <span class="heart heart-3">💝</span>
              <span class="heart heart-4">💗</span>
            </div>
          </div>
          <div class="hero-content">
            <div class="hero-icon"> Bienvenue au mariés </div>
            <h1>
              {{ authStore.user?.nomMarie }} & {{ authStore.user?.nomMariee }}
            </h1>
            <p class="hero-subtitle">Votre conte de fées commence ici...</p>
            <div class="countdown-container">
              <div class="countdown-card">
                <div class="countdown-number">{{ daysUntilWedding }}</div>
                <div class="countdown-label">jours avant le grand jour</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider photos avec design moderne -->
        <div class="photo-slider">
          <div class="slider-header">
            <h3>✨ Inspirations pour votre mariage</h3>
            <div class="slider-controls">
              <button @click="prevSlide" class="control-btn">‹</button>
              <button @click="nextSlide" class="control-btn">›</button>
            </div>
          </div>
          <div class="slider-container">
            <div
              class="slide"
              v-for="(photo, index) in weddingPhotos"
              :key="index"
              :class="{ active: currentSlide === index }"
            >
              <div class="slide-image">
                <img :src="photo.url" :alt="photo.alt" />
                <div class="slide-gradient"></div>
              </div>
              <div class="slide-content">
                <h4>{{ photo.title }}</h4>
                <p>{{ photo.caption }}</p>
              </div>
            </div>
            <div class="slider-indicators">
              <button
                v-for="(photo, index) in weddingPhotos"
                :key="index"
                @click="currentSlide = index"
                :class="{ active: currentSlide === index }"
                class="indicator"
              ></button>
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="quick-stats">
          <div class="stat-item">
            <div class="stat-icon">👥</div>
            <div class="stat-value">{{ guestStats.total }}</div>
            <div class="stat-label">Invités</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ guestStats.confirmed }}</div>
            <div class="stat-label">Confirmés</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎁</div>
            <div class="stat-value">{{ guestStats.gifts }}</div>
            <div class="stat-label">Cadeaux</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📸</div>
            <div class="stat-value">{{ guestStats.photos }}</div>
            <div class="stat-label">Photos</div>
          </div>
        </div>

        <!-- Actions avec design cards premium -->
        <div class="marie-actions">
          <div class="section-header">
            <h3>🎯 Gérez votre mariage</h3>
            <p>Tous les outils pour organiser votre jour parfait</p>
          </div>
          <div class="action-grid">
            <div class="action-card private" @click="router.push('/invites')">
              <div class="card-header">
                <div class="card-icon">📝</div>
                <div class="card-badge">Privé</div>
              </div>
              <h4>Liste d'invités</h4>
              <p>Gérez vos invitations et suivez les confirmations</p>
              <div class="card-footer">
                <span class="action-text">Gérer →</span>
              </div>
            </div>

            <div class="action-card private" @click="router.push('/wishlist')">
              <div class="card-header">
                <div class="card-icon">🎁</div>
                <div class="card-badge">Privé</div>
              </div>
              <h4>Liste de cadeaux</h4>  
              <p>Créez et partagez votre wishlist de mariage</p>
              <div class="card-footer">
                <span class="action-text">Gérer →</span>
              </div>
            </div>

            <div class="action-card private" @click="router.push('/galerie')">
              <div class="card-header">
                <div class="card-icon">📷</div>
                <div class="card-badge">Privé</div>
              </div>
              <h4>Albums photos</h4>
              <p>Découvrez les photos de votre événement</p>
              <div class="card-footer">
                <span class="action-text">Voir →</span>
              </div>
            </div>
          </div>

          <div class="section-header">
            <h3>🌐 Pages publiques</h3>
            <p>Ce que vos invités peuvent voir</p>
          </div>
          <div class="action-grid">
            <div
              class="action-card public"
              @click="router.push('/wishlist-public')"
            >
              <div class="card-header">
                <div class="card-icon">🎁</div>
                <div class="card-badge public">Public</div>
              </div>
              <h4>Wishlist publique</h4>
              <p>Votre liste de cadeaux accessible par vos invités</p>
              <div class="card-footer">
                <span class="action-text">Voir →</span>
              </div>
            </div>

            <div
              class="action-card public"
              @click="router.push('/timeline-public')"
            >
              <div class="card-header">
                <div class="card-icon">📅</div>
                <div class="card-badge public">Public</div>
              </div>
              <h4>Programme public</h4>
              <p>Le planning visible par vos invités</p>
              <div class="card-footer">
                <span class="action-text">Voir →</span>
              </div>
            </div>

            <div
              class="action-card public"
              @click="router.push('/guestbook-public')"
            >
              <div class="card-header">
                <div class="card-icon">📖</div>
                <div class="card-badge public">Public</div>
              </div>
              <h4>Livre d'or public</h4>
              <p>Espace de messages pour vos invités</p>
              <div class="card-footer">
                <span class="action-text">Voir →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const currentSlide = ref(0);

// Photos de mariage pour le slider
const weddingPhotos = ref([
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop",
    alt: "Couple de mariés",
    title: "Votre histoire d'amour",
    caption: "Chaque moment compte dans votre conte de fées...",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=400&fit=crop",
    alt: "Bouquet de mariée",
    title: "Détails parfaits",
    caption: "Chaque détail raconte votre histoire unique",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=400&fit=crop",
    alt: "Décoration de mariage",
    title: "Ambiance magique",
    caption: "Créez l'atmosphère de vos rêves",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=400&fit=crop",
    alt: "Cérémonie de mariage",
    title: "Moments précieux",
    caption: "Entourés de ceux que vous aimez",
  },
]);

// Statistiques rapides
const guestStats = ref({
  total: 150,
  confirmed: 98,
  gifts: 23,
  photos: 156,
});

// Calcul des jours jusqu'au mariage
const daysUntilWedding = computed(() => {
  if (!authStore.user?.dateMariage) return 42;
  const today = new Date();
  const weddingDate = new Date(authStore.user.dateMariage);
  const diffTime = weddingDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Navigation du slider
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % weddingPhotos.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0
      ? weddingPhotos.value.length - 1
      : currentSlide.value - 1;
};

// Auto-slide des photos
setInterval(() => {
  nextSlide();
}, 5000);

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffeef8 0%, #f8f4ff 100%);
}

/* Navigation premium */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.brand-text h2 {
  margin: 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
  font-weight: 700;
}

.tagline {
  font-size: 0.8rem;
  color: #8b5a9f;
  font-style: italic;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
}

/* Dashboard container */
.dashboard-container {
  padding: 2rem;
}

.marie-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* Hero section premium */
.welcome-hero {
  position: relative;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(240, 147, 251, 0.3);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.floating-hearts {
  position: absolute;
  width: 100%;
  height: 100%;
}

.heart {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: float 15s infinite ease-in-out;
}

.heart-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}
.heart-2 {
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}
.heart-3 {
  top: 30%;
  right: 30%;
  animation-delay: 6s;
}
.heart-4 {
  bottom: 20%;
  left: 20%;
  animation-delay: 9s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.hero-content h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  font-style: italic;
}

.countdown-container {
  display: flex;
  justify-content: center;
}

.countdown-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.countdown-number {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.countdown-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
}

/* Slider moderne */
.photo-slider {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.slider-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.slider-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.slider-container {
  position: relative;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  flex: 1;
  position: relative;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(240, 147, 251, 0.3),
    rgba(245, 87, 108, 0.3)
  );
}

.slide-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff0f8 100%);
}

.slide-content h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.slide-content p {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
}

.slider-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* Quick stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-weight: 500;
}

/* Actions section */
.marie-actions {
  margin-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-card.public::before {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 2.5rem;
}

.card-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.card-badge.public {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
}

.action-card h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.action-card p {
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.action-text {
  color: #f5576c;
  font-weight: 600;
  font-size: 0.95rem;
}

.action-card.public .action-text {
  color: #17a2b8;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .welcome-hero {
    padding: 3rem 1.5rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .countdown-number {
    font-size: 2.5rem;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .slide {
    flex-direction: column;
  }

  .slider-container {
    height: 400px;
  }
}
</style>
