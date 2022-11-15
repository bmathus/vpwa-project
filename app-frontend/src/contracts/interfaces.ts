///other
export interface Channel {
  id: number;
  name: string;
  members: Member[];
  is_public: boolean; // prerobiť na type teda enum public private
  admin: boolean;
}

export interface Kicks {
  id: number;
  channel_id: number;
  user_id: number;
  sender_id: number;
}

export interface Message {
  id: number;
  message: string;
  user_id: number;
  sender_nickname: string;
  send_at: string;
}

export interface Member {
  id: number; //sem posielam id usera nie id z member tabulky
  nickname: string;
  avatar_color: string;
  status: Status;
  live_text: string;
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

export enum Status {
  online = 'online',
  DND = 'DND',
  offline = 'offline',
}

