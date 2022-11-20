// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
import User from '../app/Models/User'
import Channel from '../app/Models/Channel'

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
    getAll(channelName: string): Promise<SerializedMessage[]>
    create(channelName: string, userId: number, content: string): Promise<SerializedMessage>
  }

  const MessageRepository: MessageRepositoryContract
  export default MessageRepository
}

// @ts-ignore
declare module '@ioc:Repositories/ChannelRepository' {
  export interface ChannelRepositoryContract {
    getAll(user: User): Promise<Channel[]>;
  }

  const ChannelRepository: ChannelRepositoryContract;
  export default ChannelRepository;
}
