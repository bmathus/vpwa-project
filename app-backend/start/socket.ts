/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected('StatusWsController.onConnected')
  .disconnected('StatusWsController.onDisconnected')

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
// .middleware('channel') // check if user can join given channel
.on('loadMessages', 'MessageController.loadMessages')
.on('addMessage', 'MessageController.addMessage')
.on('createChannel','ChannelWsController.createChannel')
.on('joinChannel','ChannelWsController.joinChannel')
.on('leaveChannel','ChannelWsController.leaveChannel')
.on('inviteUser','ChannelWsController.inviteUser')
.on('deleteInvitation','ChannelWsController.deleteInvitation')
