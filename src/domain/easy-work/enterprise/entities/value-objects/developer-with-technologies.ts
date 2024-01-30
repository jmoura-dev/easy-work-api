import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export interface DeveloperWithTechnologiesProps {
  developerId: UniqueEntityID
  occupation_area: string
  price_per_hour: number | null
  available_for_contract: boolean
  about: string | null
  userName: string
  techs: Technology[]
}

export class DeveloperWithTechnologies extends ValueObject<DeveloperWithTechnologiesProps> {
  get developerId() {
    return this.props.developerId
  }

  get occupation_area() {
    return this.props.occupation_area
  }

  get price_per_hour() {
    return this.props.price_per_hour
  }

  get available_for_contract() {
    return this.props.available_for_contract
  }

  get about() {
    return this.props.about
  }

  get userName() {
    return this.props.userName
  }

  get techs() {
    return this.props.techs
  }

  static create(props: DeveloperWithTechnologiesProps) {
    return new DeveloperWithTechnologies(props)
  }
}
