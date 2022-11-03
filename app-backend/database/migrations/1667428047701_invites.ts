import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'invites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE') 

      table
      .integer('sender_id')
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE') 

      table
      .integer('channel_id')
      .unsigned()
      .references('channels.id')
      .onDelete('CASCADE') 


      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
