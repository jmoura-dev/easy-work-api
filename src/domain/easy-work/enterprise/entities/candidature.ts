import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CandidatureProps {
  developerId: UniqueEntityID
  jobId: UniqueEntityID
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Candidature extends Entity<CandidatureProps> {
  get candidatureId() {
    return this.props.developerId
  }

  get jobId() {
    return this.props.jobId
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CandidatureProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const candidature = new Candidature(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return candidature
  }
}
