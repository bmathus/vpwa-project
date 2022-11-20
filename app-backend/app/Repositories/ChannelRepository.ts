// @ts-ignore
import type { ChannelRepositoryContract} from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

export default class MessageRepository implements ChannelRepositoryContract {
  public async getAll(user: User): Promise<Channel[]> {
    await user.load('channels')

    return user.channels.map((ch)=>{
      const channel = ch.serialize()
      delete channel.deleted_at
      channel.admin = ch.$extras.pivot_admin
      channel.members = []
      return channel
    }) as Channel[];
  }

}
