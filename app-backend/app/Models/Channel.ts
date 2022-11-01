import { DateTime } from 'luxon'
import { BaseModel, column,hasMany,HasMany,manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import User from './User'

enum type {
  public = "public",
  private = "private"
}

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: type

  @hasMany(() => Message)
  public profile: HasMany<typeof Message>

  @manyToMany(() => User, {
    pivotTable: 'members',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
  })
  public owners: ManyToMany<typeof User>;



  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  //este deleted at ale ten neviem načo mame
}
