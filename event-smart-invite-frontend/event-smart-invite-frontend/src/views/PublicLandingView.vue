<template>
  <div id="public-landing">
    <!-- Main Public Interface -->
    <div class="main-interface">
      <header class="header">
        <img :src="logoSrc" alt="Logo" class="logo" v-if="logoSrc" />
        <div class="logo-placeholder" v-else>Logo</div>
        <h2>Le {{ weddingDate }}</h2>
        <button @click="toggleMenu" class="menu-btn">☰</button>
      </header>

      <nav v-if="menuOpen" class="mobile-menu">
        <ul>
          <li><router-link to="/galerie">Galerie Photos</router-link></li>
          <li><router-link to="/guestbook-public">Livre d'Or</router-link></li>
          <li><router-link to="/table-finder">Ma Table</router-link></li>
          <li><router-link to="/timeline-public">Programme</router-link></li>
          <li><router-link to="/wishlist-public">Liste de Cadeaux</router-link></li>
        </ul>
      </nav>

      <main class="content">
        <div class="welcome-section">
          <h1>Bienvenue à notre mariage !</h1>
          <p>Romarique & Piere </p>
        </div>

        <div class="card-grid">
          <div class="card" @click="$router.push('/galerie')">
            <div class="card-icon">📸</div>
            <h3>Galerie Photos</h3>
            <p>Découvrez nos moments</p>
          </div>
          <div class="card" @click="$router.push('/guestbook-public')">
            <div class="card-icon">📖</div>
            <h3>Livre d'Or</h3>
            <p>Laissez un message pour nos marier </p>
            <span class="counter">{{ messageCount }} messages</span>
          </div>
          <div class="card" @click="$router.push('/table-finder')">
            <div class="card-icon">🪑</div>
            <h3>Ma Table</h3>
            <p>Trouvez votre place</p>
          </div>
          <div class="card" @click="$router.push('/timeline-public')">
            <div class="card-icon">📅</div>
            <h3>Programme</h3>
            <p>Le déroulé de la journée</p>
          </div>
          <div class="card" @click="$router.push('/wishlist-public')">
            <div class="card-icon">🎁</div>
            <h3>Liste de Cadeaux</h3>
            <p>Offrez-nous un cadeau</p>
          </div>
        </div>
      </main>

      <footer class="footer">
        <button @click="$router.push('/rsvp/' + $route.params.code)" class="rsvp-btn">Confirmer ma présence</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicLandingView',
  data() {
    return {
      menuOpen: false,
      weddingDate: '26 juin 2026', // Remplacer par la vraie date
      messageCount: 42, // Remplacer par donnée dynamique
      animationSrc: '', // Chemin vers votre animation Canva
      logoSrc: '' // Chemin vers votre logo
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
}
</script>

<style scoped>
/* Import Google Fonts for elegance */
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;600&display=swap');

/* Main Interface */
.main-interface {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffe6f0 0%, #ffffff 50%, #f0f8ff 100%);
  font-family: 'Poppins', sans-serif;
}

.header {
  background: linear-gradient(90deg, #ff6b9d, #c44569);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.wedding-animation-placeholder {
  display: none; /* Not used anymore */
}

.logo-placeholder {
  height: 50px;
  width: 120px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.header h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.menu-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.mobile-menu {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-menu a {
  display: block;
  padding: 1.2rem 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.mobile-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 2rem;
}

.content {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 157, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '💍';
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 2rem;
  opacity: 0.3;
}

.welcome-section::after {
  content: '💍';
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 2rem;
  opacity: 0.3;
}

.welcome-section h1 {
  font-family: 'Dancing Script', cursive;
  font-size: 3rem;
  color: #c44569;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(196, 69, 105, 0.3);
  animation: fadeInUp 1s ease-out;
}

.welcome-section p {
  color: #666;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 300;
  animation: fadeInUp 1s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 107, 157, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 157, 0.1), transparent);
  transition: left 0.5s;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 40px rgba(255, 107, 157, 0.25);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: #c44569;
  font-weight: 600;
  font-size: 1.4rem;
}

.card p {
  color: #666;
  margin: 0 0 1rem 0;
  font-weight: 300;
}

.counter {
  font-size: 0.9rem;
  color: #ff6b9d;
  font-weight: 500;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  box-shadow: 0 -4px 15px rgba(255, 107, 157, 0.3);
  backdrop-filter: blur(10px);
}

.rsvp-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #ffffff, #f8f8f8);
  color: #c44569;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rsvp-btn:hover {
  background: linear-gradient(135deg, #f8f8f8, #ffffff);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
</style>