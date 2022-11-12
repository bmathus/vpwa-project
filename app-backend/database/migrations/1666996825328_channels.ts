import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name',20).notNullable().unique()
      table.enu('type',['public','private'],{
        useNative: true,
        enumName: 'type',
        existingType: false
      })

      table.timestamp('deleted_at', { useTz: true }).defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
