import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  password: string
  about: string | null
  avatarId: UniqueEntityID | null
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get about() {
    return this.props.about
  }

  set about(about: string | null) {
    this.props.about = about
  }

  get avatarId() {
    return this.props.avatarId
  }

  set avatarId(avatarId: UniqueEntityID | null) {
    this.props.avatarId = avatarId
  }

  static create(
    props: Optional<UserProps, 'about' | 'avatarId'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        avatarId: props.avatarId ?? null,
        about: props.about ?? null,
      },
      id,
    )

    return user
  }
}
