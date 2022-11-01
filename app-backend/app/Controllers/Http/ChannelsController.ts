import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Channel from "App/Models/Channel"
import Channel from "App/Models/Channel";
import User from "App/Models/User"
//import Channel from "App/Models/Channel"
export default class ChannelsController {
  public async index() {
    const user = await User.query().preload('channels').first();    
    let channels = [] as Channel[];

    user?.channels.forEach((x)=>{
      const channel = x.serialize()
      channel.members = []
      channels.push(channel as Channel)
    });

    console.log(channels)

    return channels
  }

  public async store({request}: HttpContextContract) {
    const user = await User.first();
    const channel_request = request.body()

    const channel = await user?.related('channels').create({
      name:channel_request.name,
      type:channel_request.type
    })

    return channel?.serialize()
  }
}
