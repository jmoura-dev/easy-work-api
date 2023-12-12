import { Entity } from '@/core/entities/entity'

export interface UserProps {
  name: string
  email: string
  password: string
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
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
}
