import { RawMessage, SerializedMessage, Channel,ErrorMessage, User, Status } from 'src/contracts'
import { SocketManager } from './SocketManager'
import {useChannelStore} from '../stores/channelstore'
import { api } from 'src/boot/axios';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe (): void {
    const channel = this.namespace.split('/').pop() as string
    const channelstore = useChannelStore()

    this.socket.on('message', (message: SerializedMessage) => {
      console.log(message)
      channelstore.NewMessage({channel,message})
    })

    this.socket.on('addMember', (user: User) => {
      channelstore.active_channel?.members.push({id: user.id, nickname: user.nickname, avatar_color: user.avatar_color, status: Status.online})
      console.log(user)
     
    })

    this.socket.on('deleteMember', (user: User) => {
      
      if(channelstore.active_channel != null)
      {
        channelstore.active_channel.members = channelstore.active_channel?.members.filter(
          (member) => member.id !== user.id
        );
        console.log(user)
      }
     
    })


  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (channelId: number,page: number): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages', channelId,page)
  }

  public createChannel (channelName: string, type:'public'|'private'): Promise<Channel|ErrorMessage> {
    return this.emitAsync('createChannel',channelName,type)
  }

  public leaveChannel (channel_id: number): Promise<boolean|ErrorMessage> {
    return this.emitAsync('leaveChannel',channel_id)
  }

  public updateMembers (user_id: number|undefined, action: string) {
    console.log('service: starting to add user')
    this.emitAsync('updateChannelMembers',user_id, action)
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




}

export default new ChannelService()
