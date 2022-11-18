import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column({serializeAs: null})
  public user_id: number;

  @column()
  public channel_id: number;

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Channel, {
    foreignKey: 'channel_id',
  })
  public channel: BelongsTo<typeof Channel>;

  @column.dateTime({ autoCreate: true })
  public send_at: DateTime
}
