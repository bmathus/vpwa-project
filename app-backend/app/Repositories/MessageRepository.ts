// @ts-ignore
import type { MessageRepositoryContract, SerializedMessage } from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelId: number, page: number): Promise<SerializedMessage[]> {

    // const channel = await Channel.query()
    //   .where('name', channelName)
    //   .preload('messages', (messagesQuery) => {
    //     messagesQuery.preload('user',(userQuery) => {
    //       userQuery.select('id','nickname','avatar_color')
    //     })
    //     .orderBy('send_at','desc')
    //     .paginate(page,8)
    //   })

    const messages = await Message
      .query()
      .where('channel_id',channelId)
      .orderBy('send_at','asc')
      .preload('user',(userQuery) => {
        userQuery.select('id','nickname','avatar_color')
      })
      .paginate(page,8)

    return messages.all().reverse().map((message) => message.serialize() as SerializedMessage)
  }

  public async create(channelName: string, userId: number, content: string): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = await channel.related('messages').create({ user_id: userId, message:content })
    await message.load('user',(userQuery) => {
      userQuery.select('id','nickname','avatar_color')
    })

    return message.serialize() as SerializedMessage

  }
}
