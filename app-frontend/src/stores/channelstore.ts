import { defineStore } from 'pinia';
import { Channel, ChannelsMessages, User, Message, Status } from './interfaces';
import { useQuasar } from 'quasar';

const dummyMessages: Array<Message> = [
  {
    id: 1,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    sender_name: 'Matus',
  },
  {
    id: 2,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    sender_name: 'Matus',
  },
  {
    id: 3,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    sender_name: 'Matus',
  },
  {
    id: 4,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    sender_name: 'Matus',
  },
  {
    id: 5,
    message: 'Ahoj',
    send_at: '10.02.2020 9:30',
    sender_name: 'Lucia',
  },
];


const channelMembersList: User[] = [
  {
    id: 5,
    name: 'Lucia',
    surname: 'D',
    nickname: 'a',
    status: Status.online,
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },
  {
    id: 2,
    name: 'Peter',
    surname: 'D',
    status: Status.DND,
    nickname: 'aaaaaa',
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },
  {
    id: 5,
    name: 'Adam',
    surname: 'D',
    status: Status.offline,
    nickname: 'aa',
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },

]

const channelMembersList2: User[] = [
  {
    id: 5,
    name: 'Lucia',
    surname: 'D',
    nickname: 'd',
    status: Status.online,
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },
  {
    id: 2,
    name: 'Peter',
    surname: 'D',
    nickname: 'ddd',
    status: Status.DND,
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },
  {
    id: 5,
    name: 'AdamDDDDLMAO',
    surname: 'D',
    nickname: 'dddddd',
    status: Status.DND,
    email: 'defaultuser@gmail.com',
    password: 'defaultuser123',
  },
]

const dummyChannels: Channel[] = [
  {
    id: 1,
    name: 'Channel 1',
    members: channelMembersList,
    is_public: true,
    admin_id: 0
  },
  {
    id: 2,
    name: 'Channel 2',
    members: channelMembersList,
    is_public: false,
    admin_id: 0
  },
  {
    id: 3,
    name: 'Channel 3',
    members: channelMembersList2,
    is_public: false,
    admin_id: 0
  },
  {
    id: 4,
    name: 'Channel 4',
    members: channelMembersList,
    is_public: true,
    admin_id: 0
  },
  {
    id: 5,
    name: 'Channel 5',
    members: channelMembersList2,
    is_public: false,
    admin_id: 0
  },
  {
    id: 6,
    name: 'Channel 6',
    members: channelMembersList,
    is_public: true,
    admin_id: 0
  },
  {
    id: 7,
    name: 'Channel 7',
    members: channelMembersList2,
    is_public: true,
    admin_id: 0
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
  },

  actions: {
    pushMessage(message: string): void {
      const date = new Date();
      if (this.active_channel !== null) {
        this.channels_messages[this.active_channel.id.toString()].messages.push(
          {
            id: Date.now(),
            message: message,
            send_at: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
            sender_name: 'Matus',
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

    createNewChannel(channel_name: string, is_public: boolean, admin_id: number): void {
      const new_channel: Channel = {
        id: Date.now(),
        name: channel_name,
        members: [], // treba pridat neviem či seba alebo ako to vymysliet - zatial prazdny list
        is_public: is_public,
        admin_id: admin_id
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
