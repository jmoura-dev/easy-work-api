import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

export interface DeveloperProps {
  userId: UniqueEntityID
  price_per_hour: number | null
  occupation_area: string
  available_for_contract: boolean
}

export class Developer extends Entity<DeveloperProps> {
  get userId() {
    return this.props.userId
  }

  get price_per_hour() {
    return this.props.price_per_hour
  }

  set price_per_hour(price_per_hour: number | null) {
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

  set available_for_contract(available_for_contract: boolean) {
    this.props.available_for_contract = available_for_contract
  }

  static create(
    props: Optional<
      DeveloperProps,
      'price_per_hour' | 'available_for_contract'
    >,
    id?: UniqueEntityID,
  ) {
    const developer = new Developer(
      {
        ...props,
        price_per_hour: props.price_per_hour ?? null,
        available_for_contract: props.available_for_contract ?? false,
      },
      id,
    )

    return developer
  }
}
