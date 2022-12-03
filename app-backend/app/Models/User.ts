import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel,hasMany,HasMany, manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import Channel from './Channel'
import Invite from './Invite'

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
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public status: 'online'|'offline'|'DND'

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

  @column.dateTime({ autoCreate: true,serializeAs:null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true,serializeAs: null })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
