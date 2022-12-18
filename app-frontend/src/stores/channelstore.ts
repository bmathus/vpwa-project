/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import {
  Channel,
  ChannelsMessages,
  Member,
  SerializedMessage,
  RawMessage,

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

    //interface states
    inAppNotification: [] as string[],
    membersDialogOpen: false, //used when /list
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
    addNotification(notification: string) {
      this.inAppNotification.push(notification)
    },

    appendMessages(channelName: string, messages: SerializedMessage[]) {
      if(channelName in this.channels_messages) {
        this.channels_messages[channelName].messages.splice(0,0,...messages)
        this.channels_messages[channelName].page++;
      } else {
        this.channels_messages[channelName] = {
          messages: messages,
          page:1,
          firstReceivedDateTime:'now',
          liveMessages:{}
        }
      }
    },

    LoadingSuccess(channelName: string) {
      this.channels_messages[channelName] = {
        messages:[],
        page:1,
        firstReceivedDateTime:'now',
        liveMessages: {}
      }
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

    NewLiveMessage(channelName: string,senderNickname: string,message: string) {
      if (channelName in this.channels_messages) {
        if (message === '') {
          delete this.channels_messages[channelName].liveMessages[senderNickname]
        } else {
          this.channels_messages[channelName].liveMessages[senderNickname] = message
        }
      }
    },

    NewChannel(channel: Channel): void {
      this.channels.push(channel)
      this.connectTo(channel.name)
      this.SetActiveChannel(channel)
    },

    async addLiveMessage(liveMessage: string) {
      if(this.active_channel !== null) {
        await channelService.in(this.active_channel.name)?.addLiveMessage(liveMessage)
      }
    },


    connectTo(channel: string) {
      try {
        channelService.startConnection(channel)
        this.LoadingSuccess(channel);
      } catch(err : any) {
        throw err;
      }
    },

    async disconnectFrom(channelName: string | null,setGeneral: boolean) {

      let leaving: string[] = []
      if(channelName !== null) {  //odpajame sa z daneho kanala
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
          this.appendMessages(this.active_channel.name,messages)
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

        this.connectTo(channel.name);
        if (channel.name == 'general') {
          this.SetActiveChannel(channel);
        }
      })
      this.channels = channels;

    },

    //join and /create
    async joinChannel(channelName: string,type: 'public' | 'private',creating: boolean):Promise<string> {

      const responce = await channelService.in('general')?.joinChannel(channelName,type,creating)
      console.log(responce)

      if(typeof responce !== 'string' && responce !== undefined) { //kanal sa vytvoril alebo joinol uspesne

        this.NewChannel(responce)

        if((responce as Channel).members.length == 1) {//ak sa vytváral

          return 'Channel created succesfully.'

        } else {// ak sa joinoval
          return 'Channel joined succesfully.'
        }

      } else if(typeof responce === 'string' && responce !== undefined) {//nejake erorrs
        return responce

      } else {
        return 'Error when creating/joining channel.'

      }

    },

    //cancel /quit
    async leaveChannel():Promise<string> {

      if(this.active_channel == null ){
        return 'Error when leaving channel.'
      }

      if(this.active_channel.name === 'general') {
        return 'You cannot leave general.'
      }

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
      else if(typeof result === 'string' && result != undefined){
        return result
      }else {
        return 'Error when leaving channel.'
      }

    },

    // /revoke
    async revokeUser(nickname: string): Promise<string>{
      if(this.active_channel !== null) {
        const result = await channelService.in(this.active_channel.name)?.revokeUser(nickname,this.active_channel.id)
        if (result != undefined) return result
      }
      return 'Error when revoking user.'

    },

    // /kick
    async addKick(nickname: string): Promise<string> {
      if(this.active_channel !== null){
        const result = await channelService.in(this.active_channel.name)?.addKick(nickname, this.active_channel.id)
        if (result != undefined) return result
      }
      return 'Error when kicking user.'
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
