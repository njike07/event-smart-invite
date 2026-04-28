<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="nav-brand">
        <span class="logo">📷</span>
        <h2>Dashboard Photographe</h2>
      </div>
      <div class="nav-user">
        <button @click="handleLogout" class="btn-logout">
          <span class="logout-icon">🚪</span>
          Déconnexion
        </button>
      </div>
    </nav>

    <div class="container">
      <!-- Zone d'upload principale -->
      <div class="upload-section">
        <div class="upload-header">
          <h1>📤 Upload de Photos</h1>
          <p>Glissez vos photos ici ou cliquez pour les sélectionner</p>
        </div>

        <div 
          class="upload-zone" 
          @drop="handleDrop" 
          @dragover.prevent 
          @dragenter.prevent
          :class="{ 'drag-over': isDragOver }"
          @dragenter="isDragOver = true"
          @dragleave="isDragOver = false"
        >
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            multiple 
            accept="image/*" 
            hidden 
          />
          <div class="upload-content">
            <div class="upload-icon">📸</div>
            <h3>Glissez vos photos ici</h3>
            <p>ou <button @click="$refs.fileInput.click()" class="btn-browse">parcourez vos fichiers</button></p>
            <small>Formats acceptés: JPG, PNG, WEBP (max 10MB par photo)</small>
          </div>
        </div>

        <!-- Configuration de l'upload -->
        <div class="upload-config">
          <div class="config-row">
            <div class="form-group">
              <label>Album de destination</label>
              <select v-model="uploadConfig.album">
                <option v-for="album in albums" :key="album" :value="album">{{ album }}</option>
              </select>
              <button @click="showNewAlbumModal = true" class="btn-new-album">+ Nouvel album</button>
            </div>
            
            <div class="form-group">
              <label>Tags (optionnel)</label>
              <input v-model="uploadConfig.tags" placeholder="cérémonie, famille, groupe..." />
            </div>
          </div>
        </div>
      </div>

      <!-- Photos sélectionnées -->
      <div v-if="selectedFiles.length > 0" class="selected-files">
        <h3>📋 Photos sélectionnées ({{ selectedFiles.length }})</h3>
        <div class="files-grid">
          <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview">
            <img :src="getFilePreview(file)" :alt="file.name" />
            <div class="file-info">
              <h4>{{ file.name }}</h4>
              <p>{{ formatFileSize(file.size) }}</p>
            </div>
            <button @click="removeFile(index)" class="btn-remove">✕</button>
          </div>
        </div>
        
        <div class="upload-actions">
          <button @click="clearFiles" class="btn-clear">🗑️ Tout effacer</button>
          <button @click="uploadFiles" :disabled="uploading" class="btn-upload">
            <span v-if="!uploading">📤 Uploader {{ selectedFiles.length }} photo(s)</span>
            <span v-else>⏳ Upload en cours... {{ uploadProgress }}%</span>
          </button>
        </div>
      </div>

      <!-- Historique des uploads -->
      <div class="upload-history">
        <h3>📆 Historique des uploads</h3>
        <div class="history-stats">
          <div class="stat-item">
            <span class="stat-number">{{ uploadStats.total }}</span>
            <span class="stat-label">Total uploadées</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ uploadStats.pending }}</span>
            <span class="stat-label">En attente</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ uploadStats.approved }}</span>
            <span class="stat-label">Validées</span>
          </div>
        </div>

        <div class="recent-uploads">
          <h4>Uploads récents</h4>
          <div class="upload-list">
            <div v-for="upload in recentUploads" :key="upload.id" class="upload-item">
              <div class="upload-thumbnail">
                <img :src="upload.thumbnail" :alt="upload.name" />
              </div>
              <div class="upload-details">
                <h5>{{ upload.name }}</h5>
                <p>{{ upload.album }} • {{ formatDate(upload.date) }}</p>
              </div>
              <div class="upload-status" :class="upload.status">
                <span v-if="upload.status === 'pending'">⏳ En attente</span>
                <span v-if="upload.status === 'approved'">✅ Validée</span>
                <span v-if="upload.status === 'rejected'">❌ Refusée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouvel Album -->
    <div v-if="showNewAlbumModal" class="modal-overlay" @click="showNewAlbumModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>🖼️ Créer un nouvel album</h3>
          <button @click="showNewAlbumModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nom de l'album</label>
            <input v-model="newAlbumName" placeholder="Ex: Cocktail, Première danse..." />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showNewAlbumModal = false" class="btn-cancel">Annuler</button>
          <button @click="createAlbum" class="btn-create">Créer</button>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal modal-small" @click.stop>
        <div class="modal-body success-content">
          <div class="success-icon">🎉</div>
          <h3>Upload réussi !</h3>
          <p>{{ uploadedCount }} photo(s) uploadée(s) avec succès. Elles seront visibles après validation.</p>
          <button @click="showSuccessModal = false" class="btn-ok">Parfait !</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isDragOver = ref(false);
