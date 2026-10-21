import api from './axios';

export const authApi = {
  register: async ({ name, email, password, timezone }) => {
    const res = await api.post('/api/auth/register', { name, email, password, timezone });
    return res.data;
  },

  login: async ({ email, password }) => {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },

  updateProfile: async ({ name, timezone }) => {
    const res = await api.put('/api/auth/profile', { name, timezone });
    return res.data;
  },
};

export const remindersApi = {
  getReminders: async (filter) => {
    const params = filter && filter !== 'all' ? { filter } : {};
    const res = await api.get('/api/reminders', { params });
    return res.data;
  },

  getReminder: async (id) => {
    const res = await api.get(`/api/reminders/${id}`);
    return res.data;
  },

  createReminder: async ({ title, description, dueAt, notifyBefore }) => {
    const res = await api.post('/api/reminders', {
      title,
      description,
      dueAt,
      notifyBefore: Number(notifyBefore),
    });
    return res.data;
  },

  updateReminder: async (id, data) => {
    const payload = { ...data };
    if (payload.notifyBefore !== undefined) {
      payload.notifyBefore = Number(payload.notifyBefore);
    }
    const res = await api.put(`/api/reminders/${id}`, payload);
    return res.data;
  },

  completeReminder: async (id) => {
    const res = await api.patch(`/api/reminders/${id}/complete`);
    return res.data;
  },

  toggleReminder: async (id) => {
    const res = await api.patch(`/api/reminders/${id}/toggle`);
    return res.data;
  },

  deleteReminder: async (id) => {
    const res = await api.delete(`/api/reminders/${id}`);
    return res.data;
  },

  getDashboard: async () => {
    const res = await api.get('/api/dashboard');
    return res.data;
  },

  sendTestEmail: async () => {
    const res = await api.post('/api/reminders/test-email');
    return res.data;
  },
};
