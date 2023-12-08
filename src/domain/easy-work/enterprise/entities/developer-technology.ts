import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeveloperTechnologyProps {
  developerId: UniqueEntityID
  technologyId: UniqueEntityID
}

export class DeveloperTechnology extends Entity<DeveloperTechnologyProps> {
  get developerId() {
    return this.props.developerId
  }

  get technologyId() {
    return this.props.technologyId
  }

  static create(props: DeveloperTechnologyProps, id?: UniqueEntityID) {
    const developerTechnology = new DeveloperTechnology(props, id)

    return developerTechnology
  }
}
