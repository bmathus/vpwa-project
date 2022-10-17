import { defineStore } from 'pinia';
import { Channel, ChannelsMessages, Message } from './interfaces';

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

const dummyChannels: Channel[] = [
  {
    id: 1,
    name: 'Channel 1',
    members: [],
    is_public: true,
  },
  {
    id: 2,
    name: 'Channel 2',
    members: [],
    is_public: false,
  },
  {
    id: 3,
    name: 'Channel 3',
    members: [],
    is_public: false,
  },
  {
    id: 4,
    name: 'Channel 4',
    members: [],
    is_public: true,
  },
  {
    id: 5,
    name: 'Channel 5',
    members: [],
    is_public: false,
  },
  {
    id: 6,
    name: 'Channel 6',
    members: [],
    is_public: true,
  },
  {
    id: 7,
    name: 'Channel 7',
    members: [],
    is_public: true,
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
    active_channel: {} as Channel,
    infiniteScroll: {} as InfiniteScroll,
  }),

  getters: {
    getMessages(): Message[] {
      return this.channels_messages[this.active_channel.id.toString()].messages;
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
    pushMessage(message: string) {
      const date = new Date();
      this.channels_messages[this.active_channel.id.toString()].messages.push({
        id: Date.now(),
        message: message,
        send_at: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        sender_name: 'Matus',
      });
    },
    fetchMessages(): void {
      this.channels_messages[this.active_channel.id.toString()].messages.push(
        ...dummyMessages
      );
    },
    fetchChannels(): void {
      this.channels = dummyChannels;
      if (this.channels.length !== 0) {
        this.setActiveChannel(this.channels[0]);
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
      this.setActiveChannel(new_channel);
    },

    setActiveChannel(channel: Channel): void {
      this.active_channel = channel;
      if (!(channel.id.toString() in this.channels_messages)) {
        this.channels_messages[channel.id.toString()] = {
          messages: [],
        };
      }
    },

    deleteTargetChannel(id: number | undefined): void {
      this.channels = this.channels.filter((obj) => {
        return obj.id !== id;
      });
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
