/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import {
  Channel,
  ChannelsMessages,
  Member,
  SerializedMessage,
  RawMessage,
  ErrorMessage

} from '../contracts';
import { useQuasar } from 'quasar';
import { channelService } from 'src/services';

interface InfiniteScroll {
  stopOnLoad: () => void;
  resumeOnLoad: () => void;
  scrollBottom: (smooth: boolean) => void;
}

export const useChannelStore = defineStore('channelstore', {
  state: () => ({
    //data states
    channels: [] as Channel[],
    channels_messages: {} as ChannelsMessages,
    active_channel: null as Channel | null,
    loading: false as boolean,
    error: null as Error | null,

    membersDialogOpen: false,
    infiniteScroll: {} as InfiniteScroll,
    q: useQuasar(),
  }),

  getters: {

    getChannelsNames(): string[] {
      return this.channels.map(({name})=>{
        return name
      })
    },

    getMessages(): SerializedMessage[] {
      if (this.active_channel !== null) {
        return this.channels_messages[this.active_channel.name]?.messages
      }
      return [];
    },

    getPublicChannels(): Channel[] {
      return this.channels.filter((channel) => channel.type === 'public');
    },
    getPrivateChannels(): Channel[] {
      return this.channels.filter((channel) => channel.type === 'private');
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
      if (this.active_channel?.members !== undefined) {
        return this.active_channel.members;
      }
      return [];
    },
  },

  actions: {
    LoadingStart() {
      this.loading = true;
      this.error = null;
    },

    AppendMessages(channelName: string, messages: SerializedMessage[]) {
      if(channelName in this.channels_messages) {
        this.channels_messages[channelName].messages.splice(0,0,...messages)
        this.channels_messages[channelName].page++;
      } else {
        this.channels_messages[channelName] = {
          messages: messages,
          page:1,
          firstReceivedDateTime:'now'
        }
      }
    },

    LoadingSuccess(channelName: string) {
      this.loading = false;
      this.channels_messages[channelName] = {
        messages:[],
        page:1,
        firstReceivedDateTime:'now'
      }
    },

    LoadingError(error : Error | null) {
      this.loading = false;
      this.error = error;
    },

    SetActiveChannel(channel: Channel) {
      this.active_channel = channel;
      //this.scrollToBottom(false);
    },
    NewMessage({ channel, message }: { channel: string, message: SerializedMessage }) {
      this.channels_messages[channel].messages.push(message);
      if(this.active_channel?.name == channel) {
        this.scrollToBottom(true)
      }

    },

    //actions from tutorial part 3
    connectTo(channel: string) {
      try {
        this.LoadingStart();
        channelService.startConnection(channel)
        this.LoadingSuccess(channel);
      } catch(err : any) {
        this.LoadingError(err)
        throw err;
      }
    },

    async disconnectFrom(channelName: string | null,setGeneral: boolean) {

      let leaving: string[] = []
      if(channelName !== null) { //odpajame sa z daneho kanala
        leaving = [channelName]

        this.channels = this.channels.filter((channel) => {
          return channel.name !== channelName;
        });

        if(setGeneral) {
          this.SetActiveChannel(this.channels[0]) //general bude default
        }

      }else {// odpajame sa zo vsetkých -> použite pri loggount
        leaving = this.getChannelsNames
        this.active_channel = null;
        this.channels = []
      }

      leaving.forEach((channelName) => {
        channelService.disconnect(channelName)
        delete this.channels_messages[channelName]
      })

    },

    async addMessage({ channel, message }: { channel: string, message: RawMessage }) {
      const newMessage = await channelService.in(channel)?.addMessage(message) as SerializedMessage
      if(this.channels_messages[channel].firstReceivedDateTime === 'now') {
        this.channels_messages[channel].firstReceivedDateTime = newMessage.send_at;
      }
      this.NewMessage({channel,message: newMessage})
    },

    async loadMessages(): Promise<'load_more' | 'no_messages'> {
      if(this.active_channel !== null ) {
        const id = this.active_channel.id;
        const page = this.channels_messages[this.active_channel.name].page
        const firstReceivedDateTime = this.channels_messages[this.active_channel.name].firstReceivedDateTime

        const messages = await channelService.in(this.active_channel.name)?.loadMessages(id,page,firstReceivedDateTime) as SerializedMessage[]
        if(messages.length !== 0) {
          this.AppendMessages(this.active_channel.name,messages)
          return 'load_more'
        } else {
          return 'no_messages'
        }
      }
      return 'no_messages'

    },

    //called in LeftDrawer
    async loadChannels() {
      const channels = await channelService.loadChannels()

      channels.forEach(async (channel) => {
        console.log(channel.members);
        this.connectTo(channel.name);
        if (channel.name == 'general') {
          this.SetActiveChannel(channel);
        }
      })
      this.channels = channels;
      console.log('kanaly ulozene')
    },


    async createChannel(channel_name: string, type:'public'|'private'): Promise<string> {
      const new_channel = await channelService.in('general')?.createChannel(channel_name,type)

      if (new_channel !== 'Channel already exists.') {
        this.channels.push(new_channel as Channel)
        await this.connectTo((new_channel as Channel).name)
        this.SetActiveChannel(new_channel as Channel)
        return 'Channel is created succesfully.'

      } else if (new_channel === 'Channel already exists.') { //channel exists

        return new_channel
      } else {

        return 'Error when creating channel.'
      }

    },

    async joinChannel(channel_name: string,  sender: number | null):Promise<string | null> {

      const new_channel = await channelService.in('general')?.joinChannel(channel_name, sender)

      if (typeof new_channel !== 'string') {
        console.log(new_channel)
        this.channels.push(new_channel as Channel)
        await this.connectTo((new_channel as Channel).name)
        this.SetActiveChannel(new_channel as Channel)
        return null

      } else if (typeof new_channel === 'string') {
    
        console.log(new_channel)
        return new_channel

      } else {
        console.log('error pri vytvarani kanala')
        return (new_channel as ErrorMessage).message
      }
     
    },

    async leaveChannel():Promise<string> {

      if(this.active_channel != null ){

        if(this.active_channel.name !== 'general') {
          const result = await channelService.in(this.active_channel.name)?.leaveChannel(this.active_channel.id)

          if(result == false )
          {
            await this.disconnectFrom(this.active_channel?.name,true)
            return 'Channel left successfully';

          }
          else if(result == true )
          {
            await this.disconnectFrom(this.active_channel?.name,true)
            return 'Channel destroyed successfully';
          }
          else {
            return 'Fail'
          }

        } else {
          return 'You cannot leave general.'
        }

      }

      return 'Fail'

    },


    makeRevoke(nickname: string): number {
      const len = this.active_channel?.members.length;

      const new_members = this.active_channel?.members.filter(
        (member) => member.nickname !== nickname
      );

      if (new_members != undefined) {
        if (this.active_channel !== null) {
          this.active_channel.members = new_members;
        }

        if (len == this.active_channel?.members.length) {
          return 2;
        }
      }
      return 1;
    },


    async addKick(nickname: string): Promise<number> {
      if(this.active_channel != undefined)
      await channelService.in(this.active_channel.name)?.addKick(nickname, this.active_channel.id)
      return 1;
    },

    //template controll actions
    stopMessagesLoading(): void {
      this.infiniteScroll.stopOnLoad();
    },
    resumeMessagesLoading(): void {
      this.infiniteScroll.resumeOnLoad();
    },
    scrollToBottom(smooth: boolean): void {
      setTimeout(() => {
        this.infiniteScroll.scrollBottom(smooth);
      }, 0.001);
    },
    toogleMembersDialog(): void {
      this.stopMessagesLoading();

      setTimeout(() => {
        this.membersDialogOpen = !this.membersDialogOpen;
      }, 20);
    },
  },
});
