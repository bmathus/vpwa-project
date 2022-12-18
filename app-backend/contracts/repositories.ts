// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
import User from '../app/Models/User'
import Channel from '../app/Models/Channel'
import Kick from 'App/Models/Kick'

// @ts-ignore
declare module '@ioc:Repositories/MessageRepository' {
  export interface SerializedMessage {
    id: number,
    message: string
    channel_id: number,
    send_at: string,
    user: {
      id: number,
      nickname: string,
      avatar_color: string
    }
  }

  export interface MessageRepositoryContract {
    getAll(channelId: number, page: number,fromMessageDateTime: string): Promise<SerializedMessage[]>
    create(channelName: string, userId: number, content: string): Promise<SerializedMessage>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}

// @ts-ignore
declare module '@ioc:Repositories/ChannelRepository' {
  export interface Error {
    message: string
  }

  export interface ChannelRepositoryContract {
    getAll(user: User): Promise<Channel[]>;
    create(user: User,channel_name: string, type:'public'|'private' ): Promise<Channel|Error>;
    join(user: User, channelToJoin: Channel): Promise<Channel|string>;
    kick(KickedBy: number, kickedNickname: string, channelId: number): Promise<string | Kick>
  }

  const ChannelRepository: ChannelRepositoryContract;
  export default ChannelRepository;
}
