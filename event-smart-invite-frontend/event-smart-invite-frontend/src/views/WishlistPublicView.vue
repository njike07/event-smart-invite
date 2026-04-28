<template>
  <div class="wishlist-public-page">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">🎁</span>
        <h2>Wishlist de Sophie & Pierre</h2>
      </div>
      <div class="nav-actions">
        <button @click="$router.push('/dashboard-marie')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="hero-section">
        <div class="couple-photo">
          <div class="photo-placeholder">💑</div>
        </div>
        <h1>Notre Liste de Cadeaux</h1>
        <p>Aidez-nous à commencer notre nouvelle vie ensemble en choisissant un cadeau qui nous fera plaisir !</p>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ wishlist.length }}</span>
          <span class="stat-label">Cadeaux</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ receivedCount }}</span>
          <span class="stat-label">Offerts</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ availableCount }}</span>
          <span class="stat-label">Disponibles</span>
        </div>
      </div>

      <div class="categories">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectedCategory = category"
          :class="['category-btn', { active: selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>

      <div class="price-filters">
        <button 
          v-for="range in priceRanges" 
          :key="range.label"
          @click="selectedPriceRange = range"
          :class="['price-btn', { active: selectedPriceRange.label === range.label }]"
        >
          {{ range.label }}
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement de la wishlist...</p>
      </div>

      <div v-else-if="filteredWishlist.length === 0" class="empty-state">
        <div class="empty-icon">🎁</div>
        <h3>Aucun cadeau disponible</h3>
        <p>Tous les cadeaux de cette catégorie ont été offerts !</p>
      </div>

      <div v-else class="wishlist-grid">
        <div v-for="item in filteredWishlist" :key="item.id" class="wish-card">
          <div class="wish-image">
            <img v-if="item.image" :src="item.image" :alt="item.nom" />
            <div v-else class="placeholder-image">
              <span class="placeholder-icon">🎁</span>
            </div>
            <div v-if="item.recu" class="offered-badge">
              <span>🎉 Offert</span>
            </div>
            <div v-else class="available-badge">
              <span>✨ Disponible</span>
            </div>
          </div>
          
          <div class="wish-content">
            <div class="wish-header">
              <h3>{{ item.nom }}</h3>
              <span class="price">{{ item.prix }}€</span>
            </div>
            
            <p class="description">{{ item.description }}</p>
            
            <div class="wish-details">
              <div class="detail-item">
                <span class="icon">🏷️</span>
                <span>{{ item.categorie }}</span>
              </div>
              <div class="detail-item" v-if="item.magasin">
                <span class="icon">🏪</span>
                <span>{{ item.magasin }}</span>
              </div>
            </div>

            <div class="wish-actions">
              <button 
                v-if="!item.recu" 
                @click="markAsOffered(item)" 
                class="btn-offer"
              >
                🎁 J'offre ce cadeau
              </button>
              <div v-else class="offered-message">
                <span>✅ Déjà offert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation d'offre -->
    <div v-if="offerModal" class="modal-overlay" @click.self="offerModal = null">
      <div class="modal modal-small">
        <div class="modal-header">
          <h2>Confirmer l'offre</h2>
          <button @click="offerModal = null" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="gift-preview">
            <img v-if="offerModal.image" :src="offerModal.image" :alt="offerModal.nom" />
            <div v-else class="placeholder-small">🎁</div>
            <div class="gift-info">
              <h3>{{ offerModal.nom }}</h3>
              <p class="gift-price">{{ offerModal.prix }}€</p>
            </div>
          </div>
          
          <p>Vous souhaitez offrir ce cadeau aux mariés ?</p>
          
          <div class="form-group">
            <label>Votre nom *</label>
            <input v-model="offerForm.nom" required placeholder="Votre prénom et nom" />
          </div>
          
          <div class="form-group">
            <label>Message (optionnel)</label>
            <textarea v-model="offerForm.message" placeholder="Un petit message pour les mariés..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="offerModal = null" class="btn-cancel">Annuler</button>
          <button @click="confirmOffer" class="btn-confirm">Confirmer l'offre</button>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <div v-if="successModal" class="modal-overlay" @click.self="successModal = false">
      <div class="modal modal-small">
        <div class="modal-body success-content">
          <div class="success-icon">🎉</div>
          <h2>Merci !</h2>
          <p>Votre cadeau a été marqué comme offert. Les mariés seront ravis !</p>
          <button @click="successModal = false" class="btn-ok">Parfait !</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false);
const selectedCategory = ref('Tous');
const selectedPriceRange = ref({ label: 'Tous', min: 0, max: Infinity });
const offerModal = ref(null);
const successModal = ref(false);

const categories = ref(['Tous', 'Électroménager', 'Décoration', 'Linge de maison', 'Cuisine', 'Voyage', 'Autre']);

