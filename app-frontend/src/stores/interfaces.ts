export interface Channel {
  id: number;
  name: string;
  members: [];
  is_public: boolean;
}

export interface Message {
  id: number;
  message: string;
  send_at: string;
  sender_name: string;
}
export interface Member {
  id: number;
}

export interface Invitation {
  id: number;
  channel_id: number;
  channel_name: string;
  is_public: boolean;
}

export interface ChannelsMessages {
  [channel: string]: {
    messages: Message[];
  };
}

export interface User {
  id: number;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  password: string;
}

export enum Status {
  online = 'online',
  DND = 'DND',
  offline = 'offline',
}
