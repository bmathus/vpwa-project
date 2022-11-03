//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invite from 'App/Models/Invite';

export default class UsersController {
    public async index_invitations() {
        const user_id = 2 //id usera ktory bude prihlaseny

        const invites = await Invite.query().where('user_id',user_id)
        .preload('channel',(query)=>{
            query.select('id','name')
        }).preload('sender',(query)=>{
            query.select('id','nickname')
        })
        return invites
    }
}
