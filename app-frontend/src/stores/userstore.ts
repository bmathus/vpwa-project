import { defineStore } from 'pinia';
import { Invitation, User, Status } from './interfaces';
import { useChannelStore } from './channelstore';

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

const defaultUser: User = {
  id: 2,
  name: 'Jozko',
  surname: 'Mrkvicka',
  nickname: 'DefaultUser',
  email: 'defaultuser@gmail.com',
  password: 'defaultuser123',
  avatar_color: 'primary',
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
      //todo namiesto creatovania by sa mal joinuť kanal spravit si nejake na joinutie a metodu nato
      this.channelstore.createNewChannel(
        invitation.channel_name,
        invitation.is_public,
        this.user,
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
