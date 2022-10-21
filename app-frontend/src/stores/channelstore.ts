import { defineStore } from 'pinia';
import {
  Channel,
  ChannelsMessages,
  Message,
  Status,
  Member,
  User,
} from './interfaces';
import { useQuasar } from 'quasar';

const dummyMessages: Array<Message> = [
  {
    id: 1,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    user_id: 2,
    sender_nickname: 'DefaultUser',
  },
  {
    id: 2,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    user_id: 2,
    sender_nickname: 'DefaultUser',
  },
  {
    id: 3,
    message: 'Ahoj @DefaultUser',
    send_at: '10.02.2020 9:30',
    user_id: 99,
    sender_nickname: 'Lucia',
  },
  {
    id: 4,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    user_id: 2,
    sender_nickname: 'DefaultUser',
  },
  {
    id: 5,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    user_id: 99,
    sender_nickname: 'Lucia',
  },
];

const channelMembersList: Member[] = [
  {
    id: 87,
    nickname: 'Lucia',
    avatar_color: 'primary',
    status: Status.online,
  },
  {
    id: 45,
    nickname: 'Peter',
    avatar_color: 'orange',
    status: Status.DND,
  },
  {
    id: 13,
    nickname: 'Adam',
    avatar_color: 'blue',
    status: Status.online,
  },
];

const channelMembersList2: Member[] = [
  {
    id: 87,
    nickname: 'Lucia',
    avatar_color: 'primary',
    status: Status.online,
  },
  {
    id: 45,
    nickname: 'Peter',
    avatar_color: 'orange',
    status: Status.DND,
  },
  {
    id: 13,
    nickname: 'Adam',
    avatar_color: 'blue',
    status: Status.offline,
  },
  {
    id: 87,
    nickname: 'David',
    avatar_color: 'red',
    status: Status.online,
  },
  {
    id: 45,
    nickname: 'Jozo raz',
    avatar_color: 'green',
    status: Status.DND,
  },
  {
    id: 13,
    nickname: 'Adam',
    avatar_color: 'blue',
    status: Status.offline,
  },
];

const dummyChannels: Channel[] = [
  {
    id: 1,
    name: 'Channel 1',
    members: channelMembersList,
    is_public: true,
    admin_id: 2,
  },
  {
    id: 2,
    name: 'Channel 2',
    members: channelMembersList,
    is_public: false,
    admin_id: 2,
  },
  {
    id: 3,
    name: 'Channel 3',
    members: channelMembersList2,
    is_public: false,
    admin_id: 0,
  },
  {
    id: 4,
    name: 'Channel 4',
    members: channelMembersList,
    is_public: true,
    admin_id: 2,
  },
  {
    id: 5,
    name: 'Channel 5',
    members: channelMembersList2,
    is_public: false,
    admin_id: 0,
  },
  {
    id: 6,
    name: 'Channel 6',
    members: channelMembersList,
    is_public: true,
    admin_id: 0,
  },
  {
    id: 7,
    name: 'Channel 7',
    members: channelMembersList2,
    is_public: true,
    admin_id: 0,
  },
];

interface InfiniteScroll {
  stopOnLoad: () => void;
  resumeOnLoad: () => void;
}

export const useChannelStore = defineStore('channelstore', {
  state: () => ({
    channels: [] as Channel[],
    channels_messages: {} as ChannelsMessages,
    active_channel: null as Channel | null,
    //other imports
    infiniteScroll: {} as InfiniteScroll,
    q: useQuasar(),
  }),

  getters: {
    getMessages(): Message[] {
      if (this.active_channel !== null) {
        return this.channels_messages[this.active_channel.id.toString()]
          .messages;
      }
      return [];
    },
    getPublicChannels(): Channel[] {
      return this.channels.filter((channel) => channel.is_public === true);
    },
    getPrivateChannels(): Channel[] {
      return this.channels.filter((channel) => channel.is_public === false);
    },
    getActiveChannel(): Channel | null {
      return this.active_channel;
    },
    channelsAreEmpty(): boolean {
      if (this.channels.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    getActiveChannelMembers(): Member[] {
      if (this.active_channel !== null) {
        return this.active_channel.members;
      }
      return [];
    },
  },

  actions: {
    pushMessage(message: string, user: User): void {
      const date = new Date();
      if (this.active_channel !== null) {
        this.channels_messages[this.active_channel.id.toString()].messages.push(
          {
            id: Date.now(),
            message: message,
            send_at: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
            user_id: user.id,
            sender_nickname: user.nickname,
          }
        );
      }
    },

    fetchMessages(): void {
      if (this.active_channel !== null) {
        this.channels_messages[this.active_channel.id.toString()].messages.push(
          ...dummyMessages
        );
      }
    },
    fetchChannels(): void {
      this.channels = dummyChannels;
      if (this.channels.length !== 0) {
        this.setActiveChannel(this.channels[0]);
      }
    },

    createNewChannel(
      channel_name: string,
      is_public: boolean,
      user: User,
      status: Status
    ): void {
      const new_channel: Channel = {
        id: Date.now(),
        name: channel_name,
        members: [
          {
            id: 87,
            nickname: user.nickname,
            avatar_color: user.avatar_color,
            status: status,
          },
        ],
        is_public: is_public,
        admin_id: user.id,
      };

      this.channels.push(new_channel);
      this.setActiveChannel(new_channel);
    },

    setActiveChannel(channel: Channel): void {
      this.active_channel = channel;
      //ak nema v channel messages ešte svoje pole messages tak sa vytvorí
      if (!(channel.id.toString() in this.channels_messages)) {
        this.channels_messages[channel.id.toString()] = {
          messages: [],
        };
      }
    },

    leaveChannel(id: number | null): void {
      this.q.notify({
        type: 'info',
        message: 'You left channel: ' + this.getActiveChannel?.name,
        color: 'teal',
        timeout: 2500,
      });

      this.channels = this.channels.filter((obj) => {
        return obj.id !== id;
      });

      //nastavenie active kanala po tom ako leavneš kanal
      if (this.channels.length === 0) {
        this.active_channel = null;
      } else {
        //po livnuti kanala ak som clenom nejakych kanalov tak bude aktivny prvy v zozname kanalov
        this.setActiveChannel(this.channels[0]);
      }

      delete this.channels_messages[id !== null ? id.toString() : ''];
    },

    //infinite scroll control - kvoli members dialogu
    stopMessagesLoading(): void {
      this.infiniteScroll.stopOnLoad();
    },
    resumeMessagesLoading(): void {
      this.infiniteScroll.resumeOnLoad();
    },
  },
});
