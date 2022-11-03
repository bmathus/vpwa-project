
import { BaseModel, column,hasMany,HasMany,manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import Channel from './Channel'
import Invite from './Invite'


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

  @hasMany(() => Message, {
    foreignKey: 'user_id',
  })
  public messages: HasMany<typeof Message>;

  @hasMany(() => Invite, {
    foreignKey: 'user_id',
  })
  public invites: HasMany<typeof Invite>;

  @manyToMany(() => Channel, { 
    pivotTable: 'members',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'channel_id',
    pivotColumns: ['admin'],
  })
  public channels: ManyToMany<typeof Channel>

}
