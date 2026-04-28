<template>
  <div class="wishlist-page">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">🎁</span>
        <h2>Ma Wishlist</h2>
      </div>
      <div class="nav-actions">
        <button @click="showModal = true" class="btn-add">
          <span>➕</span> Ajouter un cadeau
        </button>
        <button @click="shareWishlist" class="btn-share">
          <span>🔗</span> Partager
        </button>
        <button @click="$router.push('/dashboard-marie')" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="stats-section">
        <div class="stat-card total">
          <div class="stat-icon">🎁</div>
          <div class="stat-info">
            <h3>{{ wishlist.length }}</h3>
            <p>Total cadeaux</p>
          </div>
        </div>
        <div class="stat-card received">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ receivedCount }}</h3>
            <p>Reçus</p>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>{{ pendingCount }}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div class="stat-card total-value">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>{{ totalValue }}€</h3>
            <p>Valeur totale</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <button 
          v-for="filter in ['Tous', 'Reçus', 'En attente']" 
          :key="filter"
          @click="selectedFilter = filter"
          :class="['filter-btn', { active: selectedFilter === filter }]"
        >
          {{ filter }}
        </button>
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

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement de la wishlist...</p>
      </div>

      <div v-else-if="filteredWishlist.length === 0" class="empty-state">
        <div class="empty-icon">🎁</div>
        <h3>Aucun cadeau</h3>
        <p>Commencez par ajouter vos premiers souhaits</p>
        <button @click="showModal = true" class="btn-add-first">
          Ajouter un cadeau
        </button>
      </div>

      <div v-else class="wishlist-grid">
        <div v-for="item in filteredWishlist" :key="item.id" class="wish-card">
          <div class="wish-image">
            <img v-if="item.image" :src="item.image" :alt="item.nom" />
            <div v-else class="placeholder-image">
              <span class="placeholder-icon">🎁</span>
            </div>
            <div v-if="item.recu" class="received-badge">
              <span>✅ Reçu</span>
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
              <div class="detail-item" v-if="item.url">
                <span class="icon">🔗</span>
                <a :href="item.url" target="_blank" class="link">Voir le produit</a>
              </div>
              <div class="detail-item" v-if="item.magasin">
                <span class="icon">🏪</span>
                <span>{{ item.magasin }}</span>
              </div>
            </div>

            <div class="wish-actions">
              <button @click="editWish(item)" class="btn-edit">
                ✏️ Modifier
              </button>
              <button @click="toggleReceived(item)" :class="['btn-toggle', { received: item.recu }]">
                {{ item.recu ? '↩️ Non reçu' : '✅ Reçu' }}
              </button>
              <button @click="deleteWish(item)" class="btn-delete">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editMode ? 'Modifier' : 'Ajouter' }} un cadeau</h2>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <form @submit.prevent="saveWish" class="modal-body">
          <div class="form-group">
            <label>Nom du cadeau *</label>
            <input v-model="form.nom" required placeholder="Ex: Grille-pain" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Prix (€) *</label>
              <input v-model.number="form.prix" type="number" required placeholder="50" />
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select v-model="form.categorie">
                <option value="Électroménager">Électroménager</option>
                <option value="Décoration">Décoration</option>
                <option value="Linge de maison">Linge de maison</option>
                <option value="Cuisine">Cuisine</option>
                <option value="Voyage">Voyage</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Description du cadeau..."></textarea>
          </div>
          
          <div class="form-group">
            <label>Magasin</label>
            <input v-model="form.magasin" placeholder="Ex: IKEA, Amazon..." />
          </div>
          
          <div class="form-group">
            <label>Lien produit</label>
            <input v-model="form.url" type="url" placeholder="https://..." />
          </div>
          
          <div class="form-group">
            <label>Image (URL)</label>
            <input v-model="form.image" type="url" placeholder="https://..." />
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save">{{ editMode ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de partage -->
    <div v-if="shareModal" class="modal-overlay" @click.self="shareModal = false">
      <div class="modal modal-small">
        <div class="modal-header">
          <h2>Partager la wishlist</h2>
          <button @click="shareModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <p>Partagez ce lien avec vos invités :</p>
          <div class="share-link">
            <input :value="shareUrl" readonly />
            <button @click="copyLink" class="btn-copy">📋 Copier</button>
          </div>
          <div class="share-buttons">
            <button @click="shareWhatsApp" class="btn-whatsapp">
              📱 WhatsApp
            </button>
            <button @click="shareEmail" class="btn-email">
              📧 Email
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false);
const showModal = ref(false);
const shareModal = ref(false);
const editMode = ref(false);
const selectedFilter = ref('Tous');
const selectedCategory = ref('Tous');

const categories = ref(['Tous', 'Électroménager', 'Décoration', 'Linge de maison', 'Cuisine', 'Voyage', 'Autre']);

const form = ref({
  nom: '',
  prix: '',
  description: '',
  categorie: 'Électroménager',
  magasin: '',
  url: '',
  image: ''
});

