// @ts-ignore
import type { ChannelRepositoryContract,Error } from '@ioc:Repositories/ChannelRepository'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'


export default class MessageRepository implements ChannelRepositoryContract {
  public async getAll(user: User): Promise<Channel[]> {
    await user.load('channels')

    return user.channels.map((ch)=>{
      const channel = ch.serialize()
      delete channel.deleted_at
      channel.admin = ch.$extras.pivot_admin
      channel.members = []
      return channel
    }) as Channel[];
  }


  public async create(user: User, channel_name:string, type: 'public'|'private' ): Promise<Channel|Error> {

    try {
      const channel = await user?.related('channels').create({
        name:channel_name,
        type:type
      },{
        admin:true
      })
      return channel?.serialize() as Channel

    } catch (error) {
      console.log(error)
      if(error.constraint === 'channels_name_unique') {
        return {
          message:'Channel already exists'
        } as Error
      }

    }
  }

  public async leave(user: User, channel_id: number): Promise<Boolean|Error> {
    try {
     

      const channel = await Channel.findBy('id', channel_id)
      const members = await channel?.related('users').query().select('*')
      if(members != null)
      {
        let adm = members.find(i => i.$extras.pivot_admin === true);
        

        if(user.id == adm?.id)
        {
          console.log('Cau admin')
          await channel?.related('messages').query().delete()
          await channel?.related('users').query().delete()
          
          await channel?.delete()
          return true
        }
        else{
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


}
