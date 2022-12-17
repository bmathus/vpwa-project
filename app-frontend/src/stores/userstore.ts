/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { Invitation, User, Status, RegisterData, LoginCredentials } from '../contracts';
import { useChannelStore } from './channelstore';
import { authManager, authService, channelService, statusService } from 'src/services';

export const useUserStore = defineStore('userstore', {
  state: () => ({
    user: null as User | null,
    status: Status.online as Status,
    notifyOnlyForMe: false,
    auth_status: 'pending' as 'pending' | 'success' | 'error',
    errors: [] as { message: string; field?: string }[],

    invitations: [] as Invitation[],
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
        return 'err'
      }
    },
    async logout() {
      try {
        this.AuthStart();
        await this.channelstore.disconnectFrom(null,false)
        await authService.logout();
        authManager.removeToken();
        this.AuthSuccess(null);
      } catch (err: any) {
        this.AuthError(err);
        throw err;
      }
    },

    async loadInvitations(){
      const invitations = await channelService.loadInvitations()
      this.invitations = invitations;
    },

    async inviteUser(targetUserNickname: string): Promise<string>{
      const activeChannel = this.channelstore.getActiveChannel;
      if(activeChannel !== null) {
        const responce = await channelService.in('general')?.inviteUser(targetUserNickname,activeChannel.id,activeChannel.name);
        return responce !== undefined ? responce : 'Error when inviting user'
      }
      return 'Error when inviting user'
    },

    addReceivedInvitation(invitation: Invitation) {
      this.invitations.push(invitation)
    },

    async setStatus(status: Status) {
      const changed_status = await statusService.changeStatus(status)
      this.status = changed_status;
    },

    async acceptInvitation(invitation: Invitation) {
      //todo namiesto creatovania by sa mal joinuť kanal spravit si nejake na joinutie a metodu nato
      // this.channelstore.createNewChannel(
      //   invitation.channel_name,
      //   invitation.is_public,
      //   this.getUserNickname,
      //   this.getUserAvatarColor,
      //   this.status
      // );
      await this.channelstore.joinChannel(invitation.channel.name, invitation.sender.id)//todo
      await channelService.in('general')?.deleteInvitation(invitation.id)

      this.invitations = this.invitations.filter((obj) => {
        return obj.id !== invitation.id;
      });
    },
    async declineInvitation(invitation_id: number) {

      await channelService.in('general')?.deleteInvitation(invitation_id)
      this.invitations = this.invitations.filter((obj) => {
        return obj.id !== invitation_id;
      });
    },
  },
});
