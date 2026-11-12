export interface User {
  id: string
  username: string
  role: 'ADMIN' | 'BASIC'
}

export interface CreateUserInput {
  username: string
  password: string
  role: 'ADMIN' | 'BASIC'
}
