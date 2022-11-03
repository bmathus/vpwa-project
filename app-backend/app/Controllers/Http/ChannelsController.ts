import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from "App/Models/Channel";
import Message from 'App/Models/Message';
import User from "App/Models/User"

export default class ChannelsController {
  public async index() {
    const user = await User.query().preload('channels').first();    
    let channels = [] as Channel[];

    user?.channels.forEach((ch)=>{
      const channel = ch.serialize()
      delete channel.deleted_at
      channel.admin = ch.$extras.pivot_admin
      channel.members = []
      channels.push(channel as Channel)
    });

    return channels
  }

  //treba dorobiť všetky edge cases
  public async join({request}: HttpContextContract) {
    const user = await User.first();
    const channel_request = request.body()

    const channel = await user?.related('channels').create({
      name:channel_request.name,
      type:channel_request.type
    },{
      admin:true
    })

    return channel?.serialize()
  }

  //prikaz /cancel a /quit pre spravcu
  public async leave({request}:HttpContextContract) {
    const channel_id = request.param('id')
    const user = await User.find(1);

    const membership = await user?.related('channels').pivotQuery().where('channel_id',channel_id) as any[]
    console.log(membership)

    if(membership?.length != 0 ) {//user je sucastou kanala

      if(membership[0].admin) {//ak je user admin tak delete channel

        await Channel.query().where('id',channel_id).delete()

      } else { //user nieje admin -> opustenie kanala
        user?.related('channels').detach([channel_id])
      }
    } else {
      console.log('User nieje clenom daneho kanala')
    }
   
  }

  public async index_messages({request}:HttpContextContract){
    const channel_id = request.param('id')
    
    //opravit
    const messages = await Message
      .query()
      .where('channel_id',channel_id)
      .preload('user')
      .paginate(3,2)

    return messages
  }
  
  public async store_message({request}:HttpContextContract) {
    const channel_id = request.param('id')
    const newMessage = request.body()

    const message = await Message.create({
      user_id:newMessage.user_id,
      channel_id:channel_id,
      message:newMessage.message
    })

    return message
  }

  //vrati members daneho kanala
  public async index_members({request}:HttpContextContract) {
    const channel_id = request.param('id')
    const channel = await Channel.find(channel_id)
    const members = await channel?.related('users').query()

    return members?.map((member) => {
      return member.serialize({
        fields:{
          pick:['id','nickname','avatar_color','status']
        }
      })
    })
  }

}
