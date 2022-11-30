import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository';
import Channel from 'App/Models/Channel';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from 'App/Models/User';
import Invite from 'App/Models/Invite';


export interface Member {
  id: number; //sem posielam id usera nie id z member tabulky
  nickname: string;
  avatar_color: string;
  status: 'string'| null;
}


@inject(['Repositories/ChannelRepository'])
export default class ChannelControllerWs{
  constructor(private chRepository: ChannelRepositoryContract) {}

  public async createChannel ({auth}: WsContextContract, channel_name: string, type:'public'|'private') {
    const channel = await this.chRepository.create(auth.user,channel_name,type);
    return channel

  }

  public async joinChannel ({auth}: WsContextContract, channel_name: string) {
    const channel = await this.chRepository.join(auth.user,channel_name);
    return channel

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
      console.log('chyba')
      return {

        message:'Channel already exists'
      } as Error
    }

  }

  public async updateMembers ({socket,auth}: WsContextContract, action: string,members: Member[],channelId: number) {

    if (action == 'addMember'){
      socket.broadcast.emit('addMember', members,channelId)
    }

  }

  public async inviteUser ({socket,auth}: WsContextContract,targetUserNickname: string,channelId: number,channelName: string) {


    const targetUser = await User.query().where('nickname',targetUserNickname).first()
    await targetUser?.load('channels',(query)=> {
      query.where('channels.id',channelId)
    })

    if(targetUser?.channels.length === 0) {

      await targetUser?.load('invites',(query) => {
        query.where('channel_id',channelId)
      })

      if(targetUser?.invites.length === 0) {

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

        return `Invite send.`


      } else {
        return 'User is already invited to this channel.'
      }


    } else {
      return 'User is already member of this channel.'
    }

    // const userInChannel = await User.query().whereHas('channels',(channelQuery) => {
    //   channelQuery.where('name',channelName)
    // }).where('nickname',targetUserNickname)



    //check ci targer user uz nieje v kanaly already
    //check ci target user uz nema nahodou invite do tohto kanala aby nebol spamovany rovnakymi


    //console.log(channelName + ' ' + targetUserNickname)
    //console.log(channelId + ' ' + targetUserNickname)
    //const invitation = await this.chRepository.invite(user_id, channel_id, targetuser)

  }

}
