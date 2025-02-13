import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository';
import Channel from 'App/Models/Channel';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from 'App/Models/User';
import Invite from 'App/Models/Invite';
import Kick from 'App/Models/Kick';


export interface Member {
  id: number; //sem posielam id usera nie id z member tabulky
  nickname: string;
  avatar_color: string;
  status: 'string'| null;
}


@inject(['Repositories/ChannelRepository'])
export default class ChannelControllerWs{
  constructor(private chRepository: ChannelRepositoryContract) {}

  public async joinChannel ({auth, socket}: WsContextContract, channelName: string, type: 'public'|'private', creating: boolean) {

    const foundchannel = await Channel.findBy('name',channelName)

    if(foundchannel !== null) { //kanal s daným meno existuje

      if(creating) { //info pre create channel dialog
        return 'Channel already exists.'
      }

      if(type === 'private' || foundchannel.type === 'private') { //nemožeme joinovať private kanal
        return 'You cannot join private channel. You need invitation that you need to accept.'
      }

      //ideme joinovať public kanal ktorý exituje
      const result  = await this.chRepository.join(auth.user,foundchannel)
      if (typeof result === 'string') return result

      const newMember = {
        id: auth.user?.id,
        nickname: auth.user?.nickname,
        avatar_color: auth.user?.avatarColor,
        status: auth.user?.status,
      }
      result.members.push(newMember)

      socket.broadcast.emit('addMember', newMember, result.id)

      return result


    } else { //kanal s daným menom neexistuje ide sa vytvarat kanal bud public alebo private
      const channel = await this.chRepository.create(auth.user,channelName,type);
      return channel
    }

  }

  public async leaveChannel ({auth,socket}: WsContextContract, channel_id: number) {
    const user = (auth.user as User)

    try {
      const channel = await Channel.findBy('id', channel_id)
      const members = await channel?.related('users').query().select('*')

      if(members !== undefined && channel !== null)
      {
        let adm = members.find(i => i.$extras.pivot_admin === true);


        if(user.id == adm?.id) //ak som admin
        {
          socket.broadcast.emit('channelCanceled', channel.name)

          await channel?.related('messages').query().delete()
          await channel?.related('users').query().delete()
          await channel?.related('invites').query().delete()
          await channel.related('kicks').query().delete()

          await channel?.delete()
          return true
        }
        else{ //ak som  user
          socket.broadcast.emit('deleteMember',user.id)

          await channel?.related('users').query().select('user_id').where('user_id', user.id).delete()
          return false
        }
      }

    }
    catch(error){
      return 'Error when leaving channel.'
    }

  }

  public async inviteUser ({socket,auth}: WsContextContract,targetUserNickname: string, channelId: number, channelName: string, imAdmin: boolean) {

    const targetUser = await User.query().where('nickname',targetUserNickname).first()

    if(targetUser == null) return `Such user doesnt exist.`

    await targetUser?.load('channels',(query)=> {
      query.where('channels.id',channelId)
    })

    if(targetUser?.channels.length !== 0) {
      return 'User is already member of this channel.'
    }

    if(imAdmin) {
      await Kick.query().where('channel_id',channelId,).andWhere('kicked_user',targetUser.id).delete()
    }

    await targetUser?.load('invites',(query) => {
      query.where('channel_id',channelId)
    })

    if(targetUser?.invites.length !== 0) {
      return 'User is already invited to this channel.'
    }

    try {
      const invite = await Invite.create({
        user_id:targetUser.id,
        sender_id:auth.user?.id,
        channel_id:channelId
      })
      const newInvite = {
        id: invite.id,
        user_id: targetUser.id,
        sender: {
          id: auth.user?.id,
          nickname: auth.user?.nickname
        },
        channel: {
          id:channelId,
          name: channelName
        }
      }
      socket.broadcast.emit('invite', newInvite)

    }catch(error) {
      return 'Error when inviting user.'
    }

    return `Invite send.`
  }

  public async resolveInvitation({socket,auth}: WsContextContract,invitationId: number, channelId: number, action: 'accept'|'decline') {
    if(action == 'accept') {
      //user is already member of channel
      //channel doesnt exist
      //ci niesom kicked

      const invite = await Invite.findBy('id', invitationId)
      await invite?.delete()

      const foundchannel = await Channel.findBy('id',channelId)

      if(foundchannel === null) return 'Channel no longer exist.'

      const joinresult  = await this.chRepository.join(auth.user,foundchannel)
      if (typeof joinresult === 'string') return joinresult

      const newMember = {
        id: auth.user?.id,
        nickname: auth.user?.nickname,
        avatar_color: auth.user?.avatarColor,
        status: auth.user?.status,
      }
      joinresult.members.push(newMember)

      socket.broadcast.emit('addMember', newMember, joinresult.id)

      return joinresult

    } else {
      const invite = await Invite.findBy('id', invitationId)
      await invite?.delete()

      return 'Invitation declined succesfully.'
    }

  }

  public async addKick ({socket,auth}: WsContextContract, nickname: string, channelId: number) {

    const result =  await this.chRepository.kick(auth.user?.id, nickname, channelId)
    if (typeof result  === 'string') return result

    const channel = await Channel.findBy('id',channelId)

    //odstranenie usera z kanala - kicks sa ponechali
    await channel?.related('users').query().select('user_id').where('user_id', (result as Kick).kicked_user).delete()

    socket.nsp.emit('kickOrRevoke',channel?.name,(result as Kick).kicked_user)

    return `User ${nickname} was succesfully kicked out of ${channel?.name}`

  }

  public async revokeUser({socket}: WsContextContract, nickname: string, channelId: number) {
    const channel = await Channel.findBy('id',channelId)
    if(channel == undefined) return 'Channel doesnt exits.'

    await channel?.load('users',(userQuery) => {
      userQuery.select('nickname').where('nickname',nickname)
    })
    if(channel.users.length == 0) return `User ${nickname} is not member of this channel.`

    await channel?.related('users').query().select('user_id').where('user_id',channel.users[0].id).delete()

    socket.nsp.emit('kickOrRevoke',channel?.name,channel.users[0].id)

    return `User ${nickname} revoked succesfully.`
  }


}
