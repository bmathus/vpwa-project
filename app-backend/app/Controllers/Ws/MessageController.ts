import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
// @ts-ignore
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import { inject } from '@adonisjs/core/build/standalone'

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/MessageRepository'])
export default class MessageController {
  constructor (private messageRepository: MessageRepositoryContract) {}

  public async loadMessages({}: WsContextContract,channelId: number,page: number,fromMessageDateTime: string) {
    return this.messageRepository.getAll(channelId, page,fromMessageDateTime)
  }

  public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const message = await this.messageRepository.create(params.name, auth.user!.id, content)
    // broadcast message to other users in channel

    socket.broadcast.emit('message', message)
    // return message to sender
    return message
  }

  public async addLiveMessage({ auth,socket }: WsContextContract, message: string) {
    socket.broadcast.emit('liveMessage', auth.user?.nickname,message)
  }
}
