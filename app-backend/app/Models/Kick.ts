
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Channel from './Channel';


export default class Kick extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public kicked_by: number;

  @column()
  public kicked_user: number;

  @column()
  public channel_id: number;


  @belongsTo(() => Channel, {
    foreignKey: 'channel_id',
  })
  public channel: BelongsTo<typeof Channel>;


}
