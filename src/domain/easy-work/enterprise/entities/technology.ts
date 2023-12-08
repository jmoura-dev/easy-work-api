import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TechnologyProps {
  name: string
}

export class Technology extends Entity<TechnologyProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  static create(props: TechnologyProps, id?: UniqueEntityID) {
    const technology = new Technology(props, id)

    return technology
  }
}
