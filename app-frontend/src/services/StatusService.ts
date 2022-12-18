import { authManager } from '.'
import { SocketManager } from './SocketManager'
import { Status } from '../contracts'
import { useChannelStore } from 'src/stores/channelstore'

class StatusSocketManager extends SocketManager {
  public subscribe (): void {
    const channelstore = useChannelStore()

    this.socket.on('statusChange', (userId: number, status: Status ) => {
      console.log('User changed status', userId,status)

      if(channelstore.channels.length !== 0) {
        channelstore.channels.forEach((channel) => {
          const mindex = channel.members.findIndex((member) => member.id === userId)
          if(mindex !== -1) {
            channel.members[mindex].status = status
          }
        })
      }
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()

      }
    })
  }

  public changeStatus (status: Status): Promise<Status> {
    return this.emitAsync('changeStatus', status)
  }
}

export default new StatusSocketManager('/')
