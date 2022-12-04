import { RawMessage, SerializedMessage, Channel,ErrorMessage,Member, Invitation } from 'src/contracts'
import { SocketManager } from './SocketManager'
import {useChannelStore} from '../stores/channelstore'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userstore';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe (): void {
    const channel = this.namespace.split('/').pop() as string
    const channelstore = useChannelStore()
    const userstore = useUserStore()


    this.socket.on('message', (message: SerializedMessage) => {
      console.log(message)

      if(channelstore.channels_messages[channel].firstReceivedDateTime === 'now') {
        channelstore.channels_messages[channel].firstReceivedDateTime = message.send_at;
      }

      channelstore.NewMessage({channel,message})
    })

    this.socket.on('addMember', (member: Member,channelId: number) => {
      const chIndex = channelstore.channels.findIndex((channel) => channel.id === channelId)

      if(chIndex !== -1) {
        channelstore.channels[chIndex].members.push(member);
      }

      // channelstore.active_channel?.members.push({id: user.id, nickname: user.nickname, avatar_color: user.avatar_color, status: Status.online})
      // console.log(user)

    })

    this.socket.on('deleteMember', (userId: number) => {
      const chIndex = channelstore.channels.findIndex((ch) => ch.name === channel)

      if(chIndex !== -1) {
        channelstore.channels[chIndex].members = channelstore.channels[chIndex].members.filter(
          (member) => member.id !== userId
        );
      }

    })

    this.socket.on('channelCanceled',(channelName: string) => {
      const $q = useQuasar()
      if(channelstore.getActiveChannel?.name == channelName) {
        channelstore.disconnectFrom(channelName,true)
      } else {
        channelstore.disconnectFrom(channelName,false)
      }

      //nefunguje ten notify odtialto neviem prečo
      $q.notify({
        type: 'info',
        message: 'Channel '+channelName+' was removed by his admin.',
        color: 'teal',
        timeout: 2500,
      });

    })

    this.socket.on('invite',(newInvite: Invitation) => {
      if(newInvite.user_id === userstore.getUserId) {
        userstore.addReceivedInvitation(newInvite)
      }
    })

  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (channelId: number,page: number,firstReceivedDateTime: string): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages', channelId,page,firstReceivedDateTime)
  }

  public createChannel (channelName: string, type:'public'|'private'): Promise<Channel| string> {
    return this.emitAsync('createChannel',channelName,type)
  }

  public joinChannel (channelName: string, sender: number | null): Promise<Channel|string> {
    return this.emitAsync('joinChannel',channelName, sender)
  }

  public leaveChannel (channel_id: number): Promise<boolean|ErrorMessage> {
    return this.emitAsync('leaveChannel',channel_id)
  }

  public inviteUser (targetUserNickname: string,channelId: number, channelName: string): Promise<string> {
    return this.emitAsync('inviteUser', targetUserNickname,channelId,channelName)
  }

  public deleteInvitation (id: number): Promise<string> {
    return this.emitAsync('deleteInvitation', id)
  }

  public addKick (nickname: string, channel_id: number): Promise<number> {
    return this.emitAsync('addKick', nickname, channel_id)
  }

}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public startConnection (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already connected in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public disconnect (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }

  async loadChannels(): Promise<Channel[]> {
    const response = await api.get<Channel[]>('/channels');
    return response.data;

  }

  async loadInvitations(): Promise<Invitation[]> {
    const response = await api.get<Invitation[]>('/invitations');
    return response.data;
  }

}

export default new ChannelService()
