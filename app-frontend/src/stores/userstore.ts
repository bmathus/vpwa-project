import { defineStore } from 'pinia';
import { Invitation, User } from './interfaces';
import { useChannelStore } from './channelstore';

const dummyInvitations: Invitation[] = [
  {
    id: 1,
    channel_id: 23438,
    channel_name: 'Channel 78',
  },
  {
    id: 2,
    channel_id: 23438,
    channel_name: 'Channel 78',
  },
];

export const useUserStore = defineStore('userstore', {
  state: () => ({
    user:  {} as User,
    status: 'online' as string | null,
    invitations: dummyInvitations as Invitation[],
    channelstore: useChannelStore(),
  }),

  getters: {
    getName(): string {
      return this.user.name;
    },
    getStatus(state) {
      return state.status;
    },
    getInvitations(state) {
      return state.invitations;
    },
  },

  actions: {
    makeRegistration(id: number, name: string, surname: string, nickname: string, email: string, password: string): void {

      this.user.id = 1
      this.user.name = name
      this.user.surname = surname
      this.user.nickname = nickname
      this.user.email = email
      this.user.password = password

    },
    acceptInvitation(invitation_id: number): void {
      //todo
      console.log('accepting invitation' + invitation_id);
      
    },
    declineInvitation(invitation_id: number | undefined): void {
      //todo
      console.log('desclining invitation' + invitation_id);

      this.invitations =  this.invitations.filter((obj) => {
        return obj.id !== invitation_id
      })
    
    },
  },
});