// Données simulées
const wishlist = ref([
  {
    id: 1,
    nom: 'Grille-pain Smeg',
    prix: 150,
    description: 'Grille-pain vintage rouge, 2 tranches',
    categorie: 'Électroménager',
    magasin: 'Darty',
    url: 'https://example.com/grille-pain',
    image: 'https://picsum.photos/300/200?random=1',
    recu: false
  },
  {
    id: 2,
    nom: 'Set de casseroles',
    prix: 200,
    description: 'Set de 5 casseroles en inox',
    categorie: 'Cuisine',
    magasin: 'IKEA',
    url: 'https://example.com/casseroles',
    image: 'https://picsum.photos/300/200?random=2',
    recu: true
  },
  {
    id: 3,
    nom: 'Parure de lit',
    prix: 80,
    description: 'Parure de lit 240x220 cm, coton bio',
    categorie: 'Linge de maison',
    magasin: 'Zara Home',
    url: '',
    image: 'https://picsum.photos/300/200?random=3',
    recu: false
  }
]);

const filteredWishlist = computed(() => {
  let filtered = wishlist.value;
  
  if (selectedFilter.value === 'Reçus') {
    filtered = filtered.filter(item => item.recu);
  } else if (selectedFilter.value === 'En attente') {
    filtered = filtered.filter(item => !item.recu);
  }
  
  if (selectedCategory.value !== 'Tous') {
    filtered = filtered.filter(item => item.categorie === selectedCategory.value);
  }
  
  return filtered;
});

const receivedCount = computed(() => 
  wishlist.value.filter(item => item.recu).length
);

const pendingCount = computed(() => 
  wishlist.value.filter(item => !item.recu).length
);

const totalValue = computed(() => 
  wishlist.value.reduce((sum, item) => sum + item.prix, 0)
);

const shareUrl = computed(() => 
  `${window.location.origin}/wishlist-public`
);

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
  form.value = {
    nom: '',
    prix: '',
    description: '',
    categorie: 'Électroménager',
    magasin: '',
    url: '',
    image: ''
  };
};

const editWish = (item) => {
  editMode.value = true;
  form.value = { ...item };
  showModal.value = true;
};

const saveWish = () => {
  if (editMode.value) {
    const index = wishlist.value.findIndex(item => item.id === form.value.id);
    wishlist.value[index] = { ...form.value };
  } else {
    wishlist.value.push({
      ...form.value,
      id: Date.now(),
      recu: false
    });
  }
  closeModal();
};

const toggleReceived = (item) => {
  item.recu = !item.recu;
};

const deleteWish = (item) => {
  if (confirm(`Supprimer "${item.nom}" de la wishlist ?`)) {
    const index = wishlist.value.findIndex(w => w.id === item.id);
    wishlist.value.splice(index, 1);
  }
};

const shareWishlist = () => {
  shareModal.value = true;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    alert('Lien copié !');
  } catch (err) {
    alert('Erreur lors de la copie');
  }
};

const shareWhatsApp = () => {
  const text = `Découvrez notre wishlist de mariage : ${shareUrl.value}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};

const shareEmail = () => {
  const subject = 'Notre wishlist de mariage';
  const body = `Bonjour,\n\nDécouvrez notre wishlist de mariage :\n${shareUrl.value}\n\nMerci !`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};

onMounted(() => {
  // Charger la wishlist depuis l'API
});
</script>

<style scoped>
.wishlist-page {
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

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-add, .btn-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-share {
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
}

.btn-add:hover, .btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
}

.stat-card.total { border-color: #667eea; }
.stat-card.received { border-color: #28a745; }
.stat-card.pending { border-color: #ffc107; }
.stat-card.total-value { border-color: #17a2b8; }

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.filters, .categories {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-btn, .category-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  color: #6c757d;
}

.filter-btn.active, .category-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-btn:hover, .category-btn:hover {
  border-color: #667eea;
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
  margin-bottom: 2rem;
}

.btn-add-first {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add-first:hover {
  background: #5568d3;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.wish-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.wish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.wish-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.wish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
  color: #dee2e6;
}

.received-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(40, 167, 69, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.wish-content {
  padding: 1.5rem;
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.wish-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.price {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}

.description {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.wish-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: #6c757d;
  font-size: 0.85rem;
}

.link {
  color: #667eea;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.wish-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.wish-actions button {
  flex: 1;
  min-width: 80px;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-edit {
  background: #17a2b8;
  color: white;
}

.btn-edit:hover {
  background: #138496;
}

.btn-toggle {
  background: #28a745;
  color: white;
}

.btn-toggle.received {
  background: #ffc107;
  color: #212529;
}

.btn-toggle:hover {
  opacity: 0.9;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
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
  max-width: 600px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
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
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-cancel, .btn-save {
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

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.share-link {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.share-link input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.btn-copy {
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}

.share-buttons {
  display: flex;
  gap: 1rem;
}

.btn-whatsapp, .btn-email {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-whatsapp {
  background: #25d366;
  color: white;
}

.btn-email {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .container {
    padding: 1rem;
  }

  .stats-section {
    grid-template-columns: 1fr 1fr;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .share-buttons {
    flex-direction: column;
  }
}
</style>