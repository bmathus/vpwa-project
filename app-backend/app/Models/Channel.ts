import { DateTime } from 'luxon'
import { BaseModel, column,hasMany,HasMany,manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import User from './User'
import Invite from './Invite'


export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: 'public'|'private'

  @hasMany(() => Message, {
    foreignKey: 'channel_id',
  })
  public messages: HasMany<typeof Message>;

  @hasMany(() => Invite, {
    foreignKey: 'channel_id',
  })
  public invites: HasMany<typeof Invite>;

 
  @manyToMany(() => User, {
    pivotTable: 'members',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['admin'],
  })
  public users: ManyToMany<typeof User>;

  @column.dateTime()
  public deletedAt: DateTime

}
