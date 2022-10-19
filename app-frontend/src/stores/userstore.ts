import { defineStore } from 'pinia';
import { Invitation } from './interfaces';
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
    status: 'online' as string | null,
    invitations: dummyInvitations as Invitation[],
    channelstore: useChannelStore(),
  }),

  getters: {
    getStatus(state) {
      return state.status;
    },
    getInvitations(state) {
      return state.invitations;
    },
  },

  actions: {
    acceptInvitation(invitation_id: number): void {
      //todo
      console.log('accepting invitation' + invitation_id);
    },
    declineInvitation(invitation_id: number): void {
      //todo
      console.log('desclining invitation' + invitation_id);
    },
  },
});
