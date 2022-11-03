import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name',20).notNullable()  
      table.string('surname',20).notNullable()
      table.string('nickname',20).notNullable().unique()
      table.string('password',64).notNullable()
      table.enu('status',['online','offline','DND'],{
        useNative: true,
        enumName: 'status',
        existingType: false
      })
      table.string('avatar_color',10).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
