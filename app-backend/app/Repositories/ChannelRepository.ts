// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository'
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


  public async create(user: User, channel_name:string, type: 'public'|'private' ): Promise<Channel|Error> {

    try {
      const channel = await user?.related('channels').create({
        name:channel_name,
        type:type
      },{
        admin:true
      })
      return channel?.serialize() as Channel

    } catch (error) {
      console.log(error)
      if(error.constraint === 'channels_name_unique') {
        return {
          message:'Channel already exists'
        } as Error
      }

    }
  }


}
