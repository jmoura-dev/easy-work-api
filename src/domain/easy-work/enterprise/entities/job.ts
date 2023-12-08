import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'

export interface JobProps {
  company_id: UniqueEntityID
  title: string
  description: string
  slug: Slug
  created_at: Date
}

export class Job extends Entity<JobProps> {
  get company_id() {
    return this.props.company_id
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
  }

  get slug() {
    return this.props.slug
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get created_at() {
    return this.props.created_at
  }

  static create(
    props: Optional<JobProps, 'slug' | 'created_at'>,
    id?: UniqueEntityID,
  ) {
    const job = new Job(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return job
  }
}
