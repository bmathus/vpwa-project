export interface Channel {
  id: number;
  name: string;
  members: Member[];
  is_public: boolean;
  admin_id: number;
}

export interface Message {
  id: number;
  message: string;
  send_at: string;
  user_id: number;
  sender_nickname: string;
}
export interface Member {
  id: number;
  nickname: string;
  avatar_color: string;
  status: Status;
}

export interface Invitation {
  id: number;
  channel_id: number;
  admin_id: number;
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
  avatar_color: string;
}

export enum Status {
  online = 'online',
  DND = 'DND',
  offline = 'offline',
}
