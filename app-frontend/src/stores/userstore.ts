import { defineStore } from 'pinia';

export const useUserStore = defineStore('userstore', {
  state: () => ({
    status: 'online' as string | null,
  }),

  getters: {
    getStatus(state) {
      return state.status;
    },
  },

  actions: {},
});
