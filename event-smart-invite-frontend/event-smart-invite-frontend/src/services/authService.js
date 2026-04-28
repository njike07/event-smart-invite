import api from './api';

export default {
  loginAdmin(telephone, password) {
    return api.post('/auth/login', { telephone, password });
  },
  loginMarie(telephone, password) {
    return api.post('/maries/login', { telephone, password });
  },
  loginPhotographe(telephone, password) {
    return api.post('/photographe/login', { telephone, password });
  }
};
