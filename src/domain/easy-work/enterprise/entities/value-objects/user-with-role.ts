import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface UserWithRoleProps {
  userId: UniqueEntityID
  name: string
  email: string
  password: string
  avatarId: UniqueEntityID | null
  about: string | null
  developerId: UniqueEntityID | null
  companyId: UniqueEntityID | null
}

export class UserWithRole extends ValueObject<UserWithRoleProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  get email() {
    return this.props.email
  }

  get avatarId() {
    return this.props.avatarId
  }

  get about() {
    return this.props.about
  }

  get developerId() {
    return this.props.developerId
  }

  get companyId() {
    return this.props.companyId
  }

  static create(props: UserWithRoleProps) {
    return new UserWithRole(props)
  }
}
