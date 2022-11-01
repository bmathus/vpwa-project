import { DateTime } from 'luxon'
import { BaseModel, column,hasMany,HasMany,manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import Channel from './Channel'


enum status {
  online = 'online',
  DND = 'DND',
  offline = 'offline'
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public surname: string

  @column()
  public nickname: string

  @column()
  public password: string

  @column()
  public status: status

  @column()
  public avatarColor: string

  @hasMany(() => Message)
  public profile: HasMany<typeof Message>

  @manyToMany(() => Channel, { 
    pivotTable: 'members',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'channel_id',
  })
  public channels: ManyToMany<typeof Channel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
