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

      if(error.constraint === 'channels_name_unique') {
        return 'Channel already exists.'
      }
      return 'Error when creating channel'

    }
  }

  public async join(user: User, channel_name:string, inviter: number | null): Promise<Channel|string> {

    const channel = await Channel.findBy('name', channel_name)
    let members = await channel?.related('users').query().select('id')
    let is_admin: boolean = false

    if(members != null && inviter != null){
      for(let i = 0; i < members.length;){
        if(members[i].$extras.pivot_admin == true && members[i].$extras.pivot_user_id == inviter) {
          is_admin = true
          break
        }
      }
    }


    if (channel == null) {
      return 'This channel doesnt exist'

    }
    else if (channel?.type == 'private' && is_admin == false) {
      return 'Cannot join private channels'

    }
    else if ( members != undefined && members.find(i => i.id == user.id) != undefined) {
      return 'You are already a member of this channel'

    }
    else {
      await channel.related('users').attach([user.id])
      return channel

    }
  }

  public async invite(user_id: number, channel_id: number, target_name: string): Promise<Channel|Error> {

    const user = await User.findBy('nickname', target_name)
    if(user != null){

      //const invite = await Invite.create({ channel_id:  channel_id, sender_id: user_id, user_id: user.id})
    }
  }

  public async kick(user_id: number, nickname: string, channel_id: number): Promise<number> {

    const channel = await Channel.findBy('id', channel_id)
    const members = await channel?.related('users').query().select('nickname')

    console.log(members)

    if( members != null)
    {
      const user = members.find((obj) => {
        return obj.nickname == nickname;
      });

      if(user == undefined) return 3

      await channel?.related('kicks').attach([user.id, user_id, channel_id])
      const chkicks = await channel?.related('kicks').query().select('*')
      console.log('->',chkicks)

    }
    return 1

  }


  public async revokekick(user_id: number, nickname: string, channel_id: number): Promise<number> {
    return 1
  }





}
