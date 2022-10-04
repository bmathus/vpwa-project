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
    is_public:true
  },
  {
    id:1,
    name:'Channel 3',
    members:[],
    is_public:true
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
    is_public:true
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
    channels:[] as Channel[],
    channels_messages: null as ChannelsMessages | null
  }),

  getters: {
    getChannels () : Channel[]{
      return this.channels;
    }
  },

  actions: {
    
  }
});

