import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

import Invite from 'App/Models/Invite';

export default class UsersController {
  public async register({ request }: HttpContextContract) {
    // if invalid, exception
    console.log(request.body())
    const data = await request.validate(RegisterUserValidator)

    const user = await User.create(data)
    // join user to general channel
    const general = await Channel.findByOrFail('name', 'general')
    await user.related('channels').attach([general.id])

    return user
  }

  public async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password)
  }

  public async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels')
    return auth.user
  }

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
