<template>
  <div class="home-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <div class="home-content">
      <div class="logo-section">
        <div class="logo">💍</div>
        <h1>Event Smart Invite</h1>
        <p class="subtitle">Votre assistant intelligent pour des événements inoubliables</p>
      </div>
      
      <div class="login-options">
        <router-link to="/login" class="login-card admin">
          <div class="card-header">
            <div class="icon">👨💼</div>
          </div>
          <div class="card-body">
            <h3>Administrateur</h3>
            <p>Gérez les invitations, validez les photos et organisez l'événement</p>
          </div>
          <div class="card-footer">
            <span class="arrow">→</span>
          </div>
        </router-link>

        <router-link to="/login-marie" class="login-card marie">
          <div class="card-header">
            <div class="icon">💑</div>
          </div>
          <div class="card-body">
            <h3>Mariés</h3>
            <p>Créez votre liste d'invités et gérez votre wishlist</p>
          </div>
          <div class="card-footer">
            <span class="arrow">→</span>
          </div>
        </router-link>

        <router-link to="/login-photographe" class="login-card photographe">
          <div class="card-header">
            <div class="icon">📸</div>
          </div>
          <div class="card-body">
            <h3>Photographe</h3>
            <p>Uploadez et organisez vos photos par albums</p>
          </div>
          <div class="card-footer">
            <span class="arrow">→</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.background-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: 10%;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -50px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

.home-content {
  text-align: center;
  max-width: 1100px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.logo-section {
  margin-bottom: 3rem;
}

.logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

h1 {
  color: white;
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.subtitle {
  color: rgba(255,255,255,0.95);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
}

.login-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  text-decoration: none;
  color: #333;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  position: relative;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.login-card:hover::before {
  transform: translateX(100%);
}

.login-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

.card-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.card-body {
  padding: 1.5rem 2rem;
}

.card-body h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  padding: 1rem 2rem 1.5rem;
  text-align: right;
}

.arrow {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: bold;
  transition: transform 0.3s;
}

.login-card:hover .arrow {
  transform: translateX(5px);
}

.admin {
  color: #667eea;
}

.admin:hover {
  border-top: 4px solid #667eea;
}

.marie {
  color: #f5576c;
}

.marie:hover {
  border-top: 4px solid #f5576c;
}

.photographe {
  color: #43cea2;
}

.photographe:hover {
  border-top: 4px solid #43cea2;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
  
  .logo-section {
    margin-bottom: 2rem;
  }
  
  .logo {
    font-size: 3rem;
  }
  
  .login-options {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .icon {
    font-size: 2.5rem;
  }
  
  .card-body {
    padding: 1rem 1.5rem;
  }
  
  .card-body h3 {
    font-size: 1.25rem;
  }
  
  .card-body p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 0.5rem;
  }
  
  .card-header,
  .card-body,
  .card-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
