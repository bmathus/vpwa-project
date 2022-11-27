// @ts-ignore
import { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

export default class MessageRepository implements ChannelRepositoryContract {
  public async getAll(user: User): Promise<Channel[]> {
    await user.load('channels',(query) => {

      query.preload('users',(userQuery) => {
        userQuery.select('id','nickname','avatar_color','status')
      })
    })

    const channels = user.channels.map((ch)=>{
      const channel = ch.serialize()
      delete channel.deleted_at
      channel.admin = ch.$extras.pivot_admin
      channel.members = channel.users
      delete channel.users
      return channel
    }) as Channel[];
    return channels
  }


  public async create(user: User, channel_name:string, type: 'public'|'private' ): Promise<Channel | string> {

    try {
      const channel = await user?.related('channels').create({
        name:channel_name,
        type:type
      },{
        admin:true
      })
      return channel?.serialize() as Channel

    } catch (error) {

      if(error.constraint === 'channels_name_unique') {
        return 'Channel already exists.'
      }
      return 'Error when creating channel'

    }
  }

  public async join(user: User, channel_name:string): Promise<Channel|Error> {

    const channel = await Channel.findBy('name', channel_name)
    let members = await channel?.related('users').query().select('id')

    if (channel == null) {
      return {

        message:'This channel doesnt exist'
      } as Error
    }
    else if (channel?.type == 'private') {
      return {

        message:'Cannot join private channels'
      } as Error

    }
    else if ( members != undefined && members.find(i => i.id == user.id) != undefined) {
      return {

        message:'You are already a member of this channel'
      } as Error

    }
    else {

      //members = await channel.related('users').attach({user}) TODO

      return

    }
  }

}
