import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, UserProps } from './user'

export interface DeveloperProps extends UserProps {
  avatar?: string | null
  price_per_hour?: string | null
  occupation_area: string
  available_for_contract?: boolean
}

export class Developer extends User<DeveloperProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get avatar() {
    return this.props.avatar
  }

  set avatar(avatar: string | null | undefined) {
    this.props.avatar = avatar
  }

  get price_per_hour() {
    return this.props.price_per_hour
  }

  set price_per_hour(price_per_hour: string | null | undefined) {
    this.props.price_per_hour = price_per_hour
  }

  get occupation_area() {
    return this.props.occupation_area
  }

  set occupation_area(occupation_area: string) {
    this.props.occupation_area = occupation_area
  }

  get available_for_contract() {
    return this.props.available_for_contract
  }

  set available_for_contract(available_for_contract: boolean | undefined) {
    this.props.available_for_contract = available_for_contract
  }

  static create(
    props: Optional<
      DeveloperProps,
      'avatar' | 'price_per_hour' | 'available_for_contract'
    >,
    id?: UniqueEntityID,
  ) {
    const developer = new Developer(
      {
        ...props,
        avatar: props.avatar ?? null,
        price_per_hour: props.price_per_hour ?? null,
        available_for_contract: props.available_for_contract ?? false,
      },
      id,
    )

    return developer
  }
}
