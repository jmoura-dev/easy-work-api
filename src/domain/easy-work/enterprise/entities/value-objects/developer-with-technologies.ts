import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export interface DeveloperWithTechnologiesProps {
  developerId: UniqueEntityID
  avatarUrl: string | null
  occupation_area: string
  price_per_hour: number | null
  available_for_contract: boolean
  about: string | null
  userName: string
  linkedin: string | null
  github: string | null
  portfolio: string | null
  techs: Technology[]
}

export class DeveloperWithTechnologies extends ValueObject<DeveloperWithTechnologiesProps> {
  get developerId() {
    return this.props.developerId
  }

  get avatarUrl() {
    return this.props.avatarUrl
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

  get linkedin() {
    return this.props.linkedin
  }

  get github() {
    return this.props.github
  }

  get portfolio() {
    return this.props.portfolio
  }

  get techs() {
    return this.props.techs
  }

  static create(props: DeveloperWithTechnologiesProps) {
    return new DeveloperWithTechnologies(props)
  }
}
