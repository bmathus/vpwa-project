import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Invite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column({serializeAs:null})
  public sender_id: number

  @column({serializeAs:null})
  public channel_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  public sender: BelongsTo<typeof User>;

  @belongsTo(() => Channel, {
    foreignKey: 'channel_id',
  })
  public channel: BelongsTo<typeof Channel>;

  @column.dateTime({ autoCreate: true,serializeAs:null })
  public createdAt: DateTime

}
