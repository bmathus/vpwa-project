export interface Channel {
    id:number,
    name:string,
    members:[]
    is_public: boolean
}

export interface Message {
    id:number,
    body:string
}
export interface Member {
    id:number,
    
}

export interface ChannelsMessages {
    [channel:string]: {
      messages: Message[]
    }
  }
  