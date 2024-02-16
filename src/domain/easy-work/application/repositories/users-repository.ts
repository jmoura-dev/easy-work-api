import { User } from '../../enterprise/entities/user'
import { UserWithRole } from '../../enterprise/entities/value-objects/user-with-role'

export abstract class UsersRepository {
  abstract create(user: User): Promise<User>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<UserWithRole | null>
  abstract save(user: User): Promise<void>
}
