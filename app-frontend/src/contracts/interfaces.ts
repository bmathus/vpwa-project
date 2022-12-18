///other

export interface Channel {
  id: number;
  name: string;
  members: Member[];
  type: 'public' | 'private'
  admin: boolean;
}

export interface Kicks {
  id: number;
  channel_id: number;
  user_id: number;
  sender_id: number;
}

export interface Member {
  id: number; //sem posielam id usera nie id z member tabulky
  nickname: string;
  avatar_color: string;
  status: Status;
}

export interface Invitation {
  id: number;
  user_id: number,
  sender: {
    id: number,
    nickname: string
  }
  channel: {
    id: number
    name: string,
  }
}

export interface ErrorMessage {
  message:string
}


export enum Status {
  online = 'online',
  DND = 'DND',
  offline = 'offline',
}

