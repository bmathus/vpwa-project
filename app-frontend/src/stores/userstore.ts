import { defineStore } from 'pinia';
import { Invitation, User, Status } from './interfaces';
import { useChannelStore } from './channelstore';

const dummyInvitations: Invitation[] = [
  {
    id: 1,
    channel_id: 23438,
    channel_name: 'Channel 78',
    is_public: false,
  },
  {
    id: 2,
    channel_id: 23438,
    channel_name: 'Channel 78',
    is_public: true,
  },
];

const defaultUser: User = {
  id: 2,
  name: 'Jozko',
  surname: 'Mrkvicka',
  nickname: 'Default User',
  email: 'defaultuser@gmail.com',
  password: 'defaultuser123',
};

export const useUserStore = defineStore('userstore', {
  state: () => ({
    user: defaultUser as User,
    status: Status.online as Status,
    invitations: dummyInvitations as Invitation[],
    channelstore: useChannelStore(),
  }),

  getters: {
    getUser(): User {
      return this.user;
    },
    getStatus(): Status {
      return this.status;
    },
    getInvitations(): Invitation[] {
      return this.invitations;
    },
  },

  actions: {
    makeRegistration(
      id: number,
      name: string,
      surname: string,
      nickname: string,
      email: string,
      password: string
    ): void {
      this.user.id = 1;
      this.user.name = name;
      this.user.surname = surname;
      this.user.nickname = nickname;
      this.user.email = email;
      this.user.password = password;
    },
    setStatus(status: Status) {
      this.status = status;
    },
    acceptInvitation(invitation: Invitation): void {
      this.channelstore.createNewChannel(
        invitation.channel_name,
        invitation.is_public
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
