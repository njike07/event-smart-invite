<template>
  <div class="galerie-page">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📷</span>
        <h2>Galerie Photos</h2>
      </div>
      <div class="nav-actions">
        <button @click="showUploadModal = true" class="btn-upload">
          <span>📤</span> Partager une photo
        </button>
        <button @click="goBack()" class="btn-back">
          ← Retour
        </button>
      </div>
    </nav>

    <div class="container">
      <div class="hero-section">
        <h1>Nos plus beaux moments</h1>
        <p>Revivez la magie de notre journée à travers ces photos</p>
      </div>

      <div class="albums-nav">
        <button 
          v-for="album in albums" 
          :key="album.name"
          @click="selectedAlbum = album.name"
          :class="['album-btn', { active: selectedAlbum === album.name }]"
        >
          <span class="album-icon">{{ album.icon }}</span>
          <span class="album-name">{{ album.name }}</span>
          <span class="album-count">({{ album.count }})</span>
        </button>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des photos...</p>
      </div>

      <div v-else-if="filteredPhotos.length === 0" class="empty-state">
        <div class="empty-icon">📸</div>
        <h3>Aucune photo dans cet album</h3>
        <p>Les photos seront ajoutées au fur et à mesure de l'événement</p>
      </div>

      <div v-else class="photos-masonry">
        <div 
          v-for="photo in filteredPhotos" 
          :key="photo.id" 
          class="photo-item"
          @click="openLightbox(photo)"
        >
          <img :src="photo.url" :alt="photo.nom" loading="lazy" />
          <div class="photo-overlay">
            <div class="photo-info">
              <h4>{{ photo.nom }}</h4>
              <p>{{ photo.auteur }}</p>
            </div>
            <div class="photo-actions">
              <button @click.stop="likePhoto(photo)" :class="['btn-like', { liked: photo.liked }]">
                {{ photo.liked ? '❤️' : '🤍' }} {{ photo.likes }}
              </button>
              <button @click.stop="downloadPhoto(photo)" class="btn-download">💾</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'upload pour invités -->
    <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
      <div class="modal upload-modal">
        <div class="modal-header">
          <h2>Partager une photo</h2>
          <button @click="showUploadModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
            <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="image/*" hidden />
            <div class="upload-content">
              <div class="upload-icon">📤</div>
              <h3>Partagez vos souvenirs</h3>
              <p>Glissez vos photos ici ou <button @click="$refs.fileInput.click()" class="btn-browse">parcourez</button></p>
              <small>Vos photos seront validées avant publication</small>
            </div>
          </div>
          
          <div class="form-group">
            <label>Album</label>
            <select v-model="uploadForm.album">
              <option value="Église">Église</option>
              <option value="Mairie">Mairie</option>
              <option value="Soirée">Soirée</option>
              <option value="Spontanées">Spontanées</option>
            </select>
          </div>

          <div class="form-group">
            <label>Votre nom</label>
            <input v-model="uploadForm.auteur" placeholder="Votre prénom" />
          </div>

          <div v-if="selectedFiles.length > 0" class="selected-files">
            <h4>Photos sélectionnées ({{ selectedFiles.length }})</h4>
            <div class="files-preview">
              <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview">
                <img :src="getFilePreview(file)" :alt="file.name" />
                <button @click="removeFile(index)" class="btn-remove">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showUploadModal = false" class="btn-cancel">Annuler</button>
          <button @click="uploadPhotos" :disabled="selectedFiles.length === 0 || uploading" class="btn-upload-confirm">
            {{ uploading ? 'Envoi...' : `Partager ${selectedFiles.length} photo(s)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxPhoto" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox">
        <button @click="closeLightbox" class="btn-close-lightbox">✕</button>
        <button @click="previousPhoto" class="btn-nav prev" v-if="lightboxIndex > 0">‹</button>
        <button @click="nextPhoto" class="btn-nav next" v-if="lightboxIndex < filteredPhotos.length - 1">›</button>
        
        <img :src="lightboxPhoto.url" :alt="lightboxPhoto.nom" />
        
        <div class="lightbox-info">
          <h3>{{ lightboxPhoto.nom }}</h3>
          <p>{{ lightboxPhoto.auteur }} • {{ lightboxPhoto.album }}</p>
          <div class="lightbox-actions">
            <button @click="likePhoto(lightboxPhoto)" :class="['btn-like-lg', { liked: lightboxPhoto.liked }]">
              {{ lightboxPhoto.liked ? '❤️' : '🤍' }} {{ lightboxPhoto.likes }}
            </button>
            <button @click="downloadPhoto(lightboxPhoto)" class="btn-download-lg">
              💾 Télécharger
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const selectedAlbum = ref('Tous');
const showUploadModal = ref(false);
const lightboxPhoto = ref(null);
const lightboxIndex = ref(0);
const uploading = ref(false);
const selectedFiles = ref([]);

const uploadForm = ref({
  album: 'Spontanées',
  auteur: ''
});

const albums = ref([
  { name: 'Tous', icon: '🖼️', count: 0 },
  { name: 'Église', icon: '⛪', count: 0 },
  { name: 'Mairie', icon: '🏛️', count: 0 },
  { name: 'Soirée', icon: '🎉', count: 0 },
  { name: 'Spontanées', icon: '📸', count: 0 }
]);

// Données simulées
const photos = ref([
  {
    id: 1,
    nom: 'Arrivée des mariés',
    url: 'https://picsum.photos/400/600?random=1',
    album: 'Église',
    auteur: 'Photographe Pro',
    likes: 12,
    liked: false
  },
  {
    id: 2,
    nom: 'Échange des alliances',
    url: 'https://picsum.photos/600/400?random=2',
    album: 'Église',
    auteur: 'Photographe Pro',
    likes: 25,
    liked: true
  },
  {
    id: 3,
    nom: 'Sortie de mairie',
    url: 'https://picsum.photos/400/500?random=3',
    album: 'Mairie',
    auteur: 'Jean Dupont',
    likes: 8,
    liked: false
  },
  {
    id: 4,
    nom: 'Première danse',
    url: 'https://picsum.photos/500/700?random=4',
    album: 'Soirée',
    auteur: 'Marie Martin',
    likes: 18,
    liked: false
  },
  {
    id: 5,
    nom: 'Bouquet de la mariée',
    url: 'https://picsum.photos/300/400?random=5',
    album: 'Spontanées',
    auteur: 'Sophie Durand',
    likes: 15,
    liked: true
  },
  {
    id: 6,
    nom: 'Groupe famille',
    url: 'https://picsum.photos/600/500?random=6',
    album: 'Église',
    auteur: 'Photographe Pro',
    likes: 22,
    liked: false
  }
]);

const filteredPhotos = computed(() => {
  if (selectedAlbum.value === 'Tous') return photos.value;
  return photos.value.filter(p => p.album === selectedAlbum.value);
});

// Calculer les compteurs d'albums
const updateAlbumCounts = () => {
  albums.value.forEach(album => {
    if (album.name === 'Tous') {
      album.count = photos.value.length;
    } else {
      album.count = photos.value.filter(p => p.album === album.name).length;
    }
  });
};

const openLightbox = (photo) => {
  lightboxPhoto.value = photo;
  lightboxIndex.value = filteredPhotos.value.findIndex(p => p.id === photo.id);
};

const closeLightbox = () => {
  lightboxPhoto.value = null;
};

const previousPhoto = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--;
    lightboxPhoto.value = filteredPhotos.value[lightboxIndex.value];
  }
};

const nextPhoto = () => {
  if (lightboxIndex.value < filteredPhotos.value.length - 1) {
    lightboxIndex.value++;
    lightboxPhoto.value = filteredPhotos.value[lightboxIndex.value];
  }
};

const likePhoto = (photo) => {
  photo.liked = !photo.liked;
  photo.likes += photo.liked ? 1 : -1;
};

const downloadPhoto = (photo) => {
  const link = document.createElement('a');
  link.href = photo.url;
  link.download = photo.nom;
  link.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
};

const handleDrop = (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  selectedFiles.value = [...selectedFiles.value, ...files];
};

const getFilePreview = (file) => {
  return URL.createObjectURL(file);
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const uploadPhotos = async () => {
  uploading.value = true;
  
  // Simulation d'upload
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  selectedFiles.value.forEach((file, index) => {
    photos.value.push({
      id: Date.now() + index,
      nom: file.name,
      url: getFilePreview(file),
      album: uploadForm.value.album,
      auteur: uploadForm.value.auteur || 'Invité',
      likes: 0,
      liked: false
    });
  });
  
  updateAlbumCounts();
  selectedFiles.value = [];
  uploading.value = false;
  showUploadModal.value = false;
  alert('Photos partagées ! Elles seront visibles après validation.');
};

const goBack = () => {
  // Détecter d'où vient l'utilisateur basé sur le referrer ou un paramètre
  const from = route.query.from;
  if (from === 'admin') {
    router.push('/dashboard-admin');
  } else {
    router.push('/dashboard-marie');
  }
};

onMounted(() => {
  updateAlbumCounts();
});
</script>

<style scoped>
.galerie-page {
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
  align-items: center;
  gap: 4rem;
  flex-shrink: 0;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-upload:hover {
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

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
}

.albums-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.album-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  color: #6c757d;
}

.album-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.album-btn:hover:not(.active) {
  border-color: #667eea;
  transform: translateY(-1px);
}

.album-icon {
  font-size: 1.2rem;
}

.album-count {
  font-size: 0.85rem;
  opacity: 0.8;
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

.photos-masonry {
  columns: 4;
  column-gap: 1rem;
}

.photo-item {
  break-inside: avoid;
  margin-bottom: 1rem;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.photo-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.photo-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.photo-item:hover .photo-overlay {
  transform: translateY(0);
}

.photo-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.photo-info p {
  margin: 0 0 0.75rem 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-like, .btn-download {
  padding: 0.375rem 0.75rem;
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-like.liked {
  background: rgba(231, 76, 60, 0.8);
}

.btn-like:hover, .btn-download:hover {
  background: rgba(255,255,255,0.3);
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

.upload-zone {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  cursor: pointer;
}

.upload-zone:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.upload-content p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
}

.btn-browse {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
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
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.selected-files {
  margin-top: 1.5rem;
}

.selected-files h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.files-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.file-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel, .btn-upload-confirm {
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

.btn-upload-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-upload-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-upload-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.lightbox {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
}

.lightbox img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.btn-close-lightbox {
  position: absolute;
  top: -60px;
  right: 0;
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
}

.btn-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 2rem;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: rgba(255,255,255,0.3);
}

.btn-nav.prev {
  left: -80px;
}

.btn-nav.next {
  right: -80px;
}

.lightbox-info {
  margin-top: 1rem;
  color: white;
}

.lightbox-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.lightbox-info p {
  margin: 0 0 1rem 0;
  opacity: 0.8;
}

.lightbox-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-like-lg, .btn-download-lg {
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-like-lg.liked {
  background: rgba(231, 76, 60, 0.8);
}

.btn-like-lg:hover, .btn-download-lg:hover {
  background: rgba(255,255,255,0.3);
}

@media (max-width: 1200px) {
  .photos-masonry {
    columns: 3;
  }
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
  }

  .container {
    padding: 1rem;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .albums-nav {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .photos-masonry {
    columns: 2;
  }

  .btn-nav.prev {
    left: -60px;
  }

  .btn-nav.next {
    right: -60px;
  }

  .lightbox-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .photos-masonry {
    columns: 1;
  }

  .btn-nav {
    display: none;
  }
}
</style>