# Real-time Chat PWA

[![Node Version](https://img.shields.io/badge/Node_Version->=_14.19-brightgreen?logo=node.js&logoColor=brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-4.6-blue?logo=typescript&logoColor=blue)]()
[![AdonisJS](https://img.shields.io/badge/AdonisJS-5.8-blue?logo=adonisjs&logoColor=blue)]()
[![Vue.js](https://img.shields.io/badge/Vue.js-3.0-brightgreen?logo=vue.js&logoColor=brightgreen)]()
[![Quasar](https://img.shields.io/badge/Quasar-2.6-blue?logo=quasar&logoColor=blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?logo=postgresql&logoColor=blue)]()
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.5-black?logo=socket.io&logoColor=black)]()
[![Package Manager](https://img.shields.io/badge/Package_Manager-NPM-red?logo=npm&logoColor=red)]()

A real-time chat application PWA built with AdonisJS (backend) and Quasar Framework (frontend), featuring WebSocket communication for instant messaging.

Project was part of VPWA 2022/23 course at FIIT STU.

![Logo](docs-images/ui.jpg)

## Features

### Authentication

- User has `name`, `surname`, `nickName`, `email`, `password`
- User **registration**, **login** and **logout** with JWT tokens

### Channel System

Through UI or chat commands user can in general **create**, **join** or **leave** channel. For simplicity all members are part of generall channel. In left bar user can see channels that is part of or channels that he is invited in.

**Channel Roles:** Creator of the channel automatically becoms its **admin**. All other members are regular **users**.

App supports 2 possible types of channels: **private** or **public**.

**Public Channels** - are accesible to all users.

- Created through "Create channel" button or by chat command `/join channelName`
- Any user can join if channel exist with command `/join channelName`
- Any member can invite others using command `/invite nickName`

**Private Channels** - Invitation-only access

- Created through "Create channel" button or using `/join channelName private`
- Admin-controlled member management
  - Membership requires invitation from admin - `/invite nickName`
  - Admin can remove user from channel - `/revoke nickname`

<table>
  <tr>
    <td align="center" width="33%">
      <img src="docs-images/create-channel.png" width="300"/>
      <br>
      <em>Creating a new channel with public/private option</em>
    </td>
    <td align="center" width="33%">
      <img src="docs-images/invite.png" width="300"/>
      <br>
      <em>Inviting new members using command interface</em>
    </td>
    <td align="center" width="33%">
      <img src="docs-images/members.png" width="300"/>
      <br>
      <em>Channel members list with status indicators</em>
    </td>
  </tr>
</table>

**Channel leaving / removal**: Channel admin has right to **delete** channel with command `/quit`. User can leave channel with command `/cancel` (if admin does so its has the same effect as `/quit`).

<div style="text-align: left; margin: 40px 0;">
  <img src="docs-images/quit.png" width="300" style="margin-bottom: 10px;"/>
  <p><em>Your caption here - describing what's shown in the image</em></p>
</div>
