import { defineStore } from 'pinia';
import inviteService from '../services/inviteService';

export const useInviteStore = defineStore('invite', {
  state: () => ({
    invites: [],
    loading: false
  }),
  
  getters: {
    invitesByGroup: (state) => (group) => {
      return state.invites.filter(i => i.groupe === group);
    },
    totalInvites: (state) => state.invites.length,
    groupCounts: (state) => {
      return {
        Famille: state.invites.filter(i => i.groupe === 'Famille').length,
        Amis: state.invites.filter(i => i.groupe === 'Amis').length,
        Collègues: state.invites.filter(i => i.groupe === 'Collègues').length,
        Autres: state.invites.filter(i => i.groupe === 'Autres').length
      };
    }
  },
  
  actions: {
    async fetchInvites() {
      this.loading = true;
      try {
        const { data } = await inviteService.getAll();
        this.invites = data;
      } finally {
        this.loading = false;
      }
    },
    
    async addInvite(invite) {
      const { data } = await inviteService.create(invite);
      await this.fetchInvites();
      return data;
    },
    
    async updateInvite(id, invite) {
      await inviteService.update(id, invite);
      await this.fetchInvites();
    },
    
    async deleteInvite(id) {
      await inviteService.delete(id);
      await this.fetchInvites();
    }
  }
});
