import { defineStore } from 'pinia';
import { Channel, ChannelsMessages, Message } from './interfaces';

const dummyMessages: Message[] = [
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
    sender_name: 'Matus',
  },
];

const dummyChannels: Channel[] = [
  {
    id: 1,
    name: 'Channel 1',
    members: [],
    is_public: true,
  },
  {
    id: 1,
    name: 'Channel 2',
    members: [],
    is_public: false,
  },
  {
    id: 1,
    name: 'Channel 3',
    members: [],
    is_public: false,
  },
  {
    id: 1,
    name: 'Channel 4',
    members: [],
    is_public: true,
  },
  {
    id: 1,
    name: 'Channel 5',
    members: [],
    is_public: false,
  },
  {
    id: 1,
    name: 'Channel 6',
    members: [],
    is_public: true,
  },
  {
    id: 1,
    name: 'Channel 7',
    members: [],
    is_public: true,
  },
];

export const useChannelStore = defineStore('channelstore', {
  state: () => ({
    channels: [] as Channel[],
    channels_messages: {} as ChannelsMessages | null,
    active_channel: null as Channel | null,
  }),

  getters: {
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
    // fetchMessages(channel_id: number): void {
    //   this.channels_messages[channel_id.toString()] =
    // },
    fetchChannels(): void {
      this.channels = dummyChannels;
      if (this.channels.length !== 0) {
        this.active_channel = this.channels[0];
      }
    },
    createNewChannel(channel_name: string, is_public: boolean): void {
      const new_channel: Channel = {
        id: Date.now(),
        name: channel_name,
        members: [], // treba pridat neviem či seba alebo ako to vymysliet - zatial prazdny list
        is_public: is_public,
      };

      this.channels.push(new_channel);
      this.active_channel = new_channel;
    },

    setActiveChannel(channel: Channel): void {
      this.active_channel = channel;
    },
  },
});
