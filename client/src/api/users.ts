import { User, CreateUserInput } from '../types/user.types'
import caller from './caller'

export const getUsers = async (): Promise<User[]> => {
  return caller('/users')
}

export const createUser = async (user: CreateUserInput): Promise<User> => {
  return caller('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}
