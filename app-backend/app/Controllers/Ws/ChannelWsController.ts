import { inject } from '@adonisjs/core/build/standalone';
// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository';

import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';


@inject(['Repositories/ChannelRepository'])
export default class ChannelControllerWs{
  constructor(private chRepository: ChannelRepositoryContract) {}

  public async createChannel ({auth}: WsContextContract, channel_name: string, type:'public'|'private') {
    const channel = await this.chRepository.create(auth.user,channel_name,type);
    return channel

  }

  public async leaveChannel ({auth}: WsContextContract, channel_id: number) {
    const result = await this.chRepository.leave(auth.user, channel_id);
    return result

  }

  public async updateMembers ({socket}: WsContextContract, user_id: number, action: string) {
    console.log('from server:', action)
    if (action == 'add'){
      const user = await this.chRepository.addMembers(user_id)
      socket.broadcast.emit('addMember', user)
    }
    else{
      console.log('performing:', action)
      const user = await this.chRepository.addMembers(user_id)
      socket.broadcast.emit('deleteMember', user)
    }
  }

}
