// @ts-ignore
import { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'
import Kick from 'App/Models/Kick'


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
    console.log(channels)
    return channels
  }

  public async create(user: User, channel_name:string, type: 'public'|'private' ): Promise<Channel | string> {

    try {
      const channel = await user.related('channels').create({
        name:channel_name,
        type:type
      },{
        admin:true
      })

      const serializedChannel = channel.serialize()

      serializedChannel.members = [
        {
          id:user.id,
          nickname: user.nickname,
          avatar_color: user.avatarColor,
          status: user.status
        }
      ]
      serializedChannel.admin = true;

      return serializedChannel as Channel

    } catch (error) {
      return 'Error when creating channel'
    }
  }

  public async join(user: User, channelToJoin: Channel): Promise<Channel|string> {
    try {
      await channelToJoin.load('users',(userQuery) => {
        userQuery.select('id','nickname','avatar_color','status')
      })

      if(channelToJoin.users.find(member => member.id === user.id) !== undefined) {
        return 'You are already a member of this channel'
      }

      const channelAdmin = channelToJoin.users.find(member => member.$extras.pivot_admin == true)

      let mykicks = await Kick.query().where('channel_id',channelToJoin.id,).andWhere('kicked_user',user.id)

      for(const kick of mykicks) {
        if(kick.kicked_by === channelAdmin?.id) return `You are kicked from ${channelToJoin.name} by his admin.`
      }
      mykicks = mykicks.filter(kick => kick.kicked_by !== channelAdmin?.id)

      if(mykicks.length >= 3) return `You are kicked from ${channelToJoin.name} by users.`

      channelToJoin.related('users').attach([user.id])

      const serializedChannel = channelToJoin.serialize()
      delete serializedChannel.deleted_at
      serializedChannel.admin = false
      serializedChannel.members = serializedChannel.users
      delete serializedChannel.users


      return serializedChannel as Channel

    } catch(error) {
      return 'Error when joining channel'
    }

  }


  public async kick(KickedBy: number, kickedNickname: string, channelId: number): Promise<string | Kick> {

    const channel = await Channel.findBy('id', channelId)
    if(channel == null) return 'Channel doesnt exists.'
    if(channel.type == 'private') return 'You cannot kick users in private channel.'
    if(channel.name == 'general') return 'You cannot kick users from general.'

    const channelMembers = await channel.related('users').query().select('*')

    const me = channelMembers.find(member=> member.id ==KickedBy)
    if(me == undefined) return 'You are not member of this channel.'

    const kickedUser = channelMembers.find(member=> member.nickname == kickedNickname)
    if(kickedUser == undefined) return 'User to kick is not member of this channel.'

    if(kickedUser.$extras.pivot_admin) return `You cannot kick admin from ${channel.name}`


    const kicks = await Kick.query().where('channel_id',channelId,).andWhere('kicked_user',kickedUser.id)

    const duplicatekick = kicks.find(kick => kick.kicked_by ==KickedBy)
    if(duplicatekick !== undefined) return `You already kicked ${kickedNickname} from ${channel.name}`


    const newkick = await Kick.create({
      kicked_by:me.id,
      kicked_user:kickedUser.id,
      channel_id: channel.id
    })


    if(me.$extras.pivot_admin) {//ak som admin
      return newkick

    } else {//ak niesom admin
      const newkicks = await Kick.query().where('channel_id',channelId,).andWhere('kicked_user',kickedUser.id)
      if(newkicks.length >= 3){
        return newkick
      }
    }

    return 'Kick added succesully'

  }


}
