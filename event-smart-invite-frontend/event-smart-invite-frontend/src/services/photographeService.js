import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const photographeService = {
  // Créer un compte photographe (inscription)
  async register(photographeData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/photographe/register`, photographeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Connexion des photographes
  async login(email, motDePasse) {
    try {
      const response = await axios.post(`${API_BASE_URL}/photographe/login`, {
        email,
        motDePasse
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  // Récupérer tous les comptes photographes (admin seulement)
  async getAll() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/photographe/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des comptes' };
    }
  },

  // Créer un compte photographe par l'admin
  async createByAdmin(photographeData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/photographe/create-by-admin`, photographeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du compte' };
    }
  }
};

export default photographeService;