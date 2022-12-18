import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'kicks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
      .integer('kicked_user')
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE')

      table
      .integer('kicked_by')
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE')

      table
      .integer('channel_id')
      .unsigned()
      .references('channels.id')
      .onDelete('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
