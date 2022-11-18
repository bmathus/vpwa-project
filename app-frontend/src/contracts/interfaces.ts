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
  live_text: string;
}

export interface Invitation {
  id: number;
  channel_id: number;
  admin_id: number;
  channel_name: string;
  is_public: boolean;
}


export enum Status {
  online = 'online',
  DND = 'DND',
  offline = 'offline',
}

