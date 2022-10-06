import { defineStore } from 'pinia';
import { Channel , ChannelsMessages } from './interfaces'


const dummyChannels: Channel[] = [
  {
    id:1,
    name:'Channel 1',
    members:[],
    is_public:true
  },
  {
    id:1,
    name:'Channel 2',
    members:[],
    is_public:false
  },
  {
    id:1,
    name:'Channel 3',
    members:[],
    is_public:false
  },
  {
    id:1,
    name:'Channel 4',
    members:[],
    is_public:true
  },
  {
    id:1,
    name:'Channel 5',
    members:[],
    is_public:false
  },
  {
    id:1,
    name:'Channel 6',
    members:[],
    is_public:true
  },
  {
    id:1,
    name:'Channel 7',
    members:[],
    is_public:true
  },
]

export const useChannelStore = defineStore('channelstore', {
  state: () => ({
    channels:dummyChannels as Channel[],
    channels_messages: null as ChannelsMessages | null
  }),

  getters: {
    getPublicChannels () : Channel[]{
      return this.channels.filter((channel) => channel.is_public === true);
    },
    getPrivateChannels() :Channel[] {
      return this.channels.filter((channel) => channel.is_public === false);
    }
  },

  actions: {
    createNewChannel(channel_name: string,is_public: boolean): void {
      this.channels.push({
        id:Date.now(),
        name:channel_name,
        members:[], // treba pridat neviem či seba alebo ako to vymysliet - zatial prazdny list
        is_public:is_public
      })
    }
    
  }
});

