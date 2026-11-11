import { User } from '../types/users'
import caller from './caller'

export const getUsers = async (): Promise<User[]> => {
  return caller('/users')
}
