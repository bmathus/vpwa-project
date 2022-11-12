import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Channel from 'App/Models/Channel'

enum type {
  public = "public",
  private = "private"
}

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const uniqueKey = 'name'

    await Channel.updateOrCreateMany(uniqueKey, [
      {
        name: 'general',
        type: type.public
      },
    ])
  }
}
