/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import {
  Channel,
  ChannelsMessages,
  Status,
  Member,
  SerializedMessage,
  RawMessage
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

    getJoinedChannelsNames(): string[] {
      return Object.keys(this.channels_messages)
    },

    getMessages(): SerializedMessage[] {
      if (this.active_channel !== null) {
        return this.channels_messages[this.active_channel.name]
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
      if (this.active_channel !== null) {
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
    LoadingSuccess({channel, messages}: {channel:string, messages: SerializedMessage[]}) {
      this.loading = false;
      this.channels_messages[channel] = messages;
    },
    LoadingError(error : Error | null) {
      this.loading = false;
      this.error = error;
    },
    ClearChannel(channel: string) {
      this.active_channel = null;
      delete this.channels_messages[channel]
    },
    SetActiveChannel(channel: Channel) {
      this.active_channel = channel;
    },
    NewMessage({ channel, message }: { channel: string, message: SerializedMessage }) {
      this.channels_messages[channel].push(message);
    },

    //actions from tutorial part 3
    async join(channel: string) {
      try {
        this.LoadingStart();
        const messages = await channelService.join(channel).loadMessages();
        this.LoadingSuccess({ channel, messages })
      } catch(err : any) {
        this.LoadingError(err)
        throw err;
      }
    },

    async leave(channel: string | null) {
      const leaving: string[] = channel !== null ? [channel] : this.getJoinedChannelsNames

      leaving.forEach((c) => {
        channelService.leave(c)
        this.ClearChannel(c)
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
      }, 1);
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

    //called in LeftDrawer
    async loadChannels() {
      const channels = await channelService.fetchChannels()
      this.channels = channels;
    },

    createNewChannel(
      channel_name: string,
      is_public: boolean,
      user_nickname:string,
      user_avatar_color:string,
      status: Status
    ): void {
      const new_channel: Channel = {
        id: Date.now(),
        name: channel_name,
        members: [
          {
            id: 87,
            nickname: user_nickname,
            avatar_color: user_avatar_color,
            status: status,
            live_text: '',
          },
        ],
        type: is_public ? 'public' : 'private',
        admin: true,
      };

      this.channels.push(new_channel);
      this.setActiveChannel(new_channel);
    },

    setActiveChannel(channel: Channel): void {
      this.active_channel = channel;
      //ak nema v channel messages ešte svoje pole messages tak sa vytvorí
      if (!(channel.id.toString() in this.channels_messages)) {
        this.channels_messages[channel.id.toString()] = []
      }
      this.scrollToBottom(false);
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