const priceRanges = ref([
  { label: 'Tous', min: 0, max: Infinity },
  { label: '< 50FCFA', min: 0, max: 50 },
  { label: '50-100FCFA', min: 50, max: 100 },
  { label: '100-200FCFA', min: 100, max: 200 },
  { label: '> 200FCA', min: 200, max: Infinity }
]);

const offerForm = ref({
  nom: '',
  message: ''
});

// Données simulées
const wishlist = ref([
  {
    id: 1,
    nom: 'Grille-pain Smeg',
    prix: 150,
    description: 'Grille-pain , 2 etage',
    categorie: 'Électroménager',
    magasin: 'Orca',
    url: 'https://example.com/grille-pain',
    image: 'https://picsum.photos/300/200?random=1',
    recu: false
  },
  {
    id: 2,
    nom: 'Set de casseroles',
    prix: 200,
    
    description: 'Set de 5 casseroles en inox avec couvercles',
    categorie: 'Cuisine',
    magasin: 'Arno',
    url: 'https://example.com/casseroles',
    image: 'https://picsum.photos/300/200?random=2',
    recu: true
  },
  {
    id: 3,
    nom: 'Parure de lit',
    prix: 80,
    description: 'Parure de lit 240x220 cm',
    categorie: 'Linge de maison',
    magasin: 'Orca',
    url: 'https://example.com/parure',
    image: 'https://picsum.photos/300/200?random=3',
    recu: false
  },
  {
    id: 4,
    nom: 'Vase décoratif',
    prix: 45,
    description: 'Vase en céramique artisanale',
    categorie: 'Décoration',
    magasin: 'Marcher centrale',
    url: 'https://example.com/vase',
    image: 'https://picsum.photos/300/200?random=4',
    recu: false
  },
  {
    id: 5,
    nom: 'Coffret voyage',
    prix: 300,
    description: 'Coffret cadeau pour un week-end romantique',
    categorie: 'Voyage',
    magasin: 'Marcher centrale',
    url: 'https://example.com/coffret',
    image: 'https://picsum.photos/300/200?random=5',
    recu: false
  }
]);

const filteredWishlist = computed(() => {
  let filtered = wishlist.value;
  
  if (selectedCategory.value !== 'Tous') {
    filtered = filtered.filter(item => item.categorie === selectedCategory.value);
  }
  
  if (selectedPriceRange.value.label !== 'Tous') {
    filtered = filtered.filter(item => 
      item.prix >= selectedPriceRange.value.min && 
      item.prix <= selectedPriceRange.value.max
    );
  }
  
  return filtered;
});

const receivedCount = computed(() => 
  wishlist.value.filter(item => item.recu).length
);

const availableCount = computed(() => 
  wishlist.value.filter(item => !item.recu).length
);

const openProductLink = (url) => {
  window.open(url, '_blank');
};

const markAsOffered = (item) => {
  offerModal.value = item;
  offerForm.value = { nom: '', message: '' };
};

const confirmOffer = () => {
  if (!offerForm.value.nom.trim()) {
    alert('Veuillez saisir votre nom');
    return;
  }
  
  // Marquer le cadeau comme offert
  offerModal.value.recu = true;
  offerModal.value.offertPar = offerForm.value.nom;
  offerModal.value.messageOffre = offerForm.value.message;
  
  offerModal.value = null;
  successModal.value = true;
};

onMounted(() => {
  // Charger la wishlist depuis l'API
});
</script>

<style scoped>
.wishlist-public-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.logo {
  font-size: 2rem;
}

.navbar h2 {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.couple-photo {
  margin-bottom: 2rem;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.hero-section h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.categories, .price-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn, .price-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  color: #6c757d;
}

.category-btn.active, .price-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.category-btn:hover:not(.active), .price-btn:hover:not(.active) {
  border-color: #667eea;
  transform: translateY(-1px);
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.wish-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.wish-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.wish-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.wish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.wish-card:hover .wish-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 4rem;
  color: #dee2e6;
}

.offered-badge, .available-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.offered-badge {
  background: rgba(220, 53, 69, 0.9);
  color: white;
}

.available-badge {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.wish-content {
  padding: 2rem;
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.wish-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.price {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
}

.description {
  color: #6c757d;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.wish-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.wish-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-offer {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-offer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.offered-message {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
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
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-small {
  max-width: 400px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
}

.modal-body {
  padding: 2rem;
}

.gift-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.gift-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.placeholder-small {
  width: 80px;
  height: 80px;
  background: #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.gift-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.gift-price {
  margin: 0;
  color: #667eea;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel, .btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel {
  background: #e9ecef;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-confirm {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.success-content {
  text-align: center;
  padding: 3rem 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-content h2 {
  color: #28a745;
  margin-bottom: 1rem;
}

.success-content p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.btn-ok {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .stats-bar {
    flex-direction: column;
    gap: 1.5rem;
  }

  .categories, .price-filters {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .wish-actions {
    flex-direction: column;
  }
}
</style>