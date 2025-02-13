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

//všetky pozvanky ktore prisli použivatelovi na pridanie sa do kanalov
Route.get('invitations','UsersController.loadInvitations').middleware('auth')

Route.group(() => {
  Route.get('/', 'ChannelsController.loadChannels').middleware('auth'); //vrati všetky channels daneho usera
}).prefix('channels')

Route.group(() => {
  Route.post('register', 'UsersController.register')
  Route.post('login', 'UsersController.login')
  Route.post('logout', 'UsersController.logout').middleware('auth')
  Route.get('me', 'UsersController.me').middleware('auth')
}).prefix('auth')




