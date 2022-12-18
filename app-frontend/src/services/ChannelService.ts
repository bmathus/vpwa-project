import { RawMessage, SerializedMessage, Channel,ErrorMessage,Member, Invitation,Status } from 'src/contracts'
import { SocketManager } from './SocketManager'
import {useChannelStore} from '../stores/channelstore'
import { api } from 'src/boot/axios';
import { useQuasar,AppVisibility } from 'quasar';
import { useUserStore } from 'src/stores/userstore';


// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {

  public subscribeMessages(): void {
    const channel = this.namespace.split('/').pop() as string
    const channelstore = useChannelStore()
    const userstore = useUserStore()

    this.socket.on('message', (message: SerializedMessage) => {
      if(channelstore.channels_messages[channel].firstReceivedDateTime === 'now') {
        channelstore.channels_messages[channel].firstReceivedDateTime = message.send_at;
      }
      channelstore.NewMessage({channel,message})

      if(!AppVisibility.appVisible && userstore.getStatus !== Status.DND) {
        this.showNotification(message,channel,userstore.getUserNickname,userstore.notifyOnlyForMe)
      }

    })

  }

  public unsubscribeMessages(): void {
    this.socket.off('message')
  }

  public subscribe (): void {
    const channel = this.namespace.split('/').pop() as string
    const channelstore = useChannelStore()
    const userstore = useUserStore()
    this.subscribeMessages()


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
      if(channelstore.getActiveChannel?.name == channelName) {
        channelstore.disconnectFrom(channelName,true)
      } else {
        channelstore.disconnectFrom(channelName,false)
      }

    })

    this.socket.on('invite',(newInvite: Invitation) => {
      if(newInvite.user_id === userstore.getUserId) {
        userstore.addReceivedInvitation(newInvite)
      }
    })

    this.socket.on('liveMessage',(senderNickname: string, message: string) => {
      channelstore.NewLiveMessage(channel,senderNickname,message)
    })

  }


  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (channelId: number,page: number,firstReceivedDateTime: string): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages', channelId,page,firstReceivedDateTime)
  }

  public joinChannel (channelName: string, type: 'public'| 'private', creating: boolean): Promise<Channel|string> {
    return this.emitAsync('joinChannel',channelName, type, creating)
  }

  public leaveChannel (channel_id: number): Promise<boolean|ErrorMessage> {
    return this.emitAsync('leaveChannel',channel_id)
  }

  public inviteUser (targetUserNickname: string,channelId: number, channelName: string): Promise<string> {
    return this.emitAsync('inviteUser', targetUserNickname,channelId,channelName)
  }
  public resolveInvitation(invitationId: number,channelId: number, action: 'accept'|'decline'): Promise<Channel|string> {
    return this.emitAsync('resolveInvitation', invitationId,channelId,action)
  }

  public addKick (nickname: string, channel_id: number): Promise<number> {
    return this.emitAsync('addKick', nickname, channel_id)
  }

  public addLiveMessage(message: string): Promise<string> {
    return this.emitAsync('addLiveMessage',message)
  }

  private showNotification(message: SerializedMessage, channelName: string, myUserName: string,notifyOnlyForMe: boolean ) {

    let notificationText = message.message.trim()
    const imAdresor = (notificationText.startsWith(`@${myUserName}`) ||
                      notificationText.includes(` @${myUserName}`)) ? true : false

    if(notifyOnlyForMe && !imAdresor) return

    notificationText = `Channel: ${channelName}\n${message.user.nickname}: ${notificationText.length > 25 ? notificationText.slice(0,25) + '...': notificationText}`

    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
    } else if(Notification.permission === 'granted') {
      new Notification('Slack App',{
        body: notificationText
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          new Notification('Slack app', {
            body: notificationText
          });
        }
      });
    }

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
