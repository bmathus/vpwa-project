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
    //mustations from tutorial part 3
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
          page:1
        }
      }
    },

    LoadingSuccess(channelName: string) {
      this.loading = false;
      this.channels_messages[channelName] = {
        messages:[],
        page:1
      }
    },

    LoadingError(error : Error | null) {
      this.loading = false;
      this.error = error;
    },

    SetActiveChannel(channel: Channel) {
      //const numOfMessages = this.channels_messages[channel.name].messages.length
      //this.channels_messages[channel.name].page = Math.floor(numOfMessages/8) + 1;

      this.active_channel = channel;
      //this.scrollToBottom(false);
    },
    NewMessage({ channel, message }: { channel: string, message: SerializedMessage }) {
      this.channels_messages[channel].messages.push(message);
    },

    //actions from tutorial part 3
    async connectTo(channel: string) {
      try {
        this.LoadingStart();
        await channelService.startConnection(channel)
        this.LoadingSuccess(channel);
      } catch(err : any) {
        this.LoadingError(err)
        throw err;
      }
    },

    async disconnectFrom(channelName: string | null) {

      let leaving: string[] = []
      if(channelName !== null) { //odpajame sa z daneho kanala
        leaving = [channelName]

        this.channels = this.channels.filter((channel) => {
          return channel.name !== channelName;
        });

        this.SetActiveChannel(this.channels[0]) //general bude default

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
      this.NewMessage({channel,message: newMessage})
      this.scrollToBottom(true);
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

    // pushMessage(message: string, user: User | null): void {
    //   const date = new Date();
    //   if (this.active_channel !== null) {
    //     this.channels_messages[this.active_channel.id.toString()].messages.push(
    //       {
    //         id: Date.now(),
    //         message: message,
    //         send_at: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
    //         user_id: user == null ? 0 : user.id,
    //         sender_nickname: user == null ? '' : user.nickname,
    //       }
    //     );
    //     this.scrollToBottom(true);
    //   }
    // },

    // fetchMessages(): void {
    //   if (this.active_channel !== null) {
    //     this.channels_messages[this.active_channel.id.toString()].messages.push(
    //       ...dummyMessages
    //     );
    //   }
    // },

    async loadMessages(): Promise<'load_more' | 'no_messages'> {
      if(this.active_channel !== null ) {
        const id = this.active_channel.id;
        const page = this.channels_messages[this.active_channel.name].page
        const messages = await channelService.in(this.active_channel.name)?.loadMessages(id,page) as SerializedMessage[]
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
      await channels.forEach(async (channel)=>{
        console.log(channel.members)
        await this.connectTo(channel.name)
        if(channel.name == 'general'){
          this.SetActiveChannel(channel)
        }
      })
      this.channels = channels;
    },


    async createChannel(channel_name: string, type:'public'|'private') {

      const new_channel = await channelService.in('general')?.createChannel(channel_name,type)

      if (new_channel as Channel) {
        this.channels.push(new_channel as Channel)
        this.SetActiveChannel(new_channel as Channel)
        await this.connectTo((new_channel as Channel).name)

      } else if (new_channel as ErrorMessage) {
        console.log((new_channel as ErrorMessage).message)
      } else {
        console.log('error pri vytvarani kanala')
      }

    },

    async leaveChannel():Promise<string> {

      if(this.active_channel != null){

        if(this.active_channel.name !== 'general') {
          const result = await channelService.in(this.active_channel.name)?.leaveChannel(this.active_channel.id)

          if(result == false )
          {
            await this.disconnectFrom(this.active_channel?.name)
            return 'Channel left successfully';

          }
          else if(result == true )
          {
            await this.disconnectFrom(this.active_channel?.name)
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

    checkDuplicateChannel(name: string): number {
      const new_channel = this.channels?.filter(
        (channel) => channel.name === name
      );

      if (new_channel.length == 0) {
        return 1;
      } else {
        return 2;
      }

      return 0;
    },

    addKick(nickname: string): number {
      const len = this.active_channel?.members.length;

      const new_members = this.active_channel?.members.filter(
        (member) => member.nickname !== nickname
      );

      if (new_members != undefined) {
        if (len == this.active_channel?.members.length) {
          return 2;
        }
      }
      return 1;
    },
  },
});
