import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository';
import Channel from 'App/Models/Channel';
import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from 'App/Models/User';


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
          console.log('Cau admin')
          await socket.broadcast.emit('channelCanceled', channel.name)

          await channel?.related('messages').query().delete()
          await channel?.related('users').query().delete()

          await channel?.delete()
          return true
        }
        else{ //ak som  user
          console.log('Cau user')
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
    else if(action == 'deleteMember'){
      const updatedMembers = members.filter((member)=> member.id !== auth.user?.id)
      socket.broadcast.emit('deleteMember', updatedMembers,channelId)
    }
  }

}
