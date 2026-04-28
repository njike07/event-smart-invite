import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const marieService = {
  // Créer un compte mariés (inscription)
  async register(marieData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/marie/register`, marieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Connexion des mariés
  async login(email, motDePasse) {
    try {
      const response = await axios.post(`${API_BASE_URL}/marie/login`, {
        email,
        motDePasse
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  // Récupérer tous les comptes mariés (admin seulement)
  async getAll() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/marie/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des comptes' };
    }
  },

  // Créer un compte mariés par l'admin
  async createByAdmin(marieData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/marie/create-by-admin`, marieData, {
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

export default marieService;