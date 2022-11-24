import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Channel from "App/Models/Channel";
import { inject } from '@adonisjs/core/build/standalone';

// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';


export default class ChannelControllerWs{

  public async createChannel({ auth, socket }: WsContextContract, channelname: string, is_public  :boolean, username: string, command :boolean) {
    console.log(channelname)

    

    auth
    return Channel

    }

}