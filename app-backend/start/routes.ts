/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'hello'
})

//vrati všetky channels daneho usera
Route.get('channels', 'ChannelsController.index')

//join teda vytvorenie kanala alebo joinutie
Route.post('channels', 'ChannelsController.join')

//vratenie všetkych messages daneho kanala
Route.get('channels/:id/messages','ChannelsController.index_messages')

//ulozenie noveho message daneho kanala
Route.post('channels/:id/messages','ChannelsController.store_messages')
