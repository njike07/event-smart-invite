import api from './api';

export default {
  getAll() {
    return api.get('/invites');
  },
  getById(id) {
    return api.get(`/invites/${id}`);
  },
  create(invite) {
    return api.post('/invites', invite);
  },
  update(id, invite) {
    return api.put(`/invites/${id}`, invite);
  },
  delete(id) {
    return api.delete(`/invites/${id}`);
  }
};
