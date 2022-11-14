/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { User, RegisterData, LoginCredentials } from 'src/contracts';
import { authManager, authService } from 'src/services';

export const useAuthStore = defineStore('authstore', {
  state: () => ({
    user: null as User | null,
    status: 'pending' as 'pending' | 'success' | 'error',
    errors: [] as { message: string; field?: string }[],
  }),

  getters: {
    isAuthenticated(state) {
      return state.user !== null;
    },
  },

  actions: {
    AuthStart() {
      this.status = 'pending';
      this.errors = [];
    },
    AuthSuccess(user: User | null) {
      this.status = 'success';
      this.user = user;
    },
    AuthError(errors: { message: string; field?: string | undefined }[]) {
      this.status = 'error';
      this.errors = errors;
    },

    async check() {
      try {
        this.AuthStart();
        const user = await authService.me();
        this.AuthSuccess(user);
        return user !== null;
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },
    async register(form: RegisterData) {
      try {
        this.AuthStart();
        const user = await authService.register(form);
        this.AuthSuccess(null);
        return user;
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },
    async login(credentials: LoginCredentials) {
      try {
        this.AuthStart();
        const apiToken = await authService.login(credentials);
        this.AuthSuccess(null);
        authManager.setToken(apiToken.token);
        return apiToken;
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },
    async logout() {
      try {
        this.AuthStart();
        await authService.logout();
        this.AuthSuccess(null);
        authManager.removeToken();
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },
  },
});
