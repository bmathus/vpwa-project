import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Channel)
  public channel: BelongsTo<typeof Channel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
