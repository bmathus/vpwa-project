//auth
export interface ApiToken {
    type: 'bearer';
    token: string;
    expires_at?: string;
    expires_in?: number;
  }

  export interface RegisterData {
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    surname: string;
    nickname: string;
    avatar_color: string;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
    remember: boolean;
  }

  export interface User {
    id: number;
    email: string;
    name:string;
    surname:string,
    nickname:string,
    avatar_color:string
  }
