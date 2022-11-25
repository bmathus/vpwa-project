
export type RawMessage = string

export interface Sender {
  id: number,
  nickname: string,
  avatar_color: string
}

export interface ChannelsMessages {
  [channel: string]: {
    messages: SerializedMessage[],
    page: number
  }
}

export interface SerializedMessage {
  id: number,
  message: string,
  channel_id: number
  send_at: string,
  user: Sender
}
