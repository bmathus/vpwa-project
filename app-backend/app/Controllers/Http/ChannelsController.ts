import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import { inject } from '@adonisjs/core/build/standalone';

// @ts-ignore
import type { ChannelRepositoryContract } from '@ioc:Repositories/ChannelRepositoryContract';

@inject(['Repositories/ChannelRepository'])
export default class ChannelsController {
  constructor(private chRepository: ChannelRepositoryContract) {}

  public async loadChannels({auth}: HttpContextContract) {
    return this.chRepository.getAll(auth.user)
  }

}
