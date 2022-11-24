import { RawMessage, SerializedMessage, Channel,ErrorMessage } from 'src/contracts'
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
      channelstore.NewMessage({channel,message})
    })
  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages')
  }

  public createChannel (channel_name: string, type:'public'|'private'): Promise<Channel|ErrorMessage> {
    return this.emitAsync('createChannel',channel_name,type)
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