const selectedFiles = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const showNewAlbumModal = ref(false);
const showSuccessModal = ref(false);
const newAlbumName = ref('');
const uploadedCount = ref(0);

const uploadConfig = ref({
  album: 'Cérémonie',
  tags: ''
});

const albums = ref([
  'Cérémonie',
  'Cocktail', 
  'Réception',
  'Première danse',
  'Soirée',
  'Portraits',
  'Groupe famille',
  'Spontanées'
]);

const uploadStats = ref({
  total: 156,
  pending: 14,
  approved: 142
});

const recentUploads = ref([
  {
    id: 1,
    name: 'IMG_001.jpg',
    album: 'Cérémonie',
    date: '2024-06-15T16:30:00',
    status: 'approved',
    thumbnail: 'https://picsum.photos/80/80?random=1'
  },
  {
    id: 2,
    name: 'IMG_002.jpg', 
    album: 'Cocktail',
    date: '2024-06-15T15:45:00',
    status: 'pending',
    thumbnail: 'https://picsum.photos/80/80?random=2'
  },
  {
    id: 3,
    name: 'IMG_003.jpg',
    album: 'Réception',
    date: '2024-06-15T14:20:00',
    status: 'approved',
    thumbnail: 'https://picsum.photos/80/80?random=3'
  }
]);

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  addFiles(files);
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
};

const addFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  selectedFiles.value = [...selectedFiles.value, ...imageFiles];
};

const getFilePreview = (file) => {
  return URL.createObjectURL(file);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const clearFiles = () => {
  selectedFiles.value = [];
};

const uploadFiles = async () => {
  uploading.value = true;
  uploadProgress.value = 0;
  
  // Simulation d'upload avec progression
  const totalFiles = selectedFiles.value.length;
  for (let i = 0; i < totalFiles; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100);
  }
  
  uploadedCount.value = totalFiles;
  uploadStats.value.total += totalFiles;
  uploadStats.value.pending += totalFiles;
  
  // Ajouter aux uploads récents
  selectedFiles.value.forEach((file, index) => {
    recentUploads.value.unshift({
      id: Date.now() + index,
      name: file.name,
      album: uploadConfig.value.album,
      date: new Date().toISOString(),
      status: 'pending',
      thumbnail: getFilePreview(file)
    });
  });
  
  selectedFiles.value = [];
  uploading.value = false;
  showSuccessModal.value = true;
};

const createAlbum = () => {
  if (newAlbumName.value.trim()) {
    albums.value.push(newAlbumName.value.trim());
    uploadConfig.value.album = newAlbumName.value.trim();
    newAlbumName.value = '';
    showNewAlbumModal.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  // Initialisation
});
</script>

<style scoped>
.dashboard {
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

.nav-user {
  display: flex;
  align-items: center;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.logout-icon {
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.upload-header {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.upload-zone {
  border: 3px dashed #dee2e6;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  margin-bottom: 2rem;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #43cea2;
  background: #f8fff8;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.upload-content p {
  margin: 0 0 1rem 0;
  color: #6c757d;
}

.btn-browse {
  background: none;
  border: none;
  color: #43cea2;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.upload-config {
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
}

.config-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #43cea2;
}

.btn-new-album {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #43cea2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}

.selected-files {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.selected-files h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.file-preview {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.file-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.file-info {
  padding: 0.75rem;
}

.file-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
}

.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-upload {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 206, 162, 0.4);
}

.btn-upload:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.upload-history {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.upload-history h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #43cea2;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
}

.recent-uploads h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.upload-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.upload-thumbnail img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.upload-details {
  flex: 1;
}

.upload-details h5 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.upload-details p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.upload-status {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.upload-status.pending {
  background: #fff3cd;
  color: #856404;
}

.upload-status.approved {
  background: #d4edda;
  color: #155724;
}

.upload-status.rejected {
  background: #f8d7da;
  color: #721c24;
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

.modal-header h3 {
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

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel, .btn-create {
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

.btn-create {
  background: #43cea2;
  color: white;
}

.success-content {
  text-align: center;
  padding: 3rem 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-content h3 {
  color: #28a745;
  margin-bottom: 1rem;
}

.success-content p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.btn-ok {
  padding: 0.75rem 2rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .config-row {
    grid-template-columns: 1fr;
  }
  
  .files-grid {
    grid-template-columns: 1fr;
  }
  
  .history-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .upload-actions {
    flex-direction: column;
  }
}
</style>