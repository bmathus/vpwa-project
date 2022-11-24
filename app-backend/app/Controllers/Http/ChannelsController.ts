import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from "App/Models/Channel";
import Message from 'App/Models/Message';
import User from "App/Models/User"
import { inject } from '@adonisjs/core/build/standalone';

// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';

@inject(['Repositories/ChannelRepository'])
export default class ChannelsController {
  constructor(private chRepository: ChannelRepositoryContract) {}

  public async loadChannels({auth}: HttpContextContract) {
    return this.chRepository.getAll(auth.user)
  }

  //prikaz /cancel a /quit pre spravcu
  public async leave({ request, response }:HttpContextContract) {
    const channel_id = request.param('id')
    const user = await User.find(1);
    const membership = await user?.related('channels').pivotQuery().where('channel_id',channel_id) as any[]


    if(membership?.length != 0 ) {//user je sucastou kanala

      if(membership[0].admin) {//ak je user admin tak delete channel

        await Channel.query().where('id',channel_id).delete()
        return {
          message:"You deleted channel: "+channel_id
        }

      } else { //user nieje admin -> opustenie kanala
        await user?.related('channels').detach([channel_id])

        return {
          message:"You left channel: "+channel_id
        }
      }
    } else {

      response.status(403)
      return {
        message:"You are not member of this channel."
      }
    }


  }

  public async index_messages({request}:HttpContextContract){
    const channel_id = request.param('id')

    const messages = await Message
      .query()
      .where('channel_id',channel_id)
      .preload('user')

    return messages.map((message) => message.serialize())
  }

  public async store_message({ request,response }:HttpContextContract) {
    const channel_id = request.param('id')
    const newMessage = request.body()

    const channel = await Channel.query().where('id',channel_id).preload('users',(query) => {
      query.where('user_id',newMessage.user_id)
    });

    if(channel.length != 0) {//kanal existuje

      if(channel[0].users.length != 0) {//user patri do kanala

        const message = await Message.create({
          user_id:newMessage.user_id,
          channel_id:channel_id,
          message:newMessage.message
        })

        await message.load('user',(query)=> {
          query.select('id','nickname','avatar_color')
        })

        return message

      } else {
        response.status(403)
        return {
          message: 'You are not member of this channel.'
        }
      }

    } else {
      response.status(404)
      return {
        message:`Channel ${channel_id} doesnt exist.`
      }
    }

  }

  //vrati members daneho kanala
  public async index_members({ request,response }:HttpContextContract) {
    const channel_id = request.param('id')
    const user_id = 1; //id usera ktory si pýta m
    const channel = await Channel.find(channel_id)

    if(!channel) {
      response.status(404)
      return {
        message: `Channel ${channel_id} doesnt exist.`
      }
    }

    console.log(channel)

    const members = await channel?.related('users')
      .query()
      .select('id','nickname','avatar_color','status');

    if(!members.find(member => member.id == user_id)) {
      response.status(403)
        return {
          message: 'You are not member of this channel.'
      }
    }

    return members

  }

}
