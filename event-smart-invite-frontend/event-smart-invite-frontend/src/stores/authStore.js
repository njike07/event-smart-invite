import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    role: localStorage.getItem('role') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    isMarie: (state) => state.role === 'marie',
    isPhotographe: (state) => state.role === 'photographe'
  },
  
  actions: {
    async loginAdmin(telephone, password) {
      const { data } = await authService.loginAdmin(telephone, password);
      this.setAuth(data.token, data.admin, 'admin');
    },
    
    async loginMarie(telephone, password) {
      const { data } = await authService.loginMarie(telephone, password);
      this.setAuth(data.token, data.marie, 'marie');
    },
    
    async loginPhotographe(telephone, password) {
      const { data } = await authService.loginPhotographe(telephone, password);
      this.setAuth(data.token, data.photographe, 'photographe');
    },
    
    setAuth(token, user, role) {
      this.token = token;
      this.user = user;
      this.role = role;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
    },
    
    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    
    // Méthode temporaire pour simuler un utilisateur marié (pour les tests)
    simulateMarieUser() {
      const mockUser = {
        id: 1,
        nomMarie: 'Pierre',
        nomMariee: 'Sophie',
        email: 'pierre.sophie@example.com',
        telephone: '0612345678',
        dateMariage: '2024-08-15'
      };
      this.setAuth('mock-token', mockUser, 'marie');
    },
    
    // Méthode temporaire pour simuler un admin (pour les tests)
    simulateAdminUser() {
      const mockUser = {
        id: 1,
        nom: 'Admin',
        email: 'admin@example.com'
      };
      this.setAuth('mock-token', mockUser, 'admin');
    }
  }
});
