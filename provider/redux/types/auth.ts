export type FormSignIn = {
  email: string,
  password: string
}

export type FormSignUp = {
  email: string,
  password: string
  first_name?: string
  last_name?: string
}

export interface UserInfo {
  "info": {
    "deleted_at": string | null,
    "email": string,
    "username": string,
    "password": string,
    "role": "USER",
    "block_to": string | null,
    "created_at": string,
    "updated_at": string,
    "current_refresh_token": string,
    "id": string
  }
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
}