/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { Invitation, User, Status, RegisterData, LoginCredentials } from '../contracts';
import { useChannelStore } from './channelstore';
import { authManager, authService } from 'src/services';

const dummyInvitations: Invitation[] = [
  {
    id: 1,
    channel_id: 23438,
    admin_id: 72,
    channel_name: 'Channel 78',
    is_public: false,
  },
  {
    id: 2,
    channel_id: 23438,
    admin_id: 72,
    channel_name: 'Channel 78',
    is_public: true,
  },
];

// const defaultUser: User = {
//   id: 2,
//   name: 'Jozko',
//   surname: 'Mrkvicka',
//   nickname: 'DeeeeeeeeeefaultUser',
//   email: 'defaultuser@gmail.com',
//   avatar_color: 'primary',
// };

export const useUserStore = defineStore('userstore', {
  state: () => ({
    user: null as User | null,
    status: Status.online as Status,
    auth_status: 'pending' as 'pending' | 'success' | 'error',
    errors: [] as { message: string; field?: string }[],

    invitations: dummyInvitations as Invitation[],
    channelstore: useChannelStore(),
  }),

  getters: {
    isAuthenticated(state) {
      return state.user !== null;
    },
    getUser(): User | null {
      return this.user;
    },
    getUserId(): number {
      return this.user == null ? 0 : this.user.id
    },
    getUserNickname(): string {
      return this.user == null ? '' : this.user.nickname
    },
    getUserFullName(): string {
      return this.user == null ? '' : (this.user.name + ' ' + this.user.surname)
    },
    getUserAvatarColor(): string {
      return this.user == null ? '' : this.user.avatar_color
    },
    getStatus(): Status {
      return this.status;
    },
    getInvitations(): Invitation[] {
      return this.invitations;
    },
  },

  actions: {
    //Auth actions
    AuthStart() {
      this.auth_status = 'pending';
      this.errors = [];
    },
    AuthSuccess(user: User | null) {
      this.auth_status = 'success';
      this.user = user;
    },
    AuthError(errors: { message: string; field?: string | undefined }[]) {
      this.auth_status = 'error';
      this.errors = errors;
    },

    async check() {
      try {
        this.AuthStart();
        const user = await authService.me();
        // join user to general channel - hardcoded for now

        if(user?.id !== this.user?.id) {
          await this.channelstore.join('general')
        }

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
        await this.channelstore.leave(null)
        this.AuthSuccess(null);
        authManager.removeToken();
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },

    ////////
    setStatus(status: Status) {
      this.status = status;
    },
    acceptInvitation(invitation: Invitation): void {
      //todo namiesto creatovania by sa mal joinuť kanal spravit si nejake na joinutie a metodu nato
      this.channelstore.createNewChannel(
        invitation.channel_name,
        invitation.is_public,
        this.getUserNickname,
        this.getUserAvatarColor,
        this.status
      );
      this.invitations = this.invitations.filter((obj) => {
        return obj.id !== invitation.id;
      });
    },
    declineInvitation(invitation_id: number): void {
      this.invitations = this.invitations.filter((obj) => {
        return obj.id !== invitation_id;
      });
    },
  },
});
